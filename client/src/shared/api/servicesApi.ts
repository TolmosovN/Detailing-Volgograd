import type { Service } from "@features/services/types";
import { apiClient } from "./apiClient";

/**
 * Сервис для работы с API услуг.
 */
export const servicesApi = {
  /**
   * Получить список всех активных услуг.
   */
  async getServices(): Promise<Service[]> {
    return apiClient.request<Service[]>('/services');
  },

  /**
   * Получить одну услугу по ID.
   */
  async getServiceById(id: number): Promise<Service> {
    return apiClient.request<Service>(`/services/${id}`);
  },
};
