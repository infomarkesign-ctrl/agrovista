import { useState } from 'react';
import { Check, ShoppingCart, Gift, AlertTriangle } from 'lucide-react';
import { combos, comboValue, resolveComboItem, outOfStockContactEmail, type Combo } from '@/data/catalog';
import { useCart, cartLineId } from '@/lib/cart';

export function CombosSection() {
  return (
    <section id="combos" className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-emerald-700 text-xs font-semibold tracking-[0.2em] uppercase">Save more together</span>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">Combo Offers</h2>
        <p className="mt-4 text-stone-600">Jaggery and honey bundled together, for less than buying each item separately.</p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {combos.map((c) => <ComboCard key={c.name} combo={c} />)}
      </div>
    </section>
  );
}

function ComboCard({ combo }: { combo: Combo }) {
  const { lines, addCombo } = useCart();
  const [added, setAdded] = useState(false);
  const [limited, setLimited] = useState(false);

  const value = comboValue(combo);
  const saving = value - combo.price;
  const percent = Math.round((saving / value) * 100);
  const items = combo.items.map((i) => {
    const { product, price } = resolveComboItem(i);
    return { ...i, image: product?.image, price };
  });
  const inCart = lines.find((l) => l.id === cartLineId('combo', combo.name))?.quantity ?? 0;
  const soldOut = inCart >= combo.stock;

  const handleAdd = () => {
    const result = addCombo(combo, 1);
    setLimited(result.limited);
    if (result.added > 0) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
      <div className="relative grid grid-cols-4 gap-px bg-stone-200 h-28">
        {items.slice(0, 4).map((i) => (
          <img key={i.product + i.size} src={i.image} alt={i.product} className="w-full h-full object-cover" />
        ))}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow">
          {percent}% OFF
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-emerald-700" />
          <h3 className="font-bold text-stone-900 text-lg">{combo.name}</h3>
        </div>
        <p className="mt-1 text-sm text-stone-500">
          {combo.tagline}: total ₹{value.toLocaleString('en-IN')}, <span className="font-semibold text-emerald-700">save ₹{saving.toLocaleString('en-IN')}</span>
        </p>

        <ul className="mt-5 space-y-2.5 flex-1">
          {items.map((i) => (
            <li key={i.product + i.size} className="flex items-start justify-between gap-3 text-sm">
              <span className="flex items-start gap-2 text-stone-700">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>{i.product} <span className="text-stone-400">({i.size})</span></span>
              </span>
              <span className="font-medium text-stone-800 shrink-0">₹{i.price.toLocaleString('en-IN')}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 pt-4 border-t border-dashed border-stone-200 space-y-1.5 text-sm">
          <div className="flex items-center justify-between text-stone-500">
            <span>Total Value</span>
            <span className="line-through">₹{value.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-stone-900">Combo Price</span>
            <span className="text-2xl font-bold text-emerald-700">₹{combo.price.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {limited && (
          <div className="mt-3 flex items-start gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>
              No more stock for this combo. For bulk orders contact{' '}
              <a href={`mailto:${outOfStockContactEmail}`} className="font-medium underline">{outOfStockContactEmail}</a>.
            </span>
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={soldOut && !added}
          className={`mt-5 w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
            added ? 'bg-green-600 text-white' : 'bg-emerald-700 text-white hover:bg-emerald-800'
          }`}
        >
          {added ? (
            <><Check className="w-5 h-5" /> Added to Cart</>
          ) : soldOut ? (
            <>Out of Stock</>
          ) : (
            <><ShoppingCart className="w-5 h-5" /> Add Combo to Cart</>
          )}
        </button>
        {inCart > 0 && !added && (
          <p className="mt-2 text-center text-xs text-stone-500">{inCart} in cart</p>
        )}
      </div>
    </div>
  );
}
