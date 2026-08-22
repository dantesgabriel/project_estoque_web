import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../../api/users";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Modal } from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { TableSkeleton } from "../../components/ui/TableSkeleton";
import { UserForm } from "./UserForm";
import { ResetPasswordModal } from "./ResetPasswordModal";
import type { CreateUserInput, User } from "../../types/user";

const roleLabels: Record<User["role"], string> = {
  ADMIN: "Administrador",
  FUNCIONARIO: "Funcionário",
};

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [pendingDeactivation, setPendingDeactivation] = useState<
    (CreateUserInput & { active?: boolean }) | null
  >(null);
  const [resettingPasswordFor, setResettingPasswordFor] = useState<User | undefined>(undefined);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: usersApi.list,
  });

  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
      showToast("Usuário criado com sucesso");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof usersApi.update>[1] }) =>
      usersApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
      setEditingUser(undefined);
      showToast("Usuário atualizado com sucesso");
    },
  });

  function openCreateModal() {
    setEditingUser(undefined);
    setIsModalOpen(true);
  }

  function openEditModal(user: User) {
    setEditingUser(user);
    setIsModalOpen(true);
  }

  async function handleUserSubmit(input: CreateUserInput & { active?: boolean }) {
    if (!editingUser) {
      await createMutation.mutateAsync(input);
      return;
    }

    // Desativar conta é uma ação sensível — pede confirmação antes de aplicar.
    const isDeactivating = editingUser.active && input.active === false;

    if (isDeactivating) {
      setPendingDeactivation(input);
      return;
    }

    const { name, role, active } = input;
    await updateMutation.mutateAsync({ id: editingUser.id, input: { name, role, active } });
  }

  async function confirmDeactivation() {
    if (!editingUser || !pendingDeactivation) return;
    const { name, role, active } = pendingDeactivation;
    await updateMutation.mutateAsync({ id: editingUser.id, input: { name, role, active } });
    setPendingDeactivation(null);
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Usuários</h1>
          <p className="text-sm text-slate-500 mt-1">Gestão de acesso ao sistema</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
        >
          Novo usuário
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Nome</th>
              <th className="text-left px-5 py-3 font-medium">Email</th>
              <th className="text-left px-5 py-3 font-medium">Papel</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && <TableSkeleton columns={5} />}

            {!isLoading && users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500">
                  Nenhum usuário cadastrado
                </td>
              </tr>
            )}

            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 text-slate-900 font-medium">
                  {user.name}
                  {user.id === currentUser?.id && (
                    <span className="text-xs text-slate-400 ml-1.5">(você)</span>
                  )}
                </td>
                <td className="px-5 py-3 text-slate-600">{user.email}</td>
                <td className="px-5 py-3 text-slate-600">{roleLabels[user.role]}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center rounded-full text-xs font-medium px-2.5 py-0.5 ${
                      user.active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {user.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right space-x-3">
                  <button
                    onClick={() => setResettingPasswordFor(user)}
                    className="text-slate-500 hover:text-slate-700 text-sm font-medium"
                  >
                    Redefinir senha
                  </button>
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          title={editingUser ? "Editar usuário" : "Novo usuário"}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(undefined);
          }}
        >
          <UserForm
            initialData={editingUser}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingUser(undefined);
            }}
            onSubmit={handleUserSubmit}
          />
        </Modal>
      )}

      {pendingDeactivation && editingUser && (
        <ConfirmDialog
          title="Desativar usuário"
          message={`Tem certeza que deseja desativar ${editingUser.name}? A pessoa não poderá mais fazer login no sistema até ser reativada.`}
          confirmLabel="Desativar"
          danger
          isConfirming={updateMutation.isPending}
          onConfirm={confirmDeactivation}
          onCancel={() => setPendingDeactivation(null)}
        />
      )}

      {resettingPasswordFor && (
        <ResetPasswordModal
          user={resettingPasswordFor}
          onClose={() => setResettingPasswordFor(undefined)}
        />
      )}
    </div>
  );
}
