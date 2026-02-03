import { apiClient } from "./apiClient";

/**
 * Статистика для админ-панели
 */
export type AdminStats = {
  totalBookings: number;
  newBookings: number;
  pendingBookings: number;
  completedThisMonth: number;
  totalRevenue: number;
  popularServices: Array<{
    id: number;
    name: string;
    bookingsCount: number;
  }>;
};

/**
 * Запись с полной информацией для админа
 */
export type AdminBooking = {
  id: number;
  date: string;
  time: string;
  status: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  service: {
    id: number;
    name: string;
    description: string;
    priceFrom: number;
    duration: number;
  };
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  } | null;
};

/**
 * Услуга с количеством записей
 */
export type AdminService = {
  id: number;
  name: string;
  description: string;
  priceFrom: number;
  duration: number;
  isActive: boolean;
  createdAt: string;
  _count: {
    bookings: number;
  };
};

/**
 * Ответы от API
 */
export type StatsResponse = {
  status: "success" | "error";
  message?: string;
  data?: AdminStats;
};

export type BookingsResponse = {
  status: "success" | "error";
  message?: string;
  data?: AdminBooking[];
};

export type ServicesResponse = {
  status: "success" | "error";
  message?: string;
  data?: AdminService[];
};

export type ServiceResponse = {
  status: "success" | "error";
  message?: string;
  data?: AdminService;
};

/**
 * Payload для создания/обновления услуги
 */
export type ServicePayload = {
  name: string;
  description: string;
  priceFrom: number;
  duration: number;
  isActive?: boolean;
};

/**
 * API для админ-панели
 */
export const adminApi = {
  /**
   * Получить статистику
   */
  async getStats(): Promise<StatsResponse> {
    return apiClient.request<StatsResponse>('/admin/stats');
  },

  /**
   * Получить все записи с фильтрацией
   */
  async getBookings(params?: {
    status?: string;
    date?: string;
    search?: string;
  }): Promise<BookingsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.date) queryParams.append('date', params.date);
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    return apiClient.request<BookingsResponse>(
      `/admin/bookings${query ? `?${query}` : ''}`
    );
  },

  /**
   * Обновить статус записи
   */
  async updateBookingStatus(
    bookingId: number,
    status: string
  ): Promise<ServiceResponse> {
    return apiClient.request<ServiceResponse>(
      `/admin/bookings/${bookingId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );
  },

  /**
   * Получить все услуги (включая неактивные)
   */
  async getServices(): Promise<ServicesResponse> {
    return apiClient.request<ServicesResponse>('/admin/services');
  },

  /**
   * Создать новую услугу
   */
  async createService(payload: ServicePayload): Promise<ServiceResponse> {
    return apiClient.request<ServiceResponse>('/admin/services', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Обновить услугу
   */
  async updateService(
    serviceId: number,
    payload: Partial<ServicePayload>
  ): Promise<ServiceResponse> {
    return apiClient.request<ServiceResponse>(`/admin/services/${serviceId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Деактивировать услугу
   */
  async deleteService(serviceId: number): Promise<ServiceResponse> {
    return apiClient.request<ServiceResponse>(`/admin/services/${serviceId}`, {
      method: 'DELETE',
    });
  },
};
