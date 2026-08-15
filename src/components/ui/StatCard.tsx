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
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-3xl font-semibold mt-1 ${toneStyles[tone]}`}>{value}</p>
    </div>
  );
}
