import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/login/LoginPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { ProductsPage } from "./pages/products/ProductsPage";
import { InventoryListPage } from "./pages/inventory/InventoryListPage";
import { InventoryDetailPage } from "./pages/inventory/InventoryDetailPage";
import { MovementsPage } from "./pages/movements/MovementsPage";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/inventarios" element={<InventoryListPage />} />
          <Route path="/inventarios/:id" element={<InventoryDetailPage />} />
          <Route path="/movimentacoes" element={<MovementsPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
