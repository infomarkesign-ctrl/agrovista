import type { RequestHandler } from 'express';
import nodemailer from 'nodemailer';

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent: Record<string, number[]> = {};

const escapeHtml = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

// Quick Enquiry form → email to the support inbox, with Reply-To set to the customer.
export const sendEnquiry: RequestHandler = async (req, res) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  recent[ip] = (recent[ip] || []).filter((t) => now - t < WINDOW_MS);
  if (recent[ip].length >= MAX_PER_WINDOW) {
    res.status(429).json({ error: 'Too many enquiries. Please try again later or email us directly.' });
    return;
  }

  const name = String(req.body.name || '').trim().slice(0, 100);
  const email = String(req.body.email || '').trim().slice(0, 200);
  const phone = String(req.body.phone || '').replace(/\D/g, '').slice(0, 10);
  const product = String(req.body.product || '').trim().slice(0, 200);
  const message = String(req.body.message || '').trim().slice(0, 3000);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Please enter your name and a valid email address.' });
    return;
  }
  if (!message && !product) {
    res.status(400).json({ error: 'Please tell us what you are looking for.' });
    return;
  }

  const port = parseInt(process.env.HOSTINGER_PORT || '465');
  const transporter = nodemailer.createTransport({
    host: process.env.HOSTINGER_SMTP || 'smtp.hostinger.com',
    port,
    secure: port === 465,
    auth: { user: process.env.HOSTINGER_EMAIL, pass: process.env.HOSTINGER_PASSWORD },
  });

  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone || '—'],
    ['Product of interest', product || '—'],
    ['Requirement', message || '—'],
  ];

  try {
    await transporter.sendMail({
      from: `"Agrovista Website" <${process.env.HOSTINGER_EMAIL}>`,
      to: process.env.HOSTINGER_EMAIL,
      replyTo: `"${name.replace(/"/g, '')}" <${email}>`,
      subject: `New enquiry from ${name}${product ? ` — ${product}` : ''}`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #065f46;">New website enquiry</h2>
          <table cellpadding="6" style="border-collapse: collapse;">
            ${rows.map(([k, v]) => `<tr><td style="color:#666;vertical-align:top;"><b>${k}</b></td><td style="white-space:pre-wrap;">${escapeHtml(v)}</td></tr>`).join('')}
          </table>
          <p style="color:#999;font-size:12px;">Reply to this email to respond to the customer directly.</p>
        </div>
      `,
    });
    recent[ip].push(now);
    res.status(200).json({ message: 'Thank you! Our team will get back to you within 1–2 business days.' });
  } catch (error) {
    console.error('Enquiry email failed:', error);
    res.status(500).json({ error: 'Could not send your enquiry. Please email support@agrovista.shop directly.' });
  }
};
