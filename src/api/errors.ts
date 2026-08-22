interface ApiErrorResponse {
  message?: string;
  issues?: { path: string; message: string }[];
}

interface AxiosLikeError {
  response?: { data?: ApiErrorResponse; status?: number };
  request?: unknown;
  message?: string;
}

// Usado em todo catch de formulário — trata os três casos possíveis:
// 1) erro de validação (Zod) com múltiplos campos — junta tudo numa mensagem legível;
// 2) erro de negócio do backend — usa a mensagem direto;
// 3) erro de rede (API fora do ar, sem resposta) — mensagem genérica amigável.
export function extractErrorMessage(err: unknown, fallback = "Ocorreu um erro inesperado"): string {
  const error = err as AxiosLikeError;
  const data = error.response?.data;

  if (data?.issues && data.issues.length > 0) {
    return data.issues.map((issue) => issue.message).join(" ");
  }

  if (data?.message) {
    return data.message;
  }

  if (error.request && !error.response) {
    return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
  }

  return fallback;
}
