import { Router } from 'express';
import {
  createBooking,
  createBookingValidation,
  getAllBookings,
} from '../controllers/bookingsController';
import { optionalAuthMiddleware } from '../middleware/auth';

const router = Router();

/**
 * POST /api/bookings
 * Создать запись (опциональная авторизация)
 * Если пользователь авторизован - запись привяжется к нему автоматически
 */
router.post('/', optionalAuthMiddleware, createBookingValidation, createBooking);

/**
 * GET /api/bookings
 * Получить все записи (для админа, пока без защиты)
 */
router.get('/', getAllBookings);

export default router;
