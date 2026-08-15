interface StockBadgeProps {
  currentStock: number;
  minStock: number;
}

export function StockBadge({ currentStock, minStock }: StockBadgeProps) {
  if (currentStock === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-50 text-red-700 text-xs font-medium px-2.5 py-0.5">
        Zerado
      </span>
    );
  }

  if (currentStock <= minStock) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-0.5">
        Estoque baixo
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-0.5">
      OK
    </span>
  );
}
