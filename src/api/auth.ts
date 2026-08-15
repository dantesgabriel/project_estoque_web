import { api } from "./client";
import type { LoginResponse } from "../types/auth";

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
    return data;
  },
};
