import { API_URL } from "@shared/config";

/**
 * Единый клиент для запросов к API.
 * Поддерживает автоматическую отправку JWT токена.
 */
export const apiClient = {
  /**
   * Получить токен из localStorage
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  /**
   * Базовый запрос к API.
   */
  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = `${API_URL}${normalizedPath}`;

    // Получаем токен
    const token = this.getToken();

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      // Если токен истёк или невалидный (401)
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Можно добавить редирект на /login если нужно
      }

      let details: unknown = null;
      try {
        details = await response.json();
      } catch {
        details = await response.text();
      }

      throw new Error(
        `Ошибка запроса: ${response.status}. Детали: ${JSON.stringify(details)}`
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }
};
