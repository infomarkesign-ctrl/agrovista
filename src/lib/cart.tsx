import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CatalogItem, PackSize, Combo } from '@/data/catalog';
import { comboItemsSummary, resolveComboItem } from '@/data/catalog';

export type CartLine = {
  id: string; // product name + pack size
  kind: 'product' | 'combo';
  name: string;
  size: string;
  category: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
  details?: string; // combo contents, shown in cart and saved with the order
};

export type AddResult = { added: number; limited: boolean };

export { MIN_ORDER_AMOUNT } from '@/data/productData';

type CartContextValue = {
  lines: CartLine[];
  add: (product: CatalogItem, size: PackSize, quantity: number) => AddResult;
  addCombo: (combo: Combo, quantity: number) => AddResult;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => AddResult;
  clear: () => void;
  count: number;
  subtotal: number;
};

export const cartLineId = (name: string, size: string) => `${name}__${size}`;

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addLine = useCallback((item: Omit<CartLine, 'quantity'>, quantity: number): AddResult => {
    const id = item.id;
    let result: AddResult = { added: 0, limited: false };
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      const currentQty = existing?.quantity ?? 0;
      const desiredQty = currentQty + quantity;
      const cappedQty = Math.min(desiredQty, item.stock);
      result = { added: cappedQty - currentQty, limited: cappedQty < desiredQty };

      if (cappedQty === currentQty) {
        return prev;
      }
      if (existing) {
        return prev.map((l) =>
          l.id === id ? { ...l, quantity: cappedQty } : l
        );
      }
      return [...prev, { ...item, quantity: cappedQty }];
    });
    return result;
  }, []);

  const add = useCallback((product: CatalogItem, size: PackSize, quantity: number) => addLine({
    id: cartLineId(product.name, size.label),
    kind: 'product',
    name: product.name,
    size: size.label,
    category: product.category,
    price: size.price,
    image: product.image,
    stock: size.stock,
  }, quantity), [addLine]);

  const addCombo = useCallback((combo: Combo, quantity: number) => addLine({
    id: cartLineId('combo', combo.name),
    kind: 'combo',
    name: combo.name,
    size: `Combo of ${combo.items.length}`,
    category: 'Combo',
    price: combo.price,
    image: resolveComboItem(combo.items[0]).product?.image ?? '',
    stock: combo.stock,
    details: comboItemsSummary(combo),
  }, quantity), [addLine]);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, quantity: number): AddResult => {
    let result: AddResult = { added: 0, limited: false };
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (!existing) return prev;
      const cappedQty = Math.min(quantity, existing.stock);
      result = { added: cappedQty - existing.quantity, limited: cappedQty < quantity };
      return cappedQty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, quantity: cappedQty } : l));
    });
    return result;
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  return (
    <CartContext.Provider value={{ lines, add, addCombo, remove, setQuantity, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
