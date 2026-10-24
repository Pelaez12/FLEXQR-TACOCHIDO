import { createContext, useContext, useState, ReactNode } from 'react';
import type { MenuItem } from '../types';

interface Item { key: string; product: MenuItem; quantity: number; instructions: string; }
interface Cart { items: Item[]; summary: { total: number; totalCount: number }; addItem: (product: MenuItem, quantity?: number, instructions?: string) => void; updateQuantity: (key: string, quantity: number) => void; clear: () => void; }
const Context = createContext<Cart | null>(null);
const STORAGE = 'taco_chido_carta_cart_v1';
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  // The cart lives only in this visit until ordering rules are confirmed.
  const summary = { total: items.reduce((sum, item) => sum + Math.round(item.product.price * 100) * item.quantity, 0) / 100, totalCount: items.reduce((sum, item) => sum + item.quantity, 0) };
  const addItem: Cart['addItem'] = (product, quantity = 1, instructions = '') => {
    if (product.pricePending) return;
    const key = JSON.stringify([product.id, instructions.trim()]);
    const count = Math.max(1, Math.min(99, Math.floor(quantity)));
    setItems(current => current.some(item => item.key === key)
      ? current.map(item => item.key === key ? { ...item, quantity: Math.min(99, item.quantity + count) } : item)
      : [...current, { key, product, quantity: count, instructions: instructions.trim() }]);
  };
  return <Context.Provider value={{ items, summary, addItem, updateQuantity: (key, quantity) => setItems(current => current.flatMap(item => item.key !== key ? [item] : quantity <= 0 ? [] : [{ ...item, quantity: Math.min(99, quantity) }])), clear: () => setItems([]) }}>{children}</Context.Provider>;
}
export function useCart() { const cart = useContext(Context); if (!cart) throw new Error(STORAGE); return cart; }
