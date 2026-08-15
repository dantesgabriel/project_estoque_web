import { api } from "./client";
import type { DashboardSummary } from "../types/dashboard";

export const dashboardApi = {
  async getSummary(): Promise<DashboardSummary> {
    const { data } = await api.get<DashboardSummary>("/dashboard");
    return data;
  },
};
