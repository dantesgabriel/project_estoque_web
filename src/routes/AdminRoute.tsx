import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Assume que já passou pelo ProtectedRoute (usuário autenticado garantido).
// Aqui só filtramos por papel — funcionário tentando acessar via URL direta
// é redirecionado, não vê erro nem trava a navegação.
export function AdminRoute() {
  const { user } = useAuth();

  if (user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
