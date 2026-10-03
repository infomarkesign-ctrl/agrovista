import { useState } from 'react';
import { ArrowLeft, IndianRupee, Check, Loader2, ShoppingBag, Banknote, Smartphone, Landmark, CreditCard, Lock } from 'lucide-react';
import { useCart, MIN_ORDER_AMOUNT } from '@/lib/cart';
import { indianStates } from '@/data/catalog';
import { useAuth, postJSON } from '@/lib/auth';

export function CheckoutPage({ onBack }: { onBack: () => void }) {
  const { lines, subtotal, clear } = useCart();
  const { user, token, logout } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const total = subtotal;
  const belowMinimum = subtotal < MIN_ORDER_AMOUNT;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (belowMinimum) {
      setError(`Minimum order amount is ₹${MIN_ORDER_AMOUNT}.`);
      return;
    }
    setSubmitting(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const customer = Object.fromEntries(
      ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'].map((k) => [k, String(fd.get(k) ?? '')]),
    );
    // Prices are recalculated on the server; only names, sizes and quantities are sent.
    const items = lines.map((l) => ({ kind: l.kind, name: l.name, size: l.size, quantity: l.quantity }));

    try {
      const { ok, status, data } = await postJSON<{ orderId: string }>('/api/orders', { customer, items }, token);
      if (ok) {
        setSuccess(data.orderId);
        clear();
      } else if (status === 401) {
        setError('Your session has expired. Please log in again to place your order. Your cart is saved.');
        logout();
      } else {
        setError(data.error || 'Could not place your order. Please try again.');
      }
    } catch {
      setError('Could not reach our server. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-stone-900">Order Placed!</h1>
        <p className="mt-3 text-stone-600">
          Thank you for your order! A confirmation has been sent to your email. Your order will be dispatched within 1–2 business days. Please keep the amount ready to pay on delivery.
        </p>
        <div className="mt-6 inline-block bg-stone-100 rounded-xl px-6 py-4">
          <div className="text-xs text-stone-500 uppercase tracking-wider">Order ID</div>
          <div className="font-mono font-semibold text-stone-900 mt-1">{success}</div>
        </div>
        <div className="mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-12 h-12 mx-auto text-stone-300" />
        <h1 className="mt-4 text-2xl font-bold text-stone-900">Your cart is empty</h1>
        <p className="mt-2 text-stone-500">Add products before checking out.</p>
        <button
          onClick={onBack}
          className="mt-6 px-6 py-3 rounded-xl bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <button onClick={onBack} className="flex items-center gap-2 text-stone-600 hover:text-emerald-700 transition mb-6 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </button>

      <h1 className="text-3xl font-bold text-stone-900">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid lg:grid-cols-5 gap-8">
        {/* Shipping details */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="font-semibold text-stone-900 mb-4">Contact & Shipping Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field name="name" label="Full Name" required defaultValue={user?.fullName} />
              <Field name="email" label="Email" type="email" required defaultValue={user?.email ?? undefined} />
              <Field name="phone" label="Phone Number" type="tel" required pattern="[0-9]{10}" placeholder="10-digit mobile" defaultValue={user?.phoneNumber ?? undefined} />
              <Field name="pincode" label="Pincode" required pattern="[0-9]{6}" placeholder="6-digit pincode" />
            </div>
            <div className="mt-4">
              <Field name="address" label="Address" required textarea />
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <Field name="city" label="City" required />
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">State</label>
                <select
                  name="state"
                  required
                  defaultValue=""
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm bg-white"
                >
                  <option value="" disabled>Select state</option>
                  {indianStates.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sticky top-24">
            <h2 className="font-semibold text-stone-900 mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {lines.map((l) => (
                <div key={l.id} className="flex items-center gap-3 text-sm">
                  <img src={l.image} alt={l.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-stone-900 truncate">{l.name}</div>
                    <div className="text-xs text-stone-500">{l.size} · {l.quantity} × ₹{l.price}</div>
                  </div>
                  <div className="font-semibold text-stone-900">₹ {(l.price * l.quantity).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-stone-200 space-y-2 text-sm">
              <Row label="Subtotal" value={`₹ ${subtotal.toLocaleString('en-IN')}`} />
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                <span className="font-semibold text-stone-900">Total</span>
                <span className="flex items-center font-bold text-stone-900 text-xl">
                  <IndianRupee className="w-4 h-4" />
                  {total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-200">
              <h3 className="font-semibold text-stone-900 mb-3 text-sm">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 rounded-lg border-2 border-emerald-600 bg-emerald-50 px-3 py-2.5 cursor-pointer">
                  <input type="radio" name="payment_method" defaultChecked className="accent-emerald-700" />
                  <Banknote className="w-4 h-4 text-emerald-700" />
                  <span className="text-sm font-medium text-stone-900">Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 opacity-60 cursor-not-allowed">
                  <input type="radio" name="payment_method" disabled />
                  <Smartphone className="w-4 h-4 text-stone-400" />
                  <span className="text-sm text-stone-500 flex-1">UPI</span>
                  <span className="flex items-center gap-1 text-xs text-stone-400"><Lock className="w-3 h-3" /> Unavailable</span>
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 opacity-60 cursor-not-allowed">
                  <input type="radio" name="payment_method" disabled />
                  <Landmark className="w-4 h-4 text-stone-400" />
                  <span className="text-sm text-stone-500 flex-1">Net Banking</span>
                  <span className="flex items-center gap-1 text-xs text-stone-400"><Lock className="w-3 h-3" /> Unavailable</span>
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 opacity-60 cursor-not-allowed">
                  <input type="radio" name="payment_method" disabled />
                  <CreditCard className="w-4 h-4 text-stone-400" />
                  <span className="text-sm text-stone-500 flex-1">Cards</span>
                  <span className="flex items-center gap-1 text-xs text-stone-400"><Lock className="w-3 h-3" /> Unavailable</span>
                </label>
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting || belowMinimum}
              className="mt-5 w-full py-3.5 rounded-xl bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 hover:bg-emerald-800 transition shadow-sm disabled:opacity-60"
            >
              {submitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order...</>
              ) : (
                <>Place Order</>
              )}
            </button>
            <p className="mt-3 text-xs text-stone-400 text-center">Pay in cash when your order is delivered.</p>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  name, label, type = 'text', required, pattern, placeholder, textarea, defaultValue,
}: {
  name: string; label: string; type?: string; required?: boolean;
  pattern?: string; placeholder?: string; textarea?: boolean; defaultValue?: string;
}) {
  const cls = 'w-full px-3 py-2.5 rounded-lg border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm';
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      {textarea ? (
        <textarea name={name} required={required} placeholder={placeholder} rows={2} className={cls} />
      ) : (
        <input name={name} type={type} required={required} pattern={pattern} placeholder={placeholder} defaultValue={defaultValue} className={cls} />
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-stone-600">
      <span>{label}</span>
      <span className="font-medium text-stone-800">{value}</span>
    </div>
  );
}
