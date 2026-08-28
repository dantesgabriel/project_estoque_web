export interface Supplier {
  id: string;
  name: string;
  document: string | null;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierInput {
  name: string;
  document?: string;
  contactName?: string;
  email?: string;
  phone?: string;
}

export type UpdateSupplierInput = Partial<CreateSupplierInput> & { active?: boolean };
