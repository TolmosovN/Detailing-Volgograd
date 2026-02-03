import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';

/**
 * Расширяем Express Request для добавления информации о пользователе
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware для проверки JWT токена
 * Извлекает токен из заголовка Authorization и верифицирует его
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'Токен не предоставлен',
      });
    }

    // Токен приходит в формате "Bearer TOKEN"
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Неверный формат токена',
      });
    }

    // Верифицируем токен
    const decoded = verifyToken(token);

    // Добавляем данные пользователя в request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Невалидный или истёкший токен',
    });
  }
};

/**
 * Опциональный middleware для auth
 * Не блокирует запрос, если токена нет, но добавляет user в request если токен есть
 */
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = verifyToken(token);
        req.user = decoded;
      }
    }

    next();
  } catch (error) {
    // Если токен невалидный, просто продолжаем без user
    next();
  }
};
