export type AdjustmentReason =
  | "PERDA"
  | "VENCIMENTO"
  | "USO_NAO_REGISTRADO"
  | "ERRO_CADASTRO"
  | "DESCARTE"
  | "OUTRO";

export const adjustmentReasonLabels: Record<AdjustmentReason, string> = {
  PERDA: "Perda",
  VENCIMENTO: "Vencimento",
  USO_NAO_REGISTRADO: "Uso não registrado",
  ERRO_CADASTRO: "Erro de cadastro",
  DESCARTE: "Descarte",
  OUTRO: "Outro",
};

export interface StockAdjustment {
  id: string;
  productId: string;
  inventoryItemId: string | null;
  previousQty: number;
  newQty: number;
  difference: number;
  reason: AdjustmentReason;
  note: string | null;
  createdAt: string;
}
