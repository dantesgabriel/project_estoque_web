import { api } from "./client";
import type { MovementReason } from "../types/movement";

export interface MovementReport { summary: { movementsCount: number; totalIn: number; totalOut: number; periodBalance: number }; timeline: { date: string; totalIn: number; totalOut: number }[]; items: { id: string; createdAt: string; type: "IN" | "OUT"; reason: MovementReason; quantity: number; product: { id: string; name: string; sku: string; unit: string }; category: { id: string; name: string }; user: { name: string } }[]; }
export interface AdjustmentReport { summary: { adjustmentsCount: number; totalIncrease: number; totalDecrease: number; netDifference: number }; items: { id: string; createdAt: string; previousQty: number; newQty: number; difference: number; reason: string; product: { id: string; name: string; sku: string }; user: { name: string }; approvedBy: { name: string } | null }[]; }
export interface ConsumptionReport { summary: { appointmentsCount: number; consumedItemLines: number }; groups: { key: string; label: string; details?: string; appointmentsCount: number; products: { productName: string; sku: string; quantity: number; unit: string }[] }[]; }

export const reportsApi = {
  async movements(params: Record<string, string>): Promise<MovementReport> { const { data } = await api.get("/reports/movements", { params }); return data; },
  async adjustments(params: Record<string, string>): Promise<AdjustmentReport> { const { data } = await api.get("/reports/adjustments", { params }); return data; },
  async consumption(params: Record<string, string>): Promise<ConsumptionReport> { const { data } = await api.get("/reports/appointment-consumption", { params }); return data; },
};
