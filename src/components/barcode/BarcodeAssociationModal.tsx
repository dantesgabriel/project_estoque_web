import { useState } from "react";
import { Modal } from "../ui/Modal";

interface BarcodeAssociationModalProps {
  barcode: string;
  products: { id: string; name: string; sku: string }[];
  onClose: () => void;
  onAssociate: (productId: string) => Promise<void>;
}

// Surge apenas para códigos ainda desconhecidos. Depois da associação, a leitura
// seguinte já identifica o produto automaticamente.
export function BarcodeAssociationModal({ barcode, products, onClose, onAssociate }: BarcodeAssociationModalProps) {
  const [productId, setProductId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!productId) return;
    setSaving(true); setError(null);
    try { await onAssociate(productId); onClose(); }
    catch (associationError) { setError(associationError instanceof Error ? associationError.message : "Não foi possível vincular o código"); }
    finally { setSaving(false); }
  }

  return <Modal title="Vincular código ao produto" onClose={onClose}>
    <div className="space-y-4">
      <p className="text-sm text-slate-600">O código <strong>{barcode}</strong> ainda não está cadastrado. Selecione a qual produto ele corresponde.</p>
      <select value={productId} onChange={(event) => setProductId(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
        <option value="">Selecione o produto</option>
        {products.map((product) => <option key={product.id} value={product.id}>{product.name} · SKU {product.sku}</option>)}
      </select>
      {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-slate-600">Cancelar</button><button type="button" onClick={() => void submit()} disabled={!productId || saving} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? "Vinculando..." : "Vincular produto"}</button></div>
    </div>
  </Modal>;
}
