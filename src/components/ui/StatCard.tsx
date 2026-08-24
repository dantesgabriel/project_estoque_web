interface StatCardProps {
  label: string;
  value: number | string;
  tone?: "default" | "warning" | "danger";
}

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-slate-900",
  warning: "text-amber-600",
  danger: "text-red-600",
};

export function StatCard({ label, value, tone = "default" }: StatCardProps) {
  const icon = tone === "danger" ? "!" : tone === "warning" ? "↗" : "✦";
  const accent = tone === "danger" ? "bg-rose-50 text-rose-600" : tone === "warning" ? "bg-amber-50 text-amber-600" : "bg-teal-50 text-teal-700";
  return (
    <div className="group bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={`grid size-9 place-items-center rounded-xl text-base font-bold ${accent}`}>{icon}</span>
      </div>
      <p className={`text-3xl font-bold tracking-tight mt-4 ${toneStyles[tone]}`}>{value}</p>
    </div>
  );
}
