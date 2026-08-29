import type { Appointment } from "../types/appointment";

export async function exportAppointmentReport(appointment: Appointment) {
  const [{ jsPDF }, autoTableModule] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const document = new jsPDF();
  const autoTable = autoTableModule.default;
  document.setFontSize(16); document.text("Laudo de atendimento veterinário", 14, 18);
  document.setFontSize(10); document.setTextColor(70);
  document.text(`Tutor: ${appointment.tutor.name}`, 14, 29);
  document.text(`Pet: ${appointment.pet.name}`, 14, 36);
  document.text(`Data: ${new Date(appointment.attendedAt).toLocaleString("pt-BR")}`, 14, 43);
  document.text(`Responsável: ${appointment.responsible.name}`, 14, 50);
  document.text(`Motivo: ${appointment.reason}`, 14, 57, { maxWidth: 180 });
  if (appointment.notes) document.text(`Observações: ${appointment.notes}`, 14, 67, { maxWidth: 180 });
  autoTable(document, { startY: appointment.notes ? 78 : 66, head: [["Produto", "SKU", "Quantidade", "Lote"]], body: appointment.items.map((item) => [item.productName, item.productSku, `${item.quantity} ${item.unit}`, item.stockMovement.batch?.batchNumber ?? "Sem lote"]), headStyles: { fillColor: [15, 118, 110] } });
  document.save(`laudo_atendimento_${appointment.id}.pdf`);
}
