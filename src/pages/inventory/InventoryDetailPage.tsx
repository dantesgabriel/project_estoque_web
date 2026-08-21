import { Fragment, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { inventoryApi } from "../../api/inventory";
import { adjustmentsApi } from "../../api/adjustments";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { InventoryStatusBadge } from "./InventoryStatusBadge";
import { CountRow } from "./CountRow";
import { AdjustmentPanel } from "./AdjustmentPanel";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import type { AdjustmentReason } from "../../types/adjustment";

export function InventoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "ADMIN";

  const [adjustedItemIds, setAdjustedItemIds] = useState<Set<string>>(new Set());
  const [closeError, setCloseError] = useState<string | null>(null);
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);

  const { data: inventory, isLoading } = useQuery({
    queryKey: ["inventory", id],
    queryFn: () => inventoryApi.getById(id!),
    enabled: !!id,
  });

  const countMutation = useMutation({
    mutationFn: ({ itemId, countedQty, note }: { itemId: string; countedQty: number; note?: string }) =>
      inventoryApi.submitCount(id!, itemId, countedQty, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", id] });
      showToast("Contagem registrada");
    },
  });

  const closeMutation = useMutation({
    mutationFn: () => inventoryApi.close(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", id] });
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      setCloseError(null);
      setIsConfirmingClose(false);
      showToast("Inventário fechado com sucesso");
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Erro ao fechar inventário";
      setCloseError(message);
      setIsConfirmingClose(false);
    },
  });

  const adjustMutation = useMutation({
    mutationFn: ({
      inventoryItemId,
      reason,
      note,
    }: {
      inventoryItemId: string;
      reason: AdjustmentReason;
      note?: string;
    }) => adjustmentsApi.createFromInventory(inventoryItemId, reason, note),
    onSuccess: (_data, variables) => {
      setAdjustedItemIds((prev) => new Set(prev).add(variables.inventoryItemId));
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      showToast("Ajuste aplicado, estoque corrigido");
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
        <div className="skeleton h-7 bg-slate-200 rounded w-48" />
        <div className="skeleton h-40 bg-slate-200 rounded-xl" />
      </div>
    );
  }

  if (!inventory) {
    return <div className="p-4 md:p-8 text-sm text-red-600">Inventário não encontrado.</div>;
  }

  const canCount = inventory.status === "IN_PROGRESS";
  const allCounted = inventory.items.every((item) => item.countedQty !== null);
  const divergentCount = inventory.items.filter((item) => (item.divergence ?? 0) !== 0).length;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/inventarios")}
            className="text-sm text-slate-500 hover:text-slate-700 mb-2"
          >
            ← Voltar
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-slate-900">{inventory.name}</h1>
            <InventoryStatusBadge status={inventory.status} />
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Responsável: {inventory.responsible.name}
            {inventory.blindMode && " · Contagem cega"}
          </p>
        </div>

        {isAdmin && canCount && (
          <div className="text-right">
            <button
              onClick={() => setIsConfirmingClose(true)}
              disabled={!allCounted || closeMutation.isPending}
              title={!allCounted ? "Ainda existem itens sem contagem" : ""}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
            >
              {closeMutation.isPending ? "Fechando..." : "Fechar inventário"}
            </button>
            {closeError && <p className="text-xs text-red-600 mt-1">{closeError}</p>}
          </div>
        )}
      </div>

      {isConfirmingClose && (
        <ConfirmDialog
          title="Fechar inventário"
          message={
            divergentCount > 0
              ? `Existem ${inventory.items.filter((i) => (i.divergence ?? 0) !== 0).length} produto(s) com divergência ainda não confirmada. Depois de fechado, você vai precisar justificar cada divergência para corrigir o estoque. Deseja continuar?`
              : "Depois de fechado, não será possível registrar novas contagens neste inventário. Deseja continuar?"
          }
          confirmLabel="Fechar inventário"
          isConfirming={closeMutation.isPending}
          onConfirm={() => closeMutation.mutate()}
          onCancel={() => setIsConfirmingClose(false)}
        />
      )}

      {inventory.status === "COMPLETED" && divergentCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
          {divergentCount} produto(s) com divergência. Justifique e aplique o ajuste para corrigir
          o estoque.
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Produto</th>
              <th className="text-left px-5 py-3 font-medium">SKU</th>
              <th className="text-left px-5 py-3 font-medium">Esperado</th>
              <th className="text-left px-5 py-3 font-medium">Contado</th>
              <th className="text-left px-5 py-3 font-medium">Divergência</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventory.items.map((item) => (
              <Fragment key={item.id}>
                <CountRow
                  item={item}
                  canCount={canCount}
                  blindMode={inventory.blindMode}
                  onSubmit={async (countedQty, note) => {
                    await countMutation.mutateAsync({ itemId: item.id, countedQty, note });
                  }}
                />
                {inventory.status === "COMPLETED" &&
                  (item.divergence ?? 0) !== 0 &&
                  !adjustedItemIds.has(item.id) &&
                  isAdmin && (
                    <tr className="bg-amber-50/50">
                      <td colSpan={6} className="px-5 py-2.5">
                        <AdjustmentPanel
                          onSubmit={async (reason, note) => {
                            await adjustMutation.mutateAsync({ inventoryItemId: item.id, reason, note });
                          }}
                        />
                      </td>
                    </tr>
                  )}
              </Fragment>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
