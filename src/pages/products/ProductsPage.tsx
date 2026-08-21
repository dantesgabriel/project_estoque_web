import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../../api/products";
import { categoriesApi } from "../../api/categories";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Modal } from "../../components/ui/Modal";
import { StockBadge } from "../../components/ui/StockBadge";
import { TableSkeleton } from "../../components/ui/TableSkeleton";
import { ProductForm } from "./ProductForm";
import type { Product, ProductFilters } from "../../types/product";

export function ProductsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "ADMIN";

  const [filters, setFilters] = useState<ProductFilters>({});
  const [nameInput, setNameInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.list,
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => productsApi.list(filters),
  });

  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
      showToast("Produto criado com sucesso");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof productsApi.update>[1] }) =>
      productsApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
      setEditingProduct(undefined);
      showToast("Produto atualizado com sucesso");
    },
  });

  function openCreateModal() {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setIsModalOpen(true);
  }

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFilters((prev) => ({ ...prev, name: nameInput || undefined }));
  }

  function toggleFilter(key: "lowStock" | "zeroStock") {
    setFilters((prev) => ({ ...prev, [key]: prev[key] ? undefined : true }));
  }

  const filterButtonClass = (active: boolean | undefined) =>
    `text-xs font-medium rounded-full px-3 py-1.5 border transition-colors ${
      active
        ? "bg-indigo-600 border-indigo-600 text-white"
        : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
    }`;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Produtos</h1>
          <p className="text-sm text-slate-500 mt-1">{products.length} produto(s) encontrado(s)</p>
        </div>
        {isAdmin && (
          <button
            onClick={openCreateModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
          >
            Novo produto
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[220px]">
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </form>

        <select
          value={filters.categoryId ?? ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, categoryId: e.target.value || undefined }))
          }
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button onClick={() => toggleFilter("lowStock")} className={filterButtonClass(filters.lowStock)}>
          Estoque baixo
        </button>
        <button onClick={() => toggleFilter("zeroStock")} className={filterButtonClass(filters.zeroStock)}>
          Zerados
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Nome</th>
              <th className="text-left px-5 py-3 font-medium">SKU</th>
              <th className="text-left px-5 py-3 font-medium">Categoria</th>
              <th className="text-left px-5 py-3 font-medium">Estoque</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && <TableSkeleton columns={6} />}

            {!isLoading && products.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-500">
                  Nenhum produto encontrado
                </td>
              </tr>
            )}

            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 text-slate-900 font-medium">{product.name}</td>
                <td className="px-5 py-3 text-slate-600">{product.sku}</td>
                <td className="px-5 py-3 text-slate-600">{product.category.name}</td>
                <td className="px-5 py-3 text-slate-600">
                  {product.currentStock} {product.unit}
                </td>
                <td className="px-5 py-3">
                  <StockBadge currentStock={product.currentStock} minStock={product.minStock} />
                </td>
                <td className="px-5 py-3 text-right">
                  {isAdmin && (
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal
          title={editingProduct ? "Editar produto" : "Novo produto"}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(undefined);
          }}
        >
          <ProductForm
            categories={categories}
            initialData={editingProduct}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingProduct(undefined);
            }}
            onSubmit={async (input) => {
              if (editingProduct) {
                await updateMutation.mutateAsync({ id: editingProduct.id, input });
              } else {
                await createMutation.mutateAsync(input);
              }
            }}
          />
        </Modal>
      )}
    </div>
  );
}
