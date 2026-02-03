import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getMe,
  getMyBookings,
  updateProfile,
} from '../controllers/usersController';

const router = Router();

/**
 * Все роуты в этом файле требуют авторизации
 */
router.use(authMiddleware);

/**
 * GET /api/users/me
 * Получить данные текущего пользователя
 */
router.get('/me', getMe);

/**
 * PUT /api/users/me
 * Обновить профиль текущего пользователя
 */
router.put('/me', updateProfile);

/**
 * GET /api/users/me/bookings
 * Получить записи текущего пользователя
 */
router.get('/me/bookings', getMyBookings);

export default router;
