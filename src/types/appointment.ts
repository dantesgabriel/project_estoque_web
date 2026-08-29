export interface Batch { id: string; batchNumber: string | null; expirationDate: string; quantity: number; }
export interface AppointmentItem { id: string; productId: string; quantity: number; productName: string; productSku: string; unit: string; stockMovement: { id: string; batch: Batch | null }; }
export interface Appointment {
  id: string; attendedAt: string; reason: string; notes: string | null; status: "COMPLETED" | "CANCELLED"; cancelledAt: string | null; cancelReason: string | null;
  tutor: { id: string; name: string; document: string; phone: string; email: string };
  pet: { id: string; name: string; species: string; breed: string | null };
  responsible: { id: string; name: string }; createdBy: { id: string; name: string }; items: AppointmentItem[];
}
export interface CreateAppointmentInput { tutorId: string; petId: string; responsibleId: string; attendedAt?: string; reason: string; notes?: string; items: { productId: string; quantity: number; batchId?: string }[]; }
