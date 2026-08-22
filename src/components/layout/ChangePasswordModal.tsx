import { useState } from "react";
import type { FormEvent } from "react";
import { authApi } from "../../api/auth";
import { extractErrorMessage } from "../../api/errors";
import { useToast } from "../../contexts/ToastContext";
import { Modal } from "../ui/Modal";

interface ChangePasswordModalProps {
  onClose: () => void;
}

export function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("A confirmação não coincide com a nova senha");
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.changePassword(currentPassword, newPassword);
      showToast("Senha alterada com sucesso");
      onClose();
    } catch (err: unknown) {
      setError(extractErrorMessage(err, "Erro ao trocar senha"));
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <Modal title="Trocar senha" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Senha atual</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Nova senha</label>
          <input
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Confirmar nova senha</label>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
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
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
