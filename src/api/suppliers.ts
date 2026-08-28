import { api } from "./client";
import type { CreateSupplierInput, Supplier, UpdateSupplierInput } from "../types/supplier";

export const suppliersApi = {
  async list(): Promise<Supplier[]> {
    const { data } = await api.get<Supplier[]>("/suppliers");
    return data;
  },
  async create(input: CreateSupplierInput): Promise<Supplier> {
    const { data } = await api.post<Supplier>("/suppliers", input);
    return data;
  },
  async update(id: string, input: UpdateSupplierInput): Promise<Supplier> {
    const { data } = await api.patch<Supplier>(`/suppliers/${id}`, input);
    return data;
  },
};
