export interface ExportColumn<T> {
  header: string;
  value: (row: T) => string | number;
}

interface ExportOptions<T> {
  filename: string;
  title: string;
  columns: ExportColumn<T>[];
  rows: T[];
}

function safeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9_-]/g, "_");
}

export async function exportToExcel<T>({ filename, title, columns, rows }: ExportOptions<T>) {
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.aoa_to_sheet([
    [title],
    columns.map((column) => column.header),
    ...rows.map((row) => columns.map((column) => column.value(row))),
  ]);

  worksheet["!cols"] = columns.map((column) => ({ wch: Math.max(column.header.length + 2, 16) }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, title.slice(0, 31));
  XLSX.writeFile(workbook, `${safeFilename(filename)}.xlsx`);
}

export async function exportToPdf<T>({ filename, title, columns, rows }: ExportOptions<T>) {
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const document = new jsPDF({ orientation: columns.length > 5 ? "landscape" : "portrait" });
  const autoTable = autoTableModule.default;

  document.setFontSize(16);
  document.text(title, 14, 18);
  document.setFontSize(9);
  document.setTextColor(90);
  document.text(`Gerado em ${new Date().toLocaleString("pt-BR")}`, 14, 25);

  autoTable(document, {
    head: [columns.map((column) => column.header)],
    body: rows.map((row) => columns.map((column) => String(column.value(row)))),
    startY: 31,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [15, 118, 110] },
  });

  document.save(`${safeFilename(filename)}.pdf`);
}
