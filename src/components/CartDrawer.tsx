import { X, Minus, Plus, Trash2, ShoppingBag, IndianRupee, ArrowRight, AlertTriangle } from 'lucide-react';
import { useCart, MIN_ORDER_AMOUNT } from '@/lib/cart';
import { outOfStockContactEmail } from '@/data/catalog';

export function CartDrawer({
  open,
  onClose,
  onCheckout,
}: {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}) {
  const { lines, setQuantity, remove, subtotal, count } = useCart();
  const belowMinimum = subtotal > 0 && subtotal < MIN_ORDER_AMOUNT;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <h2 className="font-semibold text-stone-900">Your Cart</h2>
            <span className="text-sm text-stone-400">({count})</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 transition text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-stone-400 px-6">
            <ShoppingBag className="w-12 h-12 mb-3 opacity-40" />
            <p className="font-medium text-stone-500">Your cart is empty</p>
            <p className="text-sm mt-1">Add some products to get started.</p>
            <button
              onClick={onClose}
              className="mt-5 px-5 py-2.5 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {lines.map((l) => (
                <div key={l.id} className="flex gap-3 bg-stone-50 rounded-xl p-3">
                  <img src={l.image} alt={l.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-stone-900 text-sm truncate">{l.name}</h3>
                      <button
                        onClick={() => remove(l.id)}
                        className="text-stone-400 hover:text-red-500 transition shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-stone-500">{l.size} · ₹ {l.price} each</div>
                    {l.details && <div className="mt-0.5 text-[11px] text-stone-400 line-clamp-2">{l.details}</div>}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => setQuantity(l.id, l.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-stone-100 transition text-stone-700"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center text-sm font-semibold text-stone-900">{l.quantity}</span>
                        <button
                          onClick={() => setQuantity(l.id, l.quantity + 1)}
                          disabled={l.quantity >= l.stock}
                          className="w-7 h-7 flex items-center justify-center hover:bg-stone-100 transition text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-stone-900">
                        ₹ {(l.price * l.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                    {l.quantity >= l.stock && (
                      <div className="mt-2 flex items-start gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-2">
                        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span>
                          Out of stock. To order more, contact{' '}
                          <a href={`mailto:${outOfStockContactEmail}`} className="font-medium underline">
                            {outOfStockContactEmail}
                          </a>.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 px-5 py-4 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-stone-600">Subtotal</span>
                <span className="flex items-center font-bold text-stone-900 text-lg">
                  <IndianRupee className="w-4 h-4" />
                  {subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {belowMinimum ? (
                <p className="text-xs text-red-600">
                  Add ₹{(MIN_ORDER_AMOUNT - subtotal).toLocaleString('en-IN')} more to reach the ₹{MIN_ORDER_AMOUNT} minimum order amount.
                </p>
              ) : null}
              <button
                onClick={onCheckout}
                disabled={belowMinimum}
                className="w-full py-3.5 rounded-xl bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 hover:bg-emerald-800 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
