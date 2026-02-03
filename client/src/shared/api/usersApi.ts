import { apiClient } from "./apiClient";
import type { User } from "./authApi";

/**
 * Данные для обновления профиля
 */
export type UpdateProfilePayload = {
  name?: string;
  phone?: string;
};

/**
 * Ответ с данными пользователя
 */
export type UserResponse = {
  status: "success" | "error";
  message?: string;
  data?: User;
};

/**
 * Запись пользователя с информацией об услуге
 */
export type UserBooking = {
  id: number;
  date: string;
  time: string;
  status: string;
  name: string;
  phone: string;
  email: string;
  service: {
    id: number;
    name: string;
    description: string;
    priceFrom: number;
    duration: number;
  };
};

/**
 * Ответ со списком записей
 */
export type BookingsResponse = {
  status: "success" | "error";
  message?: string;
  data?: UserBooking[];
};

/**
 * API для работы с пользователями
 */
export const usersApi = {
  /**
   * Получить данные текущего пользователя
   */
  async getMe(): Promise<UserResponse> {
    return apiClient.request<UserResponse>('/users/me');
  },

  /**
   * Обновить профиль пользователя
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<UserResponse> {
    return apiClient.request<UserResponse>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Получить записи текущего пользователя
   */
  async getMyBookings(): Promise<BookingsResponse> {
    return apiClient.request<BookingsResponse>('/users/me/bookings');
  },
};
