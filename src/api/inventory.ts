import { api } from "./client";
import type { CreateInventoryInput, Inventory, InventoryItem } from "../types/inventory";

export const inventoryApi = {
  async list(): Promise<Inventory[]> {
    const { data } = await api.get<Inventory[]>("/inventories");
    return data;
  },

  async getById(id: string): Promise<Inventory> {
    const { data } = await api.get<Inventory>(`/inventories/${id}`);
    return data;
  },

  async create(input: CreateInventoryInput): Promise<Inventory> {
    const { data } = await api.post<Inventory>("/inventories", input);
    return data;
  },

  async submitCount(
    inventoryId: string,
    itemId: string,
    countedQty: number,
    note?: string
  ): Promise<InventoryItem> {
    const { data } = await api.post<InventoryItem>(
      `/inventories/${inventoryId}/items/${itemId}/count`,
      { countedQty, note }
    );
    return data;
  },

  async close(id: string): Promise<Inventory> {
    const { data } = await api.post<Inventory>(`/inventories/${id}/close`);
    return data;
  },
};
