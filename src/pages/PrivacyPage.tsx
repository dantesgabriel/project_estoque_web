import { Link } from "react-router-dom";

export function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f5f8fa] px-4 py-10 sm:px-6">
      <article className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Estoque Vet</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Política de privacidade</h1>
        <p className="mt-2 text-sm text-slate-500">Última atualização: 1 de setembro de 2026</p>
        <div className="mt-8 space-y-6 leading-relaxed text-slate-700">
          <section><h2 className="text-lg font-bold text-slate-900">Uso das informações</h2><p className="mt-2">O Estoque Vet é uma plataforma de gestão para clínicas veterinárias. Os dados cadastrados são usados exclusivamente para controle de estoque, atendimentos, rastreabilidade e operação da clínica contratante.</p></section>
          <section><h2 className="text-lg font-bold text-slate-900">Responsabilidade pelos dados</h2><p className="mt-2">Cada clínica contratante é responsável pelos dados de seus usuários, tutores e pets e deve utilizar a plataforma de acordo com a legislação aplicável, incluindo a Lei Geral de Proteção de Dados (LGPD).</p></section>
          <section><h2 className="text-lg font-bold text-slate-900">Segurança e acesso</h2><p className="mt-2">O acesso é protegido por credenciais individuais. Não compartilhe sua senha. Registros operacionais são associados ao usuário responsável para garantir auditoria e rastreabilidade.</p></section>
          <section><h2 className="text-lg font-bold text-slate-900">Cookies</h2><p className="mt-2">Esta versão não utiliza cookies de publicidade. Caso ferramentas de análise ou cookies não essenciais sejam adicionados, a aplicação deverá apresentar uma solicitação de consentimento antes de ativá-los.</p></section>
        </div>
        <Link className="mt-8 inline-flex text-sm font-bold text-teal-700 hover:underline" to="/login">← Voltar para o login</Link>
      </article>
    </main>
  );
}
