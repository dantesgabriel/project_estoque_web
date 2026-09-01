import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f8fa] p-6 text-center">
      <section className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-teal-100 text-2xl" aria-hidden="true">🐾</div>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Erro 404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Página não encontrada</h1>
        <p className="mt-4 leading-relaxed text-slate-600">O endereço informado não existe ou pode ter sido movido. Acesse a página inicial para entrar no sistema.</p>
        <Link to="/login" className="mt-7 inline-flex rounded-xl bg-[#102a35] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17404d]">Ir para o login</Link>
      </section>
    </main>
  );
}
