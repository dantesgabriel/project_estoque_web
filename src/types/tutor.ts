export type DocumentType = "CPF" | "CNPJ";
export type PetSpecies = "CAO" | "GATO" | "AVE" | "ROEDOR" | "REPTIL" | "OUTRO";

export interface Pet {
  id: string;
  tutorId: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  birthDate: string | null;
  approximateAge: string | null;
  notes: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tutor {
  id: string;
  name: string;
  documentType: DocumentType;
  document: string;
  rg: string | null;
  phone: string;
  email: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  active: boolean;
  pets?: Pet[];
  _count?: { pets: number; appointments: number };
}

export interface CreateTutorInput {
  name: string; documentType: DocumentType; document: string; rg?: string; phone: string; email: string;
  street: string; number: string; complement?: string; neighborhood: string; city: string; state: string; zipCode: string;
}
export type UpdateTutorInput = Partial<CreateTutorInput> & { active?: boolean };
export interface CreatePetInput { name: string; species: PetSpecies; breed?: string; birthDate?: string; approximateAge?: string; notes?: string; }
export type UpdatePetInput = Partial<CreatePetInput> & { active?: boolean };

export const speciesLabels: Record<PetSpecies, string> = { CAO: "Cão", GATO: "Gato", AVE: "Ave", ROEDOR: "Roedor", REPTIL: "Réptil", OUTRO: "Outro" };
