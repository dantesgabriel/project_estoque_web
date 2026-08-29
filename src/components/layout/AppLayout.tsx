import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ChangePasswordModal } from "./ChangePasswordModal";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/produtos", label: "Produtos" },
  { to: "/inventarios", label: "Inventários" },
  { to: "/movimentacoes", label: "Movimentações" },
  { to: "/tutores", label: "Tutores e pets" },
  { to: "/atendimentos", label: "Atendimentos" },
];

const adminNavItems = [
  { to: "/fornecedores", label: "Fornecedores" },
  { to: "/usuarios", label: "Usuários" },
];

const navIcons: Record<string, React.ReactNode> = {
  "/dashboard": <path d="M4 13h6V4H4v9Zm0 7h6v-4H4v4Zm10 0h6v-9h-6v9Zm0-16v4h6V4h-6Z" />,
  "/produtos": <path d="M20 7 12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M8 5l8 4" />,
  "/inventarios": <path d="M9 5h6m-6 4h6m-6 4h4M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />,
  "/movimentacoes": <path d="M7 7h10m0 0-3-3m3 3-3 3M17 17H7m0 0 3-3m-3 3 3 3" />,
  "/tutores": <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m17-9a4 4 0 1 0 0-8m-3 2.5a4 4 0 0 1 0 7M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />,
  "/atendimentos": <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v8m-4-4h8" />,
  "/fornecedores": <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5M8 10h.01M12 10h.01M16 10h.01" />,
  "/usuarios": <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m17-9a4 4 0 1 0 0-8m-3 2.5a4 4 0 0 1 0 7M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />,
};

function SidebarContent({
  onNavigate,
  onOpenChangePassword,
}: {
  onNavigate?: () => void;
  onOpenChangePassword: () => void;
}) {
  const { user, logout } = useAuth();
  const items = user?.role === "ADMIN" ? [...navItems, ...adminNavItems] : navItems;

  return (
    <>
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-teal-400 text-slate-950 shadow-lg shadow-teal-950/20">
            <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="5.5" cy="9" rx="2.4" ry="3.2" transform="rotate(-25 5.5 9)"/><ellipse cx="10" cy="5.5" rx="2.4" ry="3.2" transform="rotate(-8 10 5.5)"/><ellipse cx="15" cy="5.5" rx="2.4" ry="3.2" transform="rotate(8 15 5.5)"/><ellipse cx="18.5" cy="9" rx="2.4" ry="3.2" transform="rotate(25 18.5 9)"/><path d="M12 11.5c-3.8 0-6.5 3.2-5.3 6.2.8 2 2.8 2.2 4.1 1.1.7-.6 1.6-.6 2.4 0 1.3 1.1 3.3.9 4.1-1.1 1.2-3-1.5-6.2-5.3-6.2Z"/></svg>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">Estoque Vet</h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-300">Cuidado em cada detalhe</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Menu principal</p>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                isActive ? "bg-teal-400 text-slate-950 shadow-lg shadow-teal-950/20" : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <svg className="size-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>{navIcons[item.to]}</svg>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-5 border-t border-white/10">
        <p className="text-sm font-semibold text-white px-3 truncate">{user?.name}</p>
        <p className="text-xs text-slate-400 px-3 mb-3">
          {user?.role === "ADMIN" ? "Administrador" : "Funcionário"}
        </p>
        <button
          onClick={onOpenChangePassword}
          className="w-full text-left rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          Trocar senha
        </button>
        <button
          onClick={logout}
          className="w-full text-left rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          Sair
        </button>
      </div>
    </>
  );
}

export function AppLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const location = useLocation();

  // Fecha o drawer automaticamente ao trocar de rota (evita ele ficar aberto
  // depois de navegar, que seria confuso no celular).
  const [lastPath, setLastPath] = useState(location.pathname);
  if (location.pathname !== lastPath) {
    setLastPath(location.pathname);
    if (isDrawerOpen) setIsDrawerOpen(false);
  }

  return (
    <div className="min-h-screen flex bg-[#f5f8fa]">
      {/* Sidebar fixa — só visível em telas médias pra cima. */}
      <aside className="hidden md:flex w-64 bg-[#102a35] flex-col">
        <SidebarContent onOpenChangePassword={() => setIsChangePasswordOpen(true)} />
      </aside>

      {/* Drawer mobile — some/aparece com overlay, só existe abaixo de md. */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={() => setIsDrawerOpen(false)}
          />
          <aside className="relative w-64 bg-[#102a35] flex flex-col z-50">
            <SidebarContent
              onNavigate={() => setIsDrawerOpen(false)}
              onOpenChangePassword={() => {
                setIsDrawerOpen(false);
                setIsChangePasswordOpen(true);
              }}
            />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Barra superior só em mobile, com o botão de abrir o menu. */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-[#102a35] text-white shadow-sm">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="text-teal-300 p-1.5 -ml-1.5 rounded-lg hover:bg-white/10"
            aria-label="Abrir menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-sm font-semibold">Estoque Vet</h1>
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {isChangePasswordOpen && (
        <ChangePasswordModal onClose={() => setIsChangePasswordOpen(false)} />
      )}
    </div>
  );
}
