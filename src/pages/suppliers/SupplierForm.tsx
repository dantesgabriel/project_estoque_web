import { useState } from "react";
import type { FormEvent } from "react";
import { extractErrorMessage } from "../../api/errors";
import type { CreateSupplierInput, Supplier } from "../../types/supplier";

interface SupplierFormProps { initialData?: Supplier; onCancel: () => void; onSubmit: (input: CreateSupplierInput & { active?: boolean }) => Promise<void>; }

export function SupplierForm({ initialData, onCancel, onSubmit }: SupplierFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [document, setDocument] = useState(initialData?.document ?? "");
  const [contactName, setContactName] = useState(initialData?.contactName ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [active, setActive] = useState(initialData?.active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputClass = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const labelClass = "mb-1 block text-sm font-medium text-slate-700";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); setError(null); setIsSubmitting(true);
    try { await onSubmit({ name, document: document || undefined, contactName: contactName || undefined, email: email || undefined, phone: phone || undefined, active }); }
    catch (err: unknown) { setError(extractErrorMessage(err, "Erro ao salvar fornecedor")); }
    finally { setIsSubmitting(false); }
  }

  return <form onSubmit={handleSubmit} className="space-y-4">
    <div><label className={labelClass}>Nome</label><input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} /></div>
    <div className="grid grid-cols-2 gap-4"><div><label className={labelClass}>CNPJ / CPF</label><input value={document} onChange={(e) => setDocument(e.target.value)} className={inputClass} /></div><div><label className={labelClass}>Telefone</label><input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} /></div></div>
    <div className="grid grid-cols-2 gap-4"><div><label className={labelClass}>Contato</label><input value={contactName} onChange={(e) => setContactName(e.target.value)} className={inputClass} /></div><div><label className={labelClass}>E-mail</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></div></div>
    {initialData && <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />Fornecedor ativo</label>}
    {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
    <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancelar</button><button disabled={isSubmitting} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">{isSubmitting ? "Salvando..." : "Salvar"}</button></div>
  </form>;
}
