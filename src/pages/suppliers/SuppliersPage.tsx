import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { suppliersApi } from "../../api/suppliers";
import { useToast } from "../../contexts/ToastContext";
import { Modal } from "../../components/ui/Modal";
import { TableSkeleton } from "../../components/ui/TableSkeleton";
import { SupplierForm } from "./SupplierForm";
import type { CreateSupplierInput, Supplier } from "../../types/supplier";

export function SuppliersPage() {
  const queryClient = useQueryClient(); const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false); const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>();
  const { data: suppliers = [], isLoading } = useQuery({ queryKey: ["suppliers"], queryFn: suppliersApi.list });
  const closeModal = () => { setIsModalOpen(false); setEditingSupplier(undefined); };
  const createMutation = useMutation({ mutationFn: suppliersApi.create, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["suppliers"] }); closeModal(); showToast("Fornecedor criado com sucesso"); } });
  const updateMutation = useMutation({ mutationFn: ({ id, input }: { id: string; input: Parameters<typeof suppliersApi.update>[1] }) => suppliersApi.update(id, input), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["suppliers"] }); closeModal(); showToast("Fornecedor atualizado com sucesso"); } });
  async function submit(input: CreateSupplierInput & { active?: boolean }) { if (editingSupplier) await updateMutation.mutateAsync({ id: editingSupplier.id, input }); else await createMutation.mutateAsync(input); }
  return <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Cadastros</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Fornecedores</h1><p className="mt-1 text-sm text-slate-500">Empresas que abastecem o estoque da clínica.</p></div><button onClick={() => setIsModalOpen(true)} className="rounded-xl bg-[#102a35] px-4 py-3 text-sm font-bold text-white hover:bg-[#17404d]">Novo fornecedor</button></div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3 font-medium">Fornecedor</th><th className="px-5 py-3 font-medium">Documento</th><th className="px-5 py-3 font-medium">Contato</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3" /></tr></thead><tbody className="divide-y divide-slate-100">{isLoading && <TableSkeleton columns={5} />}{!isLoading && suppliers.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-slate-500">Nenhum fornecedor cadastrado</td></tr>}{suppliers.map((supplier) => <tr key={supplier.id} className="hover:bg-slate-50"><td className="px-5 py-3 font-medium text-slate-900">{supplier.name}</td><td className="px-5 py-3 text-slate-600">{supplier.document ?? "-"}</td><td className="px-5 py-3 text-slate-600"><div>{supplier.contactName ?? "-"}</div><div className="text-xs text-slate-400">{supplier.phone ?? supplier.email ?? ""}</div></td><td className="px-5 py-3"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${supplier.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{supplier.active ? "Ativo" : "Inativo"}</span></td><td className="px-5 py-3 text-right"><button onClick={() => { setEditingSupplier(supplier); setIsModalOpen(true); }} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Editar</button></td></tr>)}</tbody></table></div></div>
    {isModalOpen && <Modal title={editingSupplier ? "Editar fornecedor" : "Novo fornecedor"} onClose={closeModal}><SupplierForm initialData={editingSupplier} onCancel={closeModal} onSubmit={submit} /></Modal>}
  </div>;
}
