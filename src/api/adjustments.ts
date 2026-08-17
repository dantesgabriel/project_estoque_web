import { api } from "./client";
import type { AdjustmentReason, StockAdjustment } from "../types/adjustment";

export const adjustmentsApi = {
  async createFromInventory(
    inventoryItemId: string,
    reason: AdjustmentReason,
    note?: string
  ): Promise<StockAdjustment> {
    const { data } = await api.post<StockAdjustment>("/adjustments/de-inventario", {
      inventoryItemId,
      reason,
      note,
    });
    return data;
  },
};
