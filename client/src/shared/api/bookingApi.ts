import { apiClient } from "./apiClient";

/**
 * Тип данных для создания записи на мойку.
 */
export type CreateBookingPayload = {
  serviceId: number;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
};

/**
 * Ответ при создании записи.
 */
export type BookingResponse = {
  status: "success" | "error";
  message: string;
  data?: {
    id: number;
    serviceId: number;
    date: string;
    time: string;
    name: string;
    phone: string;
    email: string;
    status: string;
  };
};

/**
 * Сервис для работы с API записей.
 */
export const bookingApi = {
  /**
   * Создать новую запись на мойку.
   */
  async createBooking(payload: CreateBookingPayload): Promise<BookingResponse> {
    return apiClient.request<BookingResponse>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Получить список всех записей (для админа).
   */
  async getAllBookings(): Promise<any[]> {
    return apiClient.request<any[]>('/bookings');
  },
};
