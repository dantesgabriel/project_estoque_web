import { api } from "./client";
import type { CreatePetInput, CreateTutorInput, Pet, Tutor, UpdatePetInput, UpdateTutorInput } from "../types/tutor";

export const tutorsApi = {
  async list(search?: string): Promise<Tutor[]> { const { data } = await api.get<Tutor[]>("/tutors", { params: search ? { search } : undefined }); return data; },
  async getById(id: string): Promise<Tutor> { const { data } = await api.get<Tutor>(`/tutors/${id}`); return data; },
  async create(input: CreateTutorInput): Promise<Tutor> { const { data } = await api.post<Tutor>("/tutors", input); return data; },
  async update(id: string, input: UpdateTutorInput): Promise<Tutor> { const { data } = await api.patch<Tutor>(`/tutors/${id}`, input); return data; },
  async createPet(tutorId: string, input: CreatePetInput): Promise<Pet> { const { data } = await api.post<Pet>(`/tutors/${tutorId}/pets`, input); return data; },
  async updatePet(id: string, input: UpdatePetInput): Promise<Pet> { const { data } = await api.patch<Pet>(`/pets/${id}`, input); return data; },
};
