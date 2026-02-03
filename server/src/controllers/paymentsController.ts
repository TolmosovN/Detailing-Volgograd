import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { paymentService } from '../services/paymentService';

/**
 * Валидация для создания платежа
 */
export const createPaymentValidation = [
  body('bookingId')
    .isInt({ min: 1 })
    .withMessage('ID записи обязателен и должен быть числом'),
  body('amount')
    .isInt({ min: 1 })
    .withMessage('Сумма должна быть положительным числом'),
  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Описание должно быть строкой'),
];

/**
 * Создать платеж
 */
export const createPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 'error',
        message: 'Ошибка валидации',
        errors: errors.array(),
      });
      return;
    }

    const { bookingId, amount, description, returnUrl } = req.body;

    // Создаем платеж
    const payment = await paymentService.createPayment({
      bookingId: parseInt(bookingId),
      amount: parseInt(amount),
      description: description || `Оплата записи #${bookingId}`,
      returnUrl,
    });

    res.status(201).json({
      status: 'success',
      message: 'Платеж создан',
      data: payment,
    });
  } catch (error: any) {
    console.error('Ошибка создания платежа:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Не удалось создать платеж',
    });
  }
};

/**
 * Получить информацию о платеже
 */
export const getPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const payment = await paymentService.getPayment(parseInt(id));

    if (!payment) {
      res.status(404).json({
        status: 'error',
        message: 'Платеж не найден',
      });
      return;
    }

    res.json({
      status: 'success',
      data: payment,
    });
  } catch (error) {
    console.error('Ошибка получения платежа:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось получить информацию о платеже',
    });
  }
};

/**
 * Получить платеж по ID записи
 */
export const getPaymentByBookingId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { bookingId } = req.params;

    const payment = await paymentService.getPaymentByBookingId(
      parseInt(bookingId)
    );

    if (!payment) {
      res.status(404).json({
        status: 'error',
        message: 'Платеж не найден',
      });
      return;
    }

    res.json({
      status: 'success',
      data: payment,
    });
  } catch (error) {
    console.error('Ошибка получения платежа:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось получить информацию о платеже',
    });
  }
};

/**
 * Webhook от платежной системы
 * Этот endpoint вызывается платежной системой при изменении статуса платежа
 */
export const handleWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const webhookData = req.body;

    console.log('Получен webhook:', webhookData);

    // Обрабатываем webhook от ЮKassa
    await paymentService.handleYukassaWebhook(webhookData);

    // Возвращаем 200 OK чтобы платежная система знала, что мы получили уведомление
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Ошибка обработки webhook:', error);
    // Все равно возвращаем 200, чтобы платежная система не пыталась повторно отправить
    res.status(200).json({ status: 'error' });
  }
};

/**
 * Подтвердить платеж вручную (для mock режима)
 * В production это делает webhook
 */
export const confirmPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, externalId, paymentMethod } = req.body;

    await paymentService.confirmPayment(parseInt(id), {
      status,
      externalId: externalId || `manual_${Date.now()}`,
      paymentMethod,
    });

    res.json({
      status: 'success',
      message: 'Платеж подтвержден',
    });
  } catch (error) {
    console.error('Ошибка подтверждения платежа:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось подтвердить платеж',
    });
  }
};
