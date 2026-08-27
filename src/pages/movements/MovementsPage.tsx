import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { movementsApi } from "../../api/movements";
import { productsApi } from "../../api/products";
import { useToast } from "../../contexts/ToastContext";
import { Modal } from "../../components/ui/Modal";
import { TableSkeleton } from "../../components/ui/TableSkeleton";
import { MovementForm } from "./MovementForm";
import { ExportButtons } from "../../components/ui/ExportButtons";
import { movementReasonLabels } from "../../types/movement";
import type { MovementType } from "../../types/movement";

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MovementsPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [modalType, setModalType] = useState<MovementType | null>(null);

  const { data: movements = [], isLoading } = useQuery({
    queryKey: ["stock-movements"],
    queryFn: () => movementsApi.list(),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products", { active: true }],
    queryFn: () => productsApi.list({ active: true }),
  });

  const entryMutation = useMutation({
    mutationFn: movementsApi.createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setModalType(null);
      showToast("Entrada registrada com sucesso");
    },
  });

  const exitMutation = useMutation({
    mutationFn: movementsApi.createExit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setModalType(null);
      showToast("Saída registrada com sucesso");
    },
  });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Movimentações</h1>
          <p className="text-sm text-slate-500 mt-1">Histórico de entradas e saídas de estoque</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <ExportButtons
            filename="historico_movimentacoes"
            title="Histórico de movimentações"
            rows={movements}
            columns={[
              { header: "Data", value: (movement) => formatDateTime(movement.createdAt) },
              { header: "Produto", value: (movement) => movement.product.name },
              { header: "Tipo", value: (movement) => movement.type === "IN" ? "Entrada" : "Saída" },
              { header: "Quantidade", value: (movement) => movement.quantity },
              { header: "Unidade", value: (movement) => movement.product.unit },
              { header: "Motivo", value: (movement) => movementReasonLabels[movement.reason] },
              { header: "Usuário", value: (movement) => movement.user.name },
            ]}
          />
          <button
            onClick={() => setModalType("OUT")}
            className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
          >
            Registrar saída
          </button>
          <button
            onClick={() => setModalType("IN")}
            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
          >
            Registrar entrada
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Produto</th>
              <th className="text-left px-5 py-3 font-medium">Tipo</th>
              <th className="text-left px-5 py-3 font-medium">Qtd.</th>
              <th className="text-left px-5 py-3 font-medium">Motivo</th>
              <th className="text-left px-5 py-3 font-medium">Usuário</th>
              <th className="text-left px-5 py-3 font-medium">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && <TableSkeleton columns={6} />}

            {!isLoading && movements.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-500">
                  Nenhuma movimentação registrada ainda
                </td>
              </tr>
            )}

            {movements.map((movement) => (
              <tr key={movement.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 text-slate-900 font-medium">{movement.product.name}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center rounded-full text-xs font-medium px-2.5 py-0.5 ${
                      movement.type === "IN"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {movement.type === "IN" ? "Entrada" : "Saída"}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {movement.type === "IN" ? "+" : "-"}
                  {movement.quantity} {movement.product.unit}
                </td>
                <td className="px-5 py-3 text-slate-600">{movementReasonLabels[movement.reason]}</td>
                <td className="px-5 py-3 text-slate-600">{movement.user.name}</td>
                <td className="px-5 py-3 text-slate-600">{formatDateTime(movement.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {modalType && (
        <Modal
          title={modalType === "IN" ? "Registrar entrada" : "Registrar saída"}
          onClose={() => setModalType(null)}
        >
          <MovementForm
            type={modalType}
            products={products}
            onCancel={() => setModalType(null)}
            onSubmit={async (input) => {
              if (modalType === "IN") {
                await entryMutation.mutateAsync(input);
              } else {
                await exitMutation.mutateAsync(input);
              }
            }}
          />
        </Modal>
      )}
    </div>
  );
}
