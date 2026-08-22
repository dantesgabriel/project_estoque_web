import { useState } from "react";
import type { FormEvent } from "react";
import { usersApi } from "../../api/users";
import { extractErrorMessage } from "../../api/errors";
import { useToast } from "../../contexts/ToastContext";
import { Modal } from "../../components/ui/Modal";
import type { User } from "../../types/user";

interface ResetPasswordModalProps {
  user: User;
  onClose: () => void;
}

export function ResetPasswordModal({ user, onClose }: ResetPasswordModalProps) {
  const { showToast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await usersApi.resetPassword(user.id, newPassword);
      showToast(`Senha de ${user.name} redefinida com sucesso`);
      onClose();
    } catch (err: unknown) {
      setError(extractErrorMessage(err, "Erro ao redefinir senha"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal title={`Redefinir senha de ${user.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-500">
          Defina uma nova senha para este usuário. Ele deve trocá-la assim que possível.
        </p>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nova senha</label>
          <input
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg px-4 py-2 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
          >
            {isSubmitting ? "Salvando..." : "Redefinir"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
