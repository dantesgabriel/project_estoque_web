import { useState } from "react";
import type { FormEvent } from "react";
import type { CreateInventoryInput } from "../../types/inventory";

interface CreateInventoryFormProps {
  onSubmit: (input: CreateInventoryInput) => Promise<void>;
  onCancel: () => void;
}

export function CreateInventoryForm({ onSubmit, onCancel }: CreateInventoryFormProps) {
  const [name, setName] = useState("");
  const [blindMode, setBlindMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // productIds omitido de propósito: inclui todos os produtos ativos.
      // Seleção parcial de produtos fica pra uma iteração futura, se necessário.
      await onSubmit({ name, blindMode });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Erro ao criar inventário";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nome do inventário</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Inventário Geral - Agosto/2026"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={blindMode}
          onChange={(e) => setBlindMode(e.target.checked)}
          className="mt-0.5"
        />
        <span className="text-sm text-slate-700">
          <span className="font-medium">Contagem cega</span>
          <br />
          <span className="text-slate-500 text-xs">
            Quem contar não verá a quantidade esperada pelo sistema, evitando influência no
            resultado.
          </span>
        </span>
      </label>

      <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
        Todos os produtos ativos entrarão nesse inventário automaticamente.
      </p>

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
          {isSubmitting ? "Criando..." : "Iniciar inventário"}
        </button>
      </div>
    </form>
  );
}
