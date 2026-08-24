import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { extractErrorMessage } from "../../api/errors";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      // Erro de credenciais o backend já manda "Credenciais inválidas" — o helper
      // também cobre falha de rede (API fora do ar), que antes ficava mascarada.
      setError(extractErrorMessage(err, "Email ou senha inválidos"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f8fa] p-4 lg:grid lg:grid-cols-2 lg:gap-12 lg:p-6">
      <section className="vet-pattern relative hidden overflow-hidden rounded-3xl bg-[#102a35] p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 text-white"><div className="grid size-10 place-items-center rounded-xl bg-teal-400 text-slate-950"><span className="text-xl">♥</span></div><div><p className="font-bold">Estoque Vet</p><p className="text-xs text-teal-200">Cuidado em cada detalhe</p></div></div>
        <div className="relative z-10 max-w-md"><div className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-teal-300"><span className="grid size-7 place-items-center rounded-full bg-teal-400/15 text-base">🐾</span> Eficiência que cuida</div><h1 className="mt-4 text-5xl font-bold leading-[1.08] tracking-tight text-white">Seu estoque no ritmo da sua clínica.</h1><p className="mt-6 text-lg leading-relaxed text-slate-300">Tenha clareza, agilidade e segurança para cuidar do que realmente importa: cada paciente.</p></div>
        <div className="relative z-10 flex gap-8 text-sm text-slate-300"><span><strong className="block text-2xl text-white">100%</strong>visibilidade</span><span><strong className="block text-2xl text-white">24/7</strong>controle</span><span><strong className="block text-2xl text-rose-300">♥</strong>mais cuidado</span></div>
        <div className="absolute -bottom-28 -right-20 size-96 rounded-full border-[52px] border-teal-400/10" />
      </section>
      <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-8 lg:hidden text-center"><div className="mx-auto mb-3 grid size-11 place-items-center rounded-2xl bg-teal-400 text-xl text-slate-950 shadow-sm">🐾</div><h1 className="text-2xl font-bold text-slate-900">Estoque Vet</h1><p className="text-sm text-slate-500 mt-1">Gestão inteligente para clínicas</p></div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-200/50 space-y-5"
        >
          <div><p className="text-xl font-bold tracking-tight text-slate-900">Bem-vindo de volta</p><p className="mt-1 text-sm text-slate-500">Acesse sua central de operações.</p></div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#102a35] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17404d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}
