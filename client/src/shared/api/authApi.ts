import { apiClient } from "./apiClient";

/**
 * Данные для регистрации
 */
export type RegisterPayload = {
  email: string;
  phone: string;
  name: string;
  password: string;
};

/**
 * Данные для входа
 */
export type LoginPayload = {
  email: string;
  password: string;
};

/**
 * Данные пользователя
 */
export type User = {
  id: number;
  email: string;
  phone: string;
  name: string;
  role: string;
};

/**
 * Ответ от API авторизации
 */
export type AuthResponse = {
  status: "success" | "error";
  message: string;
  data?: {
    token: string;
    user: User;
  };
};

/**
 * API для работы с авторизацией
 */
export const authApi = {
  /**
   * Регистрация нового пользователя
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return apiClient.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Вход в систему
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    return apiClient.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
