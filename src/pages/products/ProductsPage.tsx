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
import { ExportButtons } from "../../components/ui/ExportButtons";
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
        ? "bg-teal-600 border-teal-600 text-white"
        : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
    }`;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Catálogo</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Produtos</h1>
          <p className="text-sm text-slate-500 mt-1">{products.length} produto(s) encontrado(s)</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons
            filename="relatorio_estoque"
            title="Relatório de estoque"
            rows={products}
            columns={[
              { header: "Produto", value: (product) => product.name },
              { header: "SKU", value: (product) => product.sku },
              { header: "Categoria", value: (product) => product.category.name },
              { header: "Estoque atual", value: (product) => product.currentStock },
              { header: "Unidade", value: (product) => product.unit },
              { header: "Estoque mínimo", value: (product) => product.minStock },
              { header: "Localização", value: (product) => product.location ?? "-" },
            ]}
          />
          {isAdmin && (
            <button
              onClick={openCreateModal}
              className="rounded-xl bg-[#102a35] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17404d]"
            >
              Novo produto
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[220px]">
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
          />
        </form>

        <select
          value={filters.categoryId ?? ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, categoryId: e.target.value || undefined }))
          }
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm"
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

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wide">
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
