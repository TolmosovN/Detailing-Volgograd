import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { adminAuthMiddleware } from '../middleware/adminAuth';
import {
  getStats,
  getAllBookings,
  updateBookingStatus,
  updateBookingStatusValidation,
  createService,
  createServiceValidation,
  updateService,
  updateServiceValidation,
  deleteService,
  getAllServices,
} from '../controllers/adminController';

const router = Router();

/**
 * Все роуты защищены authMiddleware + adminAuthMiddleware
 * Только авторизованные пользователи с ролью ADMIN могут получить доступ
 */

// Статистика
router.get('/stats', authMiddleware, adminAuthMiddleware, getStats);

// Управление записями
router.get('/bookings', authMiddleware, adminAuthMiddleware, getAllBookings);
router.patch(
  '/bookings/:id/status',
  authMiddleware,
  adminAuthMiddleware,
  updateBookingStatusValidation,
  updateBookingStatus
);

// Управление услугами
router.get('/services', authMiddleware, adminAuthMiddleware, getAllServices);
router.post(
  '/services',
  authMiddleware,
  adminAuthMiddleware,
  createServiceValidation,
  createService
);
router.put(
  '/services/:id',
  authMiddleware,
  adminAuthMiddleware,
  updateServiceValidation,
  updateService
);
router.delete('/services/:id', authMiddleware, adminAuthMiddleware, deleteService);

export default router;
