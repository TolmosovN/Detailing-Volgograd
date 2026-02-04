/**
 * Конфигурация Email сервиса
 */

export const emailConfig = {
  // Включены ли email уведомления
  enabled: process.env.EMAIL_ENABLED === 'true',

  // SMTP настройки
  smtp: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true для 465, false для других портов
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASSWORD || '',
    },
  },

  // Отправитель по умолчанию
  from: process.env.EMAIL_FROM || 'Автомойка Детейлинг <noreply@detailing.ru>',

  // URL фронтенда (для ссылок в письмах)
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};

/**
 * Проверка: включены ли email
 */
export const isEmailEnabled = (): boolean => {
  return emailConfig.enabled && !!emailConfig.smtp.auth.user && !!emailConfig.smtp.auth.pass;
};
