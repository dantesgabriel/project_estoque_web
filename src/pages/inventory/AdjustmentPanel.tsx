import { useState } from "react";
import type { AdjustmentReason } from "../../types/adjustment";
import { adjustmentReasonLabels } from "../../types/adjustment";

interface AdjustmentPanelProps {
  onSubmit: (reason: AdjustmentReason, note?: string) => Promise<void>;
}

export function AdjustmentPanel({ onSubmit }: AdjustmentPanelProps) {
  const [reason, setReason] = useState<AdjustmentReason>("USO_NAO_REGISTRADO");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(reason, note || undefined);
      setDone(true);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Erro ao aplicar ajuste";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (done) {
    return <span className="text-xs text-emerald-600 font-medium">Ajuste aplicado</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value as AdjustmentReason)}
        className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
      >
        {Object.entries(adjustmentReasonLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Observação (opcional)"
        className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs w-40"
      />
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap"
      >
        {isSubmitting ? "..." : "Aplicar ajuste"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
