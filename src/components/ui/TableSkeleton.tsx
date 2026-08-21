interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export function TableSkeleton({ columns, rows = 5 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-5 py-3">
              <div className="skeleton h-4 bg-slate-200 rounded" style={{ width: `${60 + ((rowIndex + colIndex) % 3) * 15}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
