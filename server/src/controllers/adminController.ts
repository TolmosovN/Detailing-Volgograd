import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient, BookingStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Получить статистику для админ-панели
 */
export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Общее количество записей
    const totalBookings = await prisma.booking.count();

    // Новые записи (за последние 24 часа)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const newBookings = await prisma.booking.count({
      where: {
        createdAt: {
          gte: yesterday,
        },
      },
    });

    // Записи в ожидании подтверждения
    const pendingBookings = await prisma.booking.count({
      where: {
        status: BookingStatus.PENDING,
      },
    });

    // Выполненные записи за текущий месяц
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const completedThisMonth = await prisma.booking.count({
      where: {
        status: BookingStatus.COMPLETED,
        updatedAt: {
          gte: startOfMonth,
        },
      },
    });

    // Общий доход (сумма всех выполненных записей)
    const completedBookings = await prisma.booking.findMany({
      where: {
        status: BookingStatus.COMPLETED,
      },
      include: {
        service: true,
      },
    });

    const totalRevenue = completedBookings.reduce((sum, booking) => {
      return sum + booking.service.priceFrom;
    }, 0);

    // Популярные услуги (топ-3)
    const servicesWithCount = await prisma.service.findMany({
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        bookings: {
          _count: 'desc',
        },
      },
      take: 3,
    });

    const popularServices = servicesWithCount.map((service) => ({
      id: service.id,
      name: service.name,
      bookingsCount: service._count.bookings,
    }));

    res.json({
      status: 'success',
      data: {
        totalBookings,
        newBookings,
        pendingBookings,
        completedThisMonth,
        totalRevenue,
        popularServices,
      },
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось получить статистику',
    });
  }
};

/**
 * Получить все записи с фильтрацией
 */
export const getAllBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status, date, search } = req.query;

    // Формируем условия фильтрации
    const where: any = {};

    // Фильтр по статусу
    if (status && status !== 'all') {
      where.status = status as BookingStatus;
    }

    // Фильтр по дате
    if (date) {
      const filterDate = new Date(date as string);
      const nextDay = new Date(filterDate);
      nextDay.setDate(nextDay.getDate() + 1);

      where.date = {
        gte: filterDate,
        lt: nextDay,
      };
    }

    // Поиск по имени, телефону или email
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { phone: { contains: search as string } },
        { email: { contains: search as string } },
      ];
    }

    // Получаем записи с информацией об услуге и пользователе
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            priceFrom: true,
            duration: true,
          },
        },
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
        createdAt: 'desc',
      },
    });

    res.json({
      status: 'success',
      data: bookings,
    });
  } catch (error) {
    console.error('Ошибка получения записей:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось получить список записей',
    });
  }
};

/**
 * Обновить статус записи
 */
export const updateBookingStatusValidation = [
  body('status')
    .isIn(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])
    .withMessage('Некорректный статус'),
];

export const updateBookingStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 'error',
        message: 'Ошибка валидации',
        errors: errors.array(),
      });
      return;
    }

    const { id } = req.params;
    const { status } = req.body;

    // Проверяем, существует ли запись
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
    });

    if (!booking) {
      res.status(404).json({
        status: 'error',
        message: 'Запись не найдена',
      });
      return;
    }

    // Обновляем статус
    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: {
        status: status as BookingStatus,
      },
      include: {
        service: true,
        user: true,
      },
    });

    res.json({
      status: 'success',
      message: 'Статус записи обновлён',
      data: updatedBooking,
    });
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось обновить статус записи',
    });
  }
};

/**
 * Создать новую услугу
 */
export const createServiceValidation = [
  body('name').trim().notEmpty().withMessage('Название обязательно'),
  body('description').trim().notEmpty().withMessage('Описание обязательно'),
  body('priceFrom')
    .isInt({ min: 0 })
    .withMessage('Цена должна быть положительным числом'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Длительность должна быть положительным числом'),
];

export const createService = async (
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

    const { name, description, priceFrom, duration } = req.body;

    const service = await prisma.service.create({
      data: {
        name,
        description,
        priceFrom: parseInt(priceFrom),
        duration: parseInt(duration),
        isActive: true,
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Услуга создана',
      data: service,
    });
  } catch (error) {
    console.error('Ошибка создания услуги:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось создать услугу',
    });
  }
};

/**
 * Обновить услугу
 */
export const updateServiceValidation = [
  body('name').optional().trim().notEmpty().withMessage('Название не может быть пустым'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Описание не может быть пустым'),
  body('priceFrom')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Цена должна быть положительным числом'),
  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Длительность должна быть положительным числом'),
  body('isActive').optional().isBoolean().withMessage('isActive должно быть boolean'),
];

export const updateService = async (
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

    const { id } = req.params;
    const { name, description, priceFrom, duration, isActive } = req.body;

    // Проверяем, существует ли услуга
    const existingService = await prisma.service.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingService) {
      res.status(404).json({
        status: 'error',
        message: 'Услуга не найдена',
      });
      return;
    }

    // Обновляем услугу
    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(priceFrom !== undefined && { priceFrom: parseInt(priceFrom) }),
        ...(duration !== undefined && { duration: parseInt(duration) }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({
      status: 'success',
      message: 'Услуга обновлена',
      data: service,
    });
  } catch (error) {
    console.error('Ошибка обновления услуги:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось обновить услугу',
    });
  }
};

/**
 * Деактивировать услугу (не удаляем, чтобы сохранить историю)
 */
export const deleteService = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Проверяем, существует ли услуга
    const existingService = await prisma.service.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingService) {
      res.status(404).json({
        status: 'error',
        message: 'Услуга не найдена',
      });
      return;
    }

    // Деактивируем услугу вместо удаления
    await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        isActive: false,
      },
    });

    res.json({
      status: 'success',
      message: 'Услуга деактивирована',
    });
  } catch (error) {
    console.error('Ошибка удаления услуги:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось деактивировать услугу',
    });
  }
};

/**
 * Получить все услуги (включая неактивные) для админа
 */
export const getAllServices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const services = await prisma.service.findMany({
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      status: 'success',
      data: services,
    });
  } catch (error) {
    console.error('Ошибка получения услуг:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось получить список услуг',
    });
  }
};
