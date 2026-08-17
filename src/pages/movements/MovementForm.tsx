import { useState } from "react";
import type { FormEvent } from "react";
import type { Product } from "../../types/product";
import type { CreateMovementInput, MovementReason, MovementType } from "../../types/movement";
import { movementReasonLabels } from "../../types/movement";

// Motivos coerentes por tipo — entrada normalmente é compra; saída cobre os demais casos
// (uso interno, atendimento, perda, descarte, vencimento). Documento seção 9.
const reasonsByType: Record<MovementType, MovementReason[]> = {
  IN: ["COMPRA", "OUTRO"],
  OUT: ["USO_INTERNO", "ATENDIMENTO", "PERDA", "DESCARTE", "VENCIMENTO", "OUTRO"],
};

interface MovementFormProps {
  type: MovementType;
  products: Product[];
  onSubmit: (input: CreateMovementInput) => Promise<void>;
  onCancel: () => void;
}

export function MovementForm({ type, products, onSubmit, onCancel }: MovementFormProps) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState<MovementReason>(reasonsByType[type][0]);
  const [supplier, setSupplier] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProduct = products.find((p) => p.id === productId);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        productId,
        quantity: Number(quantity),
        reason,
        supplier: type === "IN" ? supplier || undefined : undefined,
        invoiceNumber: type === "IN" ? invoiceNumber || undefined : undefined,
        note: note || undefined,
      });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Erro ao registrar movimentação";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Produto</label>
        <select
          required
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className={inputClass}
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} (estoque atual: {product.currentStock} {product.unit})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Quantidade {selectedProduct ? `(${selectedProduct.unit})` : ""}</label>
          <input
            type="number"
            min={1}
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Motivo</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as MovementReason)}
            className={inputClass}
          >
            {reasonsByType[type].map((r) => (
              <option key={r} value={r}>
                {movementReasonLabels[r]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {type === "IN" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Fornecedor</label>
            <input
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Nº da nota fiscal</label>
            <input
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      )}

      <div>
        <label className={labelClass}>Observação</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg px-4 py-2 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !productId}
          className={`text-sm font-medium rounded-lg px-4 py-2 text-white transition-colors disabled:opacity-60 ${
            type === "IN" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isSubmitting ? "Registrando..." : type === "IN" ? "Registrar entrada" : "Registrar saída"}
        </button>
      </div>
    </form>
  );
}
