import { useState } from "react";
import { exportToExcel, exportToPdf } from "../../utils/exports";
import type { ExportColumn } from "../../utils/exports";

interface ExportButtonsProps<T> {
  filename: string;
  title: string;
  columns: ExportColumn<T>[];
  rows: T[];
}

export function ExportButtons<T>({ filename, title, columns, rows }: ExportButtonsProps<T>) {
  const [exporting, setExporting] = useState<"excel" | "pdf" | null>(null);
  const disabled = rows.length === 0 || exporting !== null;
  const options = { filename, title, columns, rows };

  async function handleExport(format: "excel" | "pdf") {
    setExporting(format);
    try {
      if (format === "excel") {
        await exportToExcel(options);
      } else {
        await exportToPdf(options);
      }
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => void handleExport("excel")}
        className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {exporting === "excel" ? "Exportando..." : "Excel"}
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => void handleExport("pdf")}
        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {exporting === "pdf" ? "Exportando..." : "PDF"}
      </button>
    </div>
  );
}
