/**
 * Конфигурация приложения.
 * Константы и настройки, используемые по всему проекту.
 */

export const APP_CONFIG = {
  name: "Detailing Volgograd",
  description: "Онлайн-запись на автомойку и детейлинг в Волгограде",
  phone: "+7 (999) 000-00-00",
  address: "г. Волгоград, ул. Примерная, 1",
  workingHours: "ежедневно с 9:00 до 21:00"
} as const;

/**
 * URL API (будет использоваться в Этапе 5).
 * Значение берётся из переменной окружения NEXT_PUBLIC_API_URL.
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
