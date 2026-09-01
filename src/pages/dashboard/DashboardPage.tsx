import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { DashboardActivity } from "../../types/dashboard";
import { useNavigate } from "react-router-dom";
import { dashboardApi } from "../../api/dashboard";
import { StatCard } from "../../components/ui/StatCard";
import { StatCardSkeleton } from "../../components/ui/StatCardSkeleton";

const activityLabels: Record<string, string> = {
  ENTRADA: "Entrada",
  SAIDA: "Saída",
  AJUSTE: "Ajuste",
};

type SearchField = "all" | "date" | "user" | "sku" | "product" | "category";

const searchLabels: Record<SearchField, string> = {
  all: "Todos os campos",
  date: "Data",
  user: "Usuário",
  sku: "SKU",
  product: "Produto",
  category: "Categoria",
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchField, setSearchField] = useState<SearchField>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.getSummary,
  });

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Visão geral do estoque</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="skeleton h-20 bg-slate-200 rounded-xl" />
        <div className="skeleton h-48 bg-slate-200 rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-8 text-sm text-red-600">Não foi possível carregar o dashboard.</div>
    );
  }

  function matchesSearch(activity: DashboardActivity) {
    const term = searchTerm.trim().toLocaleLowerCase("pt-BR");
    if (!term) return true;
    const date = new Date(activity.date);
    const values: Record<SearchField, string> = {
      all: [activity.productName, activity.sku, activity.categoryName, activity.userName, formatDate(activity.date), date.toISOString().slice(0, 10)].join(" "),
      date: `${formatDate(activity.date)} ${date.toISOString().slice(0, 10)}`,
      user: activity.userName,
      sku: activity.sku,
      product: activity.productName,
      category: activity.categoryName,
    };
    return values[searchField].toLocaleLowerCase("pt-BR").includes(term);
  }

  const filteredActivity = data.recentActivity.filter(matchesSearch);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Central de operação</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Visão geral do estoque</h1>
          <p className="text-sm text-slate-500 mt-1">Acompanhe a saúde do seu estoque em tempo real.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-3 py-2 text-xs font-medium text-teal-800"><span className="size-2 rounded-full bg-teal-500 animate-pulse" />Tudo saudável por aqui</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Produtos cadastrados" value={data.totalProducts} />
        <StatCard label="Estoque baixo" value={data.lowStockCount} tone="warning" />
        <StatCard label="Produtos zerados" value={data.zeroStockCount} tone="danger" />
        <StatCard label="Divergências pendentes" value={data.pendingDivergences} tone="warning" />
        <StatCard label="Lotes vencidos" value={data.expiredBatchesCount} tone="danger" />
        <StatCard label="Vencem em 30 dias" value={data.expiringSoonBatchesCount} tone="warning" />
      </div>

      {/* Ação principal — "INICIAR INVENTÁRIO", pedida na seção 18 do projeto. */}
      <div className="vet-pattern relative overflow-hidden rounded-2xl bg-[#102a35] p-6 text-white shadow-lg shadow-slate-300/40 sm:flex sm:items-center sm:justify-between">
        <div className="relative z-10">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-300"><span className="text-base">🐾</span> Inventário</p>
          {data.inventoryInProgress ? (
            <>
              <p className="mt-2 text-lg font-bold">
                Inventário em andamento: {data.inventoryInProgress.name}
              </p>
              <p className="text-sm text-slate-300 mt-1">
                Iniciado em {formatDate(data.inventoryInProgress.createdAt)}
              </p>
            </>
          ) : (
            <><p className="mt-2 text-lg font-bold">Seu estoque, sempre sob controle.</p><p className="mt-1 text-sm text-slate-300">Nenhum inventário em andamento no momento.</p></>
          )}
        </div>
        <button
          onClick={() => navigate("/inventarios")}
          className="relative z-10 mt-5 rounded-xl bg-teal-400 px-4 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-teal-300 sm:mt-0 whitespace-nowrap"
        >
          {data.inventoryInProgress ? "Continuar inventário" : "Iniciar inventário"}
        </button>
        <div className="absolute -right-10 -top-16 size-52 rounded-full border-[28px] border-teal-400/10" />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900">Últimas movimentações</h2>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs font-medium text-slate-400 sm:inline">Atividade recente</span>
            <button
              type="button"
              onClick={() => setIsSearchOpen((open) => !open)}
              aria-label="Pesquisar movimentações"
              aria-expanded={isSearchOpen}
              className={`grid size-9 place-items-center rounded-xl border transition-colors ${isSearchOpen ? "border-teal-300 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="6" /><path strokeLinecap="round" d="m16 16 4 4" /></svg>
            </button>
          </div>
        </div>
        {isSearchOpen && (
          <div className="mb-3 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">
            <select value={searchField} onChange={(event) => setSearchField(event.target.value as SearchField)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-teal-500">
              {(Object.keys(searchLabels) as SearchField[]).map((field) => <option key={field} value={field}>{searchLabels[field]}</option>)}
            </select>
            <div className="relative flex-1"><svg className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="6" /><path strokeLinecap="round" d="m16 16 4 4" /></svg><input autoFocus value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder={`Buscar por ${searchLabels[searchField].toLocaleLowerCase("pt-BR")}...`} className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-teal-500" /></div>
            {searchTerm && <button type="button" onClick={() => setSearchTerm("")} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">Limpar</button>}
          </div>
        )}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm divide-y divide-slate-100">
          {data.recentActivity.length === 0 && (
            <p className="p-5 text-sm text-slate-500">Nenhuma movimentação registrada ainda</p>
          )}

          {data.recentActivity.length > 0 && filteredActivity.length === 0 && (
            <p className="p-5 text-sm text-slate-500">Nenhuma movimentação encontrada para essa busca.</p>
          )}

          {filteredActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50/80">
              <div className="flex items-center gap-3">
                <span className={`grid size-9 place-items-center rounded-xl text-sm font-bold ${activity.quantity < 0 ? "bg-rose-50 text-rose-600" : "bg-teal-50 text-teal-700"}`}>{activity.quantity < 0 ? "−" : "+"}</span>
                <div>
                <p className="text-sm text-slate-900">
                  <span className="font-medium">{activityLabels[activity.type]}</span> ·{" "}
                  {activity.productName}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activity.userName} · {formatDate(activity.date)} · SKU {activity.sku} · {activity.categoryName}
                </p>
                </div>
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
