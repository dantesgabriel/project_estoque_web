import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { inventoryApi } from "../../api/inventory";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Modal } from "../../components/ui/Modal";
import { TableSkeleton } from "../../components/ui/TableSkeleton";
import { CreateInventoryForm } from "./CreateInventoryForm";
import { InventoryStatusBadge } from "./InventoryStatusBadge";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function InventoryListPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "ADMIN";

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: inventories = [], isLoading } = useQuery({
    queryKey: ["inventories"],
    queryFn: inventoryApi.list,
  });

  const createMutation = useMutation({
    mutationFn: inventoryApi.create,
    onSuccess: (inventory) => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      setIsModalOpen(false);
      showToast("Inventário criado com sucesso");
      navigate(`/inventarios/${inventory.id}`);
    },
  });

  const hasInProgress = inventories.some((inv) => inv.status === "IN_PROGRESS");

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Inventários</h1>
          <p className="text-sm text-slate-500 mt-1">
            Contagens físicas e comparação com o estoque do sistema
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={hasInProgress}
            title={hasInProgress ? "Finalize o inventário em andamento antes de criar outro" : ""}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
          >
            Iniciar inventário
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Nome</th>
              <th className="text-left px-5 py-3 font-medium">Responsável</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Data</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && <TableSkeleton columns={5} />}

            {!isLoading && inventories.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500">
                  Nenhum inventário criado ainda
                </td>
              </tr>
            )}

            {inventories.map((inventory) => (
              <tr key={inventory.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 text-slate-900 font-medium">{inventory.name}</td>
                <td className="px-5 py-3 text-slate-600">{inventory.responsible.name}</td>
                <td className="px-5 py-3">
                  <InventoryStatusBadge status={inventory.status} />
                </td>
                <td className="px-5 py-3 text-slate-600">{formatDate(inventory.createdAt)}</td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => navigate(`/inventarios/${inventory.id}`)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    {inventory.status === "IN_PROGRESS" ? "Contar" : "Ver detalhes"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {isModalOpen && (
        <Modal title="Novo inventário" onClose={() => setIsModalOpen(false)}>
          <CreateInventoryForm
            onCancel={() => setIsModalOpen(false)}
            onSubmit={async (input) => {
              await createMutation.mutateAsync(input);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
