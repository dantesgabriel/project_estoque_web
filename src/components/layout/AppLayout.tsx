import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/produtos", label: "Produtos" },
  { to: "/inventarios", label: "Inventários" },
  { to: "/movimentacoes", label: "Movimentações" },
];

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-5 py-5 border-b border-slate-200">
          <h1 className="text-base font-semibold text-slate-900">Estoque Vet</h1>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
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
            className="w-full text-left rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
