import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/produtos", label: "Produtos" },
  { to: "/inventarios", label: "Inventários" },
  { to: "/movimentacoes", label: "Movimentações" },
];

const adminNavItems = [{ to: "/usuarios", label: "Usuários" }];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const items = user?.role === "ADMIN" ? [...navItems, ...adminNavItems] : navItems;

  return (
    <>
      <div className="px-5 py-5 border-b border-slate-200">
        <h1 className="text-base font-semibold text-slate-900">Estoque Vet</h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-200">
        <p className="text-sm font-medium text-slate-900 px-3">{user?.name}</p>
        <p className="text-xs text-slate-500 px-3 mb-2">
          {user?.role === "ADMIN" ? "Administrador" : "Funcionário"}
        </p>
        <button
          onClick={logout}
          className="w-full text-left rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
        >
          Sair
        </button>
      </div>
    </>
  );
}

export function AppLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  // Fecha o drawer automaticamente ao trocar de rota (evita ele ficar aberto
  // depois de navegar, que seria confuso no celular).
  const [lastPath, setLastPath] = useState(location.pathname);
  if (location.pathname !== lastPath) {
    setLastPath(location.pathname);
    if (isDrawerOpen) setIsDrawerOpen(false);
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar fixa — só visível em telas médias pra cima. */}
      <aside className="hidden md:flex w-60 bg-white border-r border-slate-200 flex-col">
        <SidebarContent />
      </aside>

      {/* Drawer mobile — some/aparece com overlay, só existe abaixo de md. */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={() => setIsDrawerOpen(false)}
          />
          <aside className="relative w-64 bg-white border-r border-slate-200 flex flex-col z-50">
            <SidebarContent onNavigate={() => setIsDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Barra superior só em mobile, com o botão de abrir o menu. */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="text-slate-600 p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100"
            aria-label="Abrir menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-sm font-semibold text-slate-900">Estoque Vet</h1>
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
