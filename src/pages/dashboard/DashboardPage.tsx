import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { dashboardApi } from "../../api/dashboard";
import { StatCard } from "../../components/ui/StatCard";

const activityLabels: Record<string, string> = {
  ENTRADA: "Entrada",
  SAIDA: "Saída",
  AJUSTE: "Ajuste",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardPage() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.getSummary,
  });

  if (isLoading) {
    return <div className="p-8 text-sm text-slate-500">Carregando...</div>;
  }

  if (isError || !data) {
    return (
      <div className="p-8 text-sm text-red-600">Não foi possível carregar o dashboard.</div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Visão geral do estoque</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Produtos cadastrados" value={data.totalProducts} />
        <StatCard label="Estoque baixo" value={data.lowStockCount} tone="warning" />
        <StatCard label="Produtos zerados" value={data.zeroStockCount} tone="danger" />
        <StatCard label="Divergências pendentes" value={data.pendingDivergences} tone="warning" />
      </div>

      {/* Ação principal — "INICIAR INVENTÁRIO", pedida na seção 18 do projeto. */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
        <div>
          {data.inventoryInProgress ? (
            <>
              <p className="text-sm font-medium text-slate-900">
                Inventário em andamento: {data.inventoryInProgress.name}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Iniciado em {formatDate(data.inventoryInProgress.createdAt)}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-500">Nenhum inventário em andamento no momento</p>
          )}
        </div>
        <button
          onClick={() => navigate("/inventarios")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors whitespace-nowrap"
        >
          {data.inventoryInProgress ? "Continuar inventário" : "Iniciar inventário"}
        </button>
      </div>

      <div>
        <h2 className="text-sm font-medium text-slate-900 mb-3">Últimas movimentações</h2>
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
          {data.recentActivity.length === 0 && (
            <p className="p-5 text-sm text-slate-500">Nenhuma movimentação registrada ainda</p>
          )}

          {data.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm text-slate-900">
                  <span className="font-medium">{activityLabels[activity.type]}</span> ·{" "}
                  {activity.productName}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activity.userName} · {formatDate(activity.date)}
                </p>
              </div>
              <span
                className={`text-sm font-medium ${
                  activity.quantity < 0 ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {activity.quantity > 0 ? "+" : ""}
                {activity.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
