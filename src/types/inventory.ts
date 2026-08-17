export type InventoryStatus = "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface InventoryItem {
  id: string;
  inventoryId: string;
  productId: string;
  expectedQty: number | null; // null quando blindMode esconde do funcionário
  countedQty: number | null;
  divergence: number | null;
  note: string | null;
  countedAt: string | null;
  product: {
    id: string;
    name: string;
    sku: string;
    unit: string;
  };
}

export interface Inventory {
  id: string;
  name: string;
  responsibleId: string;
  responsible: { id: string; name: string };
  status: InventoryStatus;
  blindMode: boolean;
  createdAt: string;
  closedAt: string | null;
  items: InventoryItem[];
}

export interface CreateInventoryInput {
  name: string;
  blindMode: boolean;
  productIds?: string[];
}
