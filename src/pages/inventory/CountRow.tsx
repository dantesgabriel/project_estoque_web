import { useState } from "react";
import type { InventoryItem } from "../../types/inventory";

interface CountRowProps {
  item: InventoryItem;
  canCount: boolean;
  blindMode: boolean;
  onSubmit: (countedQty: number, note?: string) => Promise<void>;
}

export function CountRow({ item, canCount, blindMode, onSubmit }: CountRowProps) {
  const [countedQty, setCountedQty] = useState(item.countedQty?.toString() ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const alreadyCounted = item.countedQty !== null;

  async function handleSubmit() {
    if (countedQty === "") return;
    setIsSubmitting(true);
    try {
      await onSubmit(Number(countedQty));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-5 py-3 text-slate-900 font-medium">{item.product.name}</td>
      <td className="px-5 py-3 text-slate-600">{item.product.sku}</td>
      <td className="px-5 py-3 text-slate-600">
        {/* No modo cego, expectedQty vem null da API enquanto o inventário está em andamento. */}
        {blindMode && !alreadyCounted ? (
          <span className="text-slate-400 italic">oculto</span>
        ) : (
          `${item.expectedQty} ${item.product.unit}`
        )}
      </td>
      <td className="px-5 py-3">
        {canCount && !alreadyCounted ? (
          <input
            type="number"
            min={0}
            value={countedQty}
            onChange={(e) => setCountedQty(e.target.value)}
            className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Qtd."
          />
        ) : (
          <span className="text-slate-900">
            {item.countedQty ?? "—"} {alreadyCounted ? item.product.unit : ""}
          </span>
        )}
      </td>
      <td className="px-5 py-3">
        {item.divergence !== null && item.divergence !== 0 && (
          <span
            className={`text-sm font-medium ${
              item.divergence < 0 ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {item.divergence > 0 ? "+" : ""}
            {item.divergence}
          </span>
        )}
        {item.divergence === 0 && <span className="text-xs text-slate-400">sem divergência</span>}
      </td>
      <td className="px-5 py-3 text-right">
        {canCount && !alreadyCounted && (
          <button
            onClick={handleSubmit}
            disabled={countedQty === "" || isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg px-3 py-1.5 transition-colors"
          >
            {isSubmitting ? "..." : "Confirmar"}
          </button>
        )}
      </td>
    </tr>
  );
}
