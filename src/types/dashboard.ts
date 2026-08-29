export interface DashboardActivity {
  type: "ENTRADA" | "SAIDA" | "AJUSTE";
  productName: string;
  sku: string;
  categoryName: string;
  quantity: number;
  userName: string;
  date: string;
}

export interface DashboardSummary {
  totalProducts: number;
  lowStockCount: number;
  zeroStockCount: number;
  pendingDivergences: number;
  inventoryInProgress: { id: string; name: string; createdAt: string } | null;
  recentActivity: DashboardActivity[];
}
