export function StatCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="skeleton h-4 bg-slate-200 rounded w-24 mb-2" />
      <div className="skeleton h-8 bg-slate-200 rounded w-12" />
    </div>
  );
}
