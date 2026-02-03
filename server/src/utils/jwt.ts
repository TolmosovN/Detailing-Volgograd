import jwt from 'jsonwebtoken';
import { config } from '../config';

/**
 * Тип данных, которые хранятся в JWT токене
 */
export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Генерация JWT токена
 * @param payload - Данные для включения в токен
 * @returns JWT токен
 */
export const generateToken = (payload: JwtPayload): string => {
  const secret: string = process.env.JWT_SECRET || 'fallback-secret-key';
  const expiresIn: string = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, { expiresIn } as any);
};

/**
 * Верификация JWT токена
 * @param token - JWT токен
 * @returns Расшифрованные данные из токена
 */
export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key';

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Невалидный токен');
  }
};
