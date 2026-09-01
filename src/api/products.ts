import { api } from "./client";
import type { CreateProductInput, Product, ProductFilters, UpdateProductInput } from "../types/product";

export const productsApi = {
  async list(filters: ProductFilters): Promise<Product[]> {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined && value !== "")
    );

    const { data } = await api.get<Product[]>("/products", { params });
    return data;
  },

  async create(input: CreateProductInput): Promise<Product> {
    const { data } = await api.post<Product>("/products", input);
    return data;
  },

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    const { data } = await api.patch<Product>(`/products/${id}`, input);
    return data;
  },

  async getByBarcode(barcode: string): Promise<Product> {
    const { data } = await api.get<Product>(`/products/barcode/${encodeURIComponent(barcode)}`);
    return data;
  },

  async addBarcode(productId: string, barcode: string): Promise<Product> {
    const { data } = await api.post<Product>(`/products/${productId}/barcodes`, { barcode });
    return data;
  },
};
