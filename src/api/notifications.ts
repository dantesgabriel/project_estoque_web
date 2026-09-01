import { api } from "./client";

export type NotificationType = "LOW_STOCK" | "ZERO_STOCK" | "PENDING_DIVERGENCE" | "EXPIRED_BATCH" | "EXPIRING_BATCH";
export interface NotificationSummary { total: number; items: { type: NotificationType; severity: "warning" | "critical"; count: number }[]; }
export const notificationsApi = { async getSummary(): Promise<NotificationSummary> { const { data } = await api.get("/notifications/summary"); return data; } };
