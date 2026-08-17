import type { InventoryStatus } from "../../types/inventory";

const statusConfig: Record<InventoryStatus, { label: string; className: string }> = {
  IN_PROGRESS: { label: "Em andamento", className: "bg-indigo-50 text-indigo-700" },
  COMPLETED: { label: "Concluído", className: "bg-emerald-50 text-emerald-700" },
  CANCELLED: { label: "Cancelado", className: "bg-slate-100 text-slate-600" },
};

export function InventoryStatusBadge({ status }: { status: InventoryStatus }) {
  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center rounded-full text-xs font-medium px-2.5 py-0.5 ${config.className}`}>
      {config.label}
    </span>
  );
}
