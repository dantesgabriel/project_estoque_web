import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { notificationsApi, type NotificationType } from "../../api/notifications";

const alertInfo: Record<NotificationType, { title: (count: number) => string; href: string }> = {
  LOW_STOCK: { title: (count) => `${count} produto(s) com estoque baixo`, href: "/produtos?alert=low-stock" },
  ZERO_STOCK: { title: (count) => `${count} produto(s) zerado(s)`, href: "/produtos?alert=zero-stock" },
  PENDING_DIVERGENCE: { title: (count) => `${count} divergência(s) pendente(s)`, href: "/inventarios" },
  EXPIRED_BATCH: { title: (count) => `${count} lote(s) vencido(s)`, href: "/dashboard" },
  EXPIRING_BATCH: { title: (count) => `${count} lote(s) vencendo em 30 dias`, href: "/dashboard" },
};

export function NotificationsBell() {
  const [isOpen, setIsOpen] = useState(false); const navigate = useNavigate(); const location = useLocation();
  const { data, refetch } = useQuery({ queryKey: ["notifications"], queryFn: notificationsApi.getSummary, refetchInterval: 120_000, refetchOnWindowFocus: true });
  useEffect(() => { void refetch(); }, [location.pathname, refetch]);
  const total = data?.total ?? 0;
  return <div className="relative"><button type="button" onClick={() => setIsOpen((open) => !open)} aria-label="Abrir notificações" aria-expanded={isOpen} className="relative grid size-9 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900"><svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m1 4h4"/></svg>{total > 0 && <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-rose-600 px-1 text-center text-[10px] font-bold leading-4 text-white">{total > 99 ? "99+" : total}</span>}</button>{isOpen && <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"><div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><p className="text-sm font-bold text-slate-900">Notificações</p>{total > 0 && <span className="text-xs text-slate-500">{total} pendência(s)</span>}</div>{data?.items.length ? <div className="divide-y divide-slate-100">{data.items.map((item) => { const info = alertInfo[item.type]; return <button key={item.type} onClick={() => { setIsOpen(false); navigate(info.href); }} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50"><span className={`mt-0.5 grid size-7 place-items-center rounded-lg text-sm ${item.severity === "critical" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}`}>{item.severity === "critical" ? "!" : "⚠"}</span><span className="flex-1 text-sm text-slate-700">{info.title(item.count)}</span><span className="text-xs font-medium text-indigo-600">Ver</span></button>; })}</div> : <div className="p-5 text-center"><p className="text-sm font-medium text-emerald-700">Tudo em ordem ✓</p><p className="mt-1 text-xs text-slate-500">Nenhuma pendência no momento.</p></div>}</div>}</div>;
}
