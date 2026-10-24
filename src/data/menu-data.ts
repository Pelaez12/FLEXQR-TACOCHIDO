import { CARTA_CATEGORIES } from './carta-data';
import type { MenuCategory } from '../types';
export const MENU_CATEGORIES: MenuCategory[] = CARTA_CATEGORIES.map(category => ({
  ...category, items: category.items.map(item => ({ ...item, description: item.description ?? '', price: item.price ?? 0, pricePending: item.price === undefined, imageUrl: item.imageUrl ?? '/taco-chido-logo-red.png' })),
}));
