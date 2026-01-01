export interface Grocery {
  id: string;
  name: string;
  quantity: number;
  category: string;
  notes?: string;
  image?: string;
  lowStockThreshold?: number;
}

export type GroceryCategory =
  | 'Fruits'
  | 'Vegetables'
  | 'Dairy'
  | 'Meat'
  | 'Bakery'
  | 'Beverages'
  | 'Snacks'
  | 'Other';

export const GROCERY_CATEGORIES: GroceryCategory[] = [
  'Fruits',
  'Vegetables',
  'Dairy',
  'Meat',
  'Bakery',
  'Beverages',
  'Snacks',
  'Other',
];
