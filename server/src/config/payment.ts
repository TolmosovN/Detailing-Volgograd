/**
 * Конфигурация платежной системы
 */

export const paymentConfig = {
  // Режим работы: mock, test, production
  mode: process.env.PAYMENT_MODE || 'mock',

  // ЮKassa
  yukassa: {
    shopId: process.env.YUKASSA_SHOP_ID || '',
    secretKey: process.env.YUKASSA_SECRET_KEY || '',
    returnUrl: process.env.YUKASSA_RETURN_URL || 'http://localhost:3000/payment/success',
  },

  // Mock настройки (для разработки)
  mock: {
    autoConfirmDelayMs: 3000, // Автоподтверждение через 3 секунды
  },
};

/**
 * Проверка, используется ли mock режим
 */
export const isMockMode = (): boolean => {
  return paymentConfig.mode === 'mock';
};

/**
 * Проверка, используется ли production режим
 */
export const isProductionMode = (): boolean => {
  return paymentConfig.mode === 'production';
};
