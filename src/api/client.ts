import axios from "axios";

// Em dev, o Vite faz proxy de /api para http://localhost:3333 (ver vite.config.ts).
// Em produção, VITE_API_URL aponta direto para a API publicada (ex: Railway).
const baseURL = import.meta.env.VITE_API_URL ?? "/api";

export const api = axios.create({
  baseURL,
});

// Injeta o token salvo em todas as requisições automaticamente.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Se o token expirar/for inválido, o backend responde 401 — aqui limpamos a
// sessão local e mandamos de volta pro login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
