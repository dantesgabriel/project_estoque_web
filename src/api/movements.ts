import { api } from "./client";
import type { CreateMovementInput, StockMovement } from "../types/movement";

export const movementsApi = {
  async list(filters?: { productId?: string; type?: "IN" | "OUT" }): Promise<StockMovement[]> {
    const { data } = await api.get<StockMovement[]>("/stock-movements", { params: filters });
    return data;
  },

  async createEntry(input: CreateMovementInput): Promise<StockMovement> {
    const { data } = await api.post<StockMovement>("/stock-movements/entrada", input);
    return data;
  },

  async createExit(input: CreateMovementInput): Promise<StockMovement> {
    const { data } = await api.post<StockMovement>("/stock-movements/saida", input);
    return data;
  },
};
