import { useState } from "react";
import type { FormEvent } from "react";
import type { Category, CreateProductInput, Product } from "../../types/product";

interface ProductFormProps {
  categories: Category[];
  initialData?: Product;
  onSubmit: (input: CreateProductInput) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ categories, initialData, onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [sku, setSku] = useState(initialData?.sku ?? "");
  const [barcode, setBarcode] = useState(initialData?.barcode ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? categories[0]?.id ?? "");
  const [unit, setUnit] = useState(initialData?.unit ?? "");
  const [minStock, setMinStock] = useState(initialData?.minStock?.toString() ?? "0");
  const [maxStock, setMaxStock] = useState(initialData?.maxStock?.toString() ?? "");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        name,
        sku,
        barcode: barcode || undefined,
        categoryId,
        unit,
        minStock: Number(minStock),
        maxStock: maxStock ? Number(maxStock) : undefined,
        location: location || undefined,
      });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Erro ao salvar produto";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Nome</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>SKU / Código</label>
          <input
            required
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Código de barras</label>
          <input
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Categoria</label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputClass}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Unidade de medida</label>
          <input
            required
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="un, cx, ml..."
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Estoque mínimo</label>
          <input
            type="number"
            min={0}
            required
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Estoque máximo</label>
          <input
            type="number"
            min={0}
            value={maxStock}
            onChange={(e) => setMaxStock(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Localização</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Prateleira, armário..."
          className={inputClass}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg px-4 py-2 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
        >
          {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
