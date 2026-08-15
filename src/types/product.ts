export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string | null;
  categoryId: string;
  category: Category;
  unit: string;
  minStock: number;
  maxStock: number | null;
  location: string | null;
  currentStock: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  name?: string;
  categoryId?: string;
  lowStock?: boolean;
  zeroStock?: boolean;
  active?: boolean;
}

export interface CreateProductInput {
  name: string;
  sku: string;
  barcode?: string;
  categoryId: string;
  unit: string;
  minStock: number;
  maxStock?: number;
  location?: string;
}

export type UpdateProductInput = Partial<CreateProductInput> & { active?: boolean };
