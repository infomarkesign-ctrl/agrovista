import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { RequestHandler } from 'express';
import nodemailer from 'nodemailer';
import { productData, combos, indianStates, MIN_ORDER_AMOUNT } from '../src/data/productData';
import { userFromRequest, rateLimited } from './session';

type OrderLine = { name: string; size: string; details?: string; price: number; quantity: number; lineTotal: number };

export type Order = {
  id: string;
  userId: number;
  createdAt: string;
  status: 'pending';
  paymentMethod: 'Cash on Delivery';
  customer: { name: string; email: string; phone: string; address: string; city: string; state: string; pincode: string };
  items: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
};

const ordersPath = path.join(process.cwd(), 'orders.json');

function loadOrders(): Order[] {
  try {
    return JSON.parse(fs.readFileSync(ordersPath, 'utf8')) as Order[];
  } catch {
    return [];
  }
}

function saveOrder(order: Order) {
  fs.writeFileSync(ordersPath, JSON.stringify([...loadOrders(), order], null, 2));
}

const escapeHtml = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

function newOrderId() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `AGV-${ymd}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

// Prices always come from the catalog on the server, never from the browser.
function priceLine(item: { kind?: string; name?: string; size?: string; quantity?: number }): OrderLine | string {
  const quantity = Math.floor(Number(item.quantity));
  if (!Number.isFinite(quantity) || quantity < 1) return `Invalid quantity for ${item.name}`;

  if (item.kind === 'combo') {
    const combo = combos.find((c) => c.name === item.name);
    if (!combo) return `Unknown combo: ${item.name}`;
    if (quantity > combo.stock) return `Only ${combo.stock} of ${combo.name} available`;
    return {
      name: combo.name,
      size: `Combo of ${combo.items.length}`,
      details: combo.items.map((i) => `${i.product} ${i.size}`).join(', '),
      price: combo.price,
      quantity,
      lineTotal: combo.price * quantity,
    };
  }

  const product = productData.find((p) => p.name === item.name);
  const size = product?.sizes.find((s) => s.label === item.size);
  if (!product || !size) return `Unknown product: ${item.name} ${item.size ?? ''}`.trim();
  if (quantity > size.stock) return `Only ${size.stock} packs of ${product.name} ${size.label} available`;
  return { name: product.name, size: size.label, price: size.price, quantity, lineTotal: size.price * quantity };
}

function itemsTable(order: Order) {
  const rows = order.items.map((i) => `
    <tr>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;">${escapeHtml(i.name)} <span style="color:#888;">(${escapeHtml(i.size)})</span>
        ${i.details ? `<div style="color:#888;font-size:12px;">${escapeHtml(i.details)}</div>` : ''}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center;">${i.quantity}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right;">${inr(i.lineTotal)}</td>
    </tr>`).join('');
  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr style="background:#f5f5f4;"><th style="padding:6px 8px;text-align:left;">Item</th><th style="padding:6px 8px;">Qty</th><th style="padding:6px 8px;text-align:right;">Amount</th></tr>
      ${rows}
      <tr><td colspan="2" style="padding:6px 8px;text-align:right;">Shipping</td><td style="padding:6px 8px;text-align:right;">Free</td></tr>
      <tr><td colspan="2" style="padding:6px 8px;text-align:right;"><b>Total (Cash on Delivery)</b></td><td style="padding:6px 8px;text-align:right;"><b>${inr(order.total)}</b></td></tr>
    </table>`;
}

