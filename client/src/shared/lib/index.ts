/**
 * Утилиты и вспомогательные функции.
 */

/**
 * Форматирует телефонный номер для отображения.
 * Пример: +79991234567 -> +7 (999) 123-45-67
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("7")) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
  }
  return phone;
};

/**
 * Валидация телефонного номера (простая проверка).
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 11 && cleaned.startsWith("7");
};

/**
 * Форматирует цену для отображения.
 * Пример: 5000 -> "5 000 ₽"
 */
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString("ru-RU")} ₽`;
};

/**
 * Валидация email адреса (простая проверка).
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};
