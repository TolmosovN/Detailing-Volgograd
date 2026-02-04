import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';

/**
 * Helmet middleware для безопасных HTTP заголовков
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false, // Для совместимости с некоторыми браузерами
});

/**
 * Rate limiting для защиты от DDoS
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Макс 100 запросов за 15 минут
  message: 'Слишком много запросов с этого IP, попробуйте позже',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Строгий rate limiter для аутентификации
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // Макс 5 попыток за 15 минут
  skipSuccessfulRequests: true,
  message: 'Слишком много попыток входа, попробуйте через 15 минут',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter для создания записей
 */
export const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: 10, // Макс 10 записей за час
  message: 'Слишком много записей, попробуйте позже',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Middleware для логирования запросов
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;
    
    console.log(`${method} ${originalUrl} ${statusCode} ${duration}ms`);
  });
  
  next();
};