async function sendOrderEmails(order: Order) {
  const port = parseInt(process.env.HOSTINGER_PORT || '465');
  const transporter = nodemailer.createTransport({
    host: process.env.HOSTINGER_SMTP || 'smtp.hostinger.com',
    port,
    secure: port === 465,
    auth: { user: process.env.HOSTINGER_EMAIL, pass: process.env.HOSTINGER_PASSWORD },
  });
  const from = `"Agrovista" <${process.env.HOSTINGER_EMAIL}>`;
  const c = order.customer;
  const address = `${c.address}, ${c.city}, ${c.state} – ${c.pincode}`;

  const results = await Promise.allSettled([
    // To the business
    transporter.sendMail({
      from,
      to: process.env.HOSTINGER_EMAIL,
      replyTo: c.email,
      subject: `New order ${order.id} — ${inr(order.total)} (COD) from ${c.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;">
          <h2 style="color:#065f46;">New order ${order.id}</h2>
          <p><b>${escapeHtml(c.name)}</b> · ${escapeHtml(c.phone)} · ${escapeHtml(c.email)}<br>${escapeHtml(address)}</p>
          ${itemsTable(order)}
          <p style="color:#888;font-size:12px;">Placed ${new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
        </div>`,
    }),
    // Confirmation to the customer
    transporter.sendMail({
      from,
      to: c.email,
      replyTo: process.env.HOSTINGER_EMAIL,
      subject: `Your Agrovista order ${order.id} is confirmed`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;">
          <h2 style="color:#065f46;">Thank you for your order, ${escapeHtml(c.name.split(' ')[0])}!</h2>
          <p>We have received your order <b>${order.id}</b>. It will be dispatched within 1–2 business days and usually arrives in 3–7 business days. Please keep <b>${inr(order.total)}</b> ready to pay on delivery.</p>
          ${itemsTable(order)}
          <p><b>Delivery address:</b><br>${escapeHtml(address)}</p>
          <p style="color:#666;font-size:13px;">To cancel (within 12 hours, before dispatch) or for any help, reply to this email or call +91 73042 10746.</p>
        </div>`,
    }),
  ]);
  results.forEach((r) => { if (r.status === 'rejected') console.error('Order email failed:', r.reason); });
}

export const placeOrder: RequestHandler = async (req, res) => {
  const user = userFromRequest(req);
  if (!user) {
    res.status(401).json({ error: 'Please log in to place your order.' });
    return;
  }
  if (rateLimited('order', String(user.id), 10, 60 * 60 * 1000)) {
    res.status(429).json({ error: 'Too many orders in a short time. Please contact support@agrovista.shop.' });
    return;
  }

  const b = req.body?.customer ?? {};
  const customer = {
    name: String(b.name || '').trim().slice(0, 100),
    email: String(b.email || '').trim().slice(0, 200),
    phone: String(b.phone || '').replace(/\D/g, ''),
    address: String(b.address || '').trim().slice(0, 500),
    city: String(b.city || '').trim().slice(0, 100),
    state: String(b.state || '').trim(),
    pincode: String(b.pincode || '').replace(/\D/g, ''),
  };
  if (!customer.name || !customer.address || !customer.city) {
    res.status(400).json({ error: 'Please fill in your name and full delivery address.' });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    res.status(400).json({ error: 'Please enter a valid email address.' });
    return;
  }
  if (!/^\d{10}$/.test(customer.phone)) {
    res.status(400).json({ error: 'Please enter a valid 10-digit phone number.' });
    return;
  }
  if (!/^\d{6}$/.test(customer.pincode)) {
    res.status(400).json({ error: 'Please enter a valid 6-digit pincode.' });
    return;
  }
  if (!indianStates.includes(customer.state)) {
    res.status(400).json({ error: 'Please select your state. We deliver only within India.' });
    return;
  }

  const rawItems = Array.isArray(req.body?.items) ? req.body.items.slice(0, 50) : [];
  if (rawItems.length === 0) {
    res.status(400).json({ error: 'Your cart is empty.' });
    return;
  }
  const items: OrderLine[] = [];
  for (const raw of rawItems) {
    const line = priceLine(raw);
    if (typeof line === 'string') {
      res.status(400).json({ error: line });
      return;
    }
    items.push(line);
  }

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  if (subtotal < MIN_ORDER_AMOUNT) {
    res.status(400).json({ error: `Minimum order amount is ₹${MIN_ORDER_AMOUNT}.` });
    return;
  }

  const order: Order = {
    id: newOrderId(),
    userId: user.id,
    createdAt: new Date().toISOString(),
    status: 'pending',
    paymentMethod: 'Cash on Delivery',
    customer,
    items,
    subtotal,
    shipping: 0,
    total: subtotal,
  };

  try {
    saveOrder(order);
  } catch (error) {
    console.error('Saving order failed:', error);
    res.status(500).json({ error: 'Could not place your order. Please try again or call +91 73042 10746.' });
    return;
  }

  // The order is saved; email problems must not fail it.
  await sendOrderEmails(order);
  res.status(201).json({ orderId: order.id, total: order.total });
};
