import { Router } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';
import {
  createPayment,
  createPaymentValidation,
  getPayment,
  getPaymentByBookingId,
  handleWebhook,
  confirmPayment,
} from '../controllers/paymentsController';

const router = Router();

/**
 * Создать платеж
 * Может использоваться с авторизацией или без (для гостей)
 */
router.post(
  '/create',
  optionalAuthMiddleware,
  createPaymentValidation,
  createPayment
);

/**
 * Получить информацию о платеже по ID
 */
router.get('/:id', optionalAuthMiddleware, getPayment);

/**
 * Получить платеж по ID записи
 */
router.get('/booking/:bookingId', optionalAuthMiddleware, getPaymentByBookingId);

/**
 * Webhook от платежной системы
 * Не требует авторизации, так как вызывается внешней системой
 */
router.post('/webhook', handleWebhook);

/**
 * Подтвердить платеж вручную (для тестирования)
 * Требует авторизации
 */
router.post('/:id/confirm', authMiddleware, confirmPayment);

export default router;
