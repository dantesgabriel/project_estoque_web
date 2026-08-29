import { api } from "./client";
import type { Appointment, Batch, CreateAppointmentInput } from "../types/appointment";
import type { Tutor } from "../types/tutor";
import type { User } from "../types/user";

export const appointmentsApi = {
  async list(filters?: Record<string, string>): Promise<Appointment[]> { const { data } = await api.get<Appointment[]>("/appointments", { params: filters }); return data; },
  async getById(id: string): Promise<Appointment> { const { data } = await api.get<Appointment>(`/appointments/${id}`); return data; },
  async create(input: CreateAppointmentInput): Promise<Appointment> { const { data } = await api.post<Appointment>("/appointments", input); return data; },
  async cancel(id: string, reason: string): Promise<Appointment> { const { data } = await api.post<Appointment>(`/appointments/${id}/cancel`, { reason }); return data; },
  async history(tutorId: string): Promise<Tutor & { appointments: Appointment[] }> { const { data } = await api.get<Tutor & { appointments: Appointment[] }>(`/tutors/${tutorId}/history`); return data; },
  async responsibles(): Promise<User[]> { const { data } = await api.get<User[]>("/appointments/responsibles"); return data; },
  async batches(productId: string): Promise<Batch[]> { const { data } = await api.get<Batch[]>(`/batches/product/${productId}`); return data; },
};
