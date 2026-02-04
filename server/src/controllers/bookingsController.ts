import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../config/database';
import { emailService } from '../services/emailService';

/**
 * Правила валидации для создания записи
 */
export const createBookingValidation = [
  body('serviceId').isInt({ min: 1 }).withMessage('Некорректный ID услуги'),
  body('date').isISO8601().withMessage('Некорректная дата'),
  body('time').matches(/^([0-1][0-9]|2[0-1]):[0-5][0-9]$/).withMessage('Некорректное время'),
  body('name').trim().isLength({ min: 2 }).withMessage('Имя должно содержать минимум 2 символа'),
  body('phone').matches(/^\+7\d{10}$/).withMessage('Некорректный номер телефона'),
  body('email').isEmail().withMessage('Некорректный email'),
];

/**
 * Создать новую запись на мойку
 */
export const createBooking = async (req: Request, res: Response) => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Ошибка валидации данных',
        errors: errors.array(),
      });
    }

    const { serviceId, date, time, name, phone, email } = req.body;

    // Проверяем, существует ли услуга
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || !service.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Услуга не найдена или недоступна',
      });
    }

    // Проверяем, нет ли уже записи на это время
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: new Date(date),
        time,
        status: {
          notIn: ['CANCELLED'],
        },
      },
    });

    if (existingBooking) {
      return res.status(409).json({
        status: 'error',
        message: 'На это время уже есть запись',
      });
    }

    // Определяем userId: если пользователь авторизован - берём из токена,
    // если нет - используем временный ID 1 (для гостевых записей)
    const userId = req.user?.userId || 1;

    // Создаем запись и платеж в транзакции
    const result = await prisma.$transaction(async (tx) => {
      // Создаем запись
      const booking = await tx.booking.create({
        data: {
          serviceId,
          date: new Date(date),
          time,
          name,
          phone,
          email,
          userId,
          status: 'PENDING',
        },
        include: {
          service: true,
        },
      });

      // Создаем запись платежа
      // Сумма в копейках (умножаем цену в рублях на 100)
      const amountInKopecks = service.priceFrom * 100;

      const payment = await tx.payment.create({
        data: {
          bookingId: booking.id,
          amount: amountInKopecks,
          status: 'PENDING',
          provider: 'mock', // По умолчанию mock, будет обновлено при создании платежа
        },
      });

      return { booking, payment };
    });

    // Отправляем email о создании записи (асинхронно)
    emailService.sendBookingCreatedEmail(email, {
      id: result.booking.id,
      clientName: name,
      serviceName: result.booking.service.name,
      date: new Date(date).toLocaleDateString('ru-RU'),
      time,
      amount: result.booking.service.priceFrom,
    }).catch((error) => {
      console.error('Failed to send booking email:', error);
    });

    res.status(201).json({
      status: 'success',
      message: 'Запись успешно создана',
      data: {
        booking: result.booking,
        payment: {
          id: result.payment.id,
          amount: result.payment.amount,
          status: result.payment.status,
        },
      },
    });
  } catch (error) {
    console.error('Ошибка при создании записи:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось создать запись',
    });
  }
};

/**
 * Получить все записи (для админа)
 */
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error('Ошибка при получении записей:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось загрузить записи',
    });
  }
};
