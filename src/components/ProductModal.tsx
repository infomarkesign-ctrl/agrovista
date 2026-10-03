import { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingCart, IndianRupee, Check, AlertTriangle } from 'lucide-react';
import type { CatalogItem } from '@/data/catalog';
import { outOfStockContactEmail } from '@/data/catalog';
import { useCart, cartLineId } from '@/lib/cart';
import { productCare, deliveryNote } from '@/data/content';

export function ProductModal({ product, onClose }: { product: CatalogItem | null; onClose: () => void }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [warning, setWarning] = useState(false);
  const [sizeIndex, setSizeIndex] = useState(0);
  const { lines, add } = useCart();

  useEffect(() => {
    if (product) {
      setQty(1);
      setAdded(false);
      setWarning(false);
      setSizeIndex(0);
    }
  }, [product]);

  if (!product) return null;

  const size = product.sizes[sizeIndex] ?? product.sizes[0];
  const inCartQty = lines.find((l) => l.id === cartLineId(product.name, size.label))?.quantity ?? 0;
  const remainingStock = Math.max(0, size.stock - inCartQty);

  const selectSize = (i: number) => {
    setSizeIndex(i);
    setQty(1);
    setWarning(false);
    setAdded(false);
  };
  const outOfStock = remainingStock <= 0;

  const increment = () => {
    setQty((q) => {
      if (q >= remainingStock) {
        setWarning(true);
        return q;
      }
      setWarning(false);
      return q + 1;
    });
  };

  const handleQtyInput = (value: number) => {
    if (value > remainingStock) {
      setQty(remainingStock || 1);
      setWarning(true);
      return;
    }
    setWarning(false);
    setQty(Math.max(1, value));
  };

  const handleAdd = () => {
    const result = add(product, size, qty);
    if (result.limited) {
      setWarning(true);
    }
    if (result.added > 0) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative grid md:grid-cols-2">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-stone-700 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="aspect-square md:aspect-auto md:h-full overflow-hidden bg-stone-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="p-6 md:p-8 flex flex-col">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">{product.category}</span>
            <h2 className="mt-2 text-2xl font-bold text-stone-900">{product.name}</h2>
            <p className="mt-3 text-stone-600 leading-relaxed text-sm">{product.description}</p>

            <div className="mt-5">
              <label className="text-sm font-medium text-stone-700">Select size</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {product.sizes.map((s, i) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => selectSize(i)}
                    className={`rounded-xl border px-2 py-2.5 text-center transition ${
                      i === sizeIndex
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-200'
                        : 'border-stone-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className={`text-sm font-semibold ${i === sizeIndex ? 'text-emerald-800' : 'text-stone-800'}`}>{s.label}</div>
                    <div className="text-xs text-stone-500 mt-0.5">₹{s.price.toLocaleString('en-IN')}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-baseline gap-1.5">
              <IndianRupee className="w-5 h-5 text-stone-900" />
              <span className="text-3xl font-bold text-stone-900">{size.price.toLocaleString('en-IN')}</span>
              <span className="text-stone-500 text-sm">/ {size.label} pack</span>
            </div>

            <div className="mt-3 text-sm">
              {outOfStock ? (
                <span className="font-medium text-red-600">Out of stock</span>
              ) : (
                <span className="text-stone-500">
                  Only <span className="font-semibold text-stone-700">{remainingStock}</span> packs of {size.label} left in stock
                </span>
              )}
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-stone-700">Quantity</label>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={outOfStock}
                    className="w-10 h-10 flex items-center justify-center hover:bg-stone-100 transition text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={remainingStock || 1}
                    value={qty}
                    disabled={outOfStock}
                    onChange={(e) => handleQtyInput(parseInt(e.target.value) || 1)}
                    className="w-14 h-10 text-center border-x border-stone-200 outline-none font-semibold text-stone-900 disabled:opacity-40"
                  />
                  <button
                    onClick={increment}
                    disabled={outOfStock}
                    className="w-10 h-10 flex items-center justify-center hover:bg-stone-100 transition text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-stone-500">× {size.label}</span>
              </div>
            </div>

            {warning && (
              <div className="mt-3 flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  Out of stock for the requested quantity. To order more, please contact{' '}
                  <a href={`mailto:${outOfStockContactEmail}`} className="font-medium underline">
                    {outOfStockContactEmail}
                  </a>.
                </span>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-stone-500">Item total</span>
              <span className="font-semibold text-stone-900">
                ₹ {(size.price * qty).toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className={`mt-6 w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                added ? 'bg-green-600 text-white' : 'bg-emerald-700 text-white hover:bg-emerald-800'
              }`}
            >
              {outOfStock ? (
                <>Out of Stock</>
              ) : added ? (
                <><Check className="w-5 h-5" /> Added to Cart</>
              ) : (
                <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
              )}
            </button>

            <p className="mt-3 text-center text-xs text-stone-500">{deliveryNote}</p>

            {productCare[product.category] && (
              <dl className="mt-6 pt-5 border-t border-stone-200 space-y-3 text-sm">
                {productCare[product.category].map((c) => (
                  <div key={c.label}>
                    <dt className="font-medium text-stone-800">{c.label}</dt>
                    <dd className="text-stone-500 leading-relaxed">{c.text}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
