import { api } from "./client";
import type { CreateUserInput, UpdateUserInput, User } from "../types/user";

export const usersApi = {
  async list(): Promise<User[]> {
    const { data } = await api.get<User[]>("/users");
    return data;
  },

  async create(input: CreateUserInput): Promise<User> {
    const { data } = await api.post<User>("/users", input);
    return data;
  },

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}`, input);
    return data;
  },
};
