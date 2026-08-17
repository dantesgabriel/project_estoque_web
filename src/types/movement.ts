export type MovementType = "IN" | "OUT";

export type MovementReason =
  | "COMPRA"
  | "USO_INTERNO"
  | "ATENDIMENTO"
  | "PERDA"
  | "DESCARTE"
  | "VENCIMENTO"
  | "OUTRO";

export const movementReasonLabels: Record<MovementReason, string> = {
  COMPRA: "Compra",
  USO_INTERNO: "Uso interno",
  ATENDIMENTO: "Atendimento",
  PERDA: "Perda",
  DESCARTE: "Descarte",
  VENCIMENTO: "Vencimento",
  OUTRO: "Outro",
};

export interface StockMovement {
  id: string;
  productId: string;
  product: { id: string; name: string; sku: string; unit: string };
  type: MovementType;
  quantity: number;
  reason: MovementReason;
  supplier: string | null;
  invoiceNumber: string | null;
  note: string | null;
  user: { id: string; name: string };
  createdAt: string;
}

export interface CreateMovementInput {
  productId: string;
  quantity: number;
  reason: MovementReason;
  supplier?: string;
  invoiceNumber?: string;
  note?: string;
}
