import { api } from "./client";
import type { Category } from "../types/product";

export const categoriesApi = {
  async list(): Promise<Category[]> {
    const { data } = await api.get<Category[]>("/categories");
    return data;
  },

  async create(name: string): Promise<Category> {
    const { data } = await api.post<Category>("/categories", { name });
    return data;
  },
};
