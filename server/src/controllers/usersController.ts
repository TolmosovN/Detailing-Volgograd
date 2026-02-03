import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Получить данные текущего пользователя
 * GET /api/users/me
 * Требует авторизации (authMiddleware)
 */
export const getMe = async (req: Request, res: Response) => {
  try {
    // req.user добавляется authMiddleware
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Не авторизован',
      });
    }

    // Получаем пользователя из БД
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Пользователь не найден',
      });
    }

    res.json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось загрузить профиль',
    });
  }
};

/**
 * Получить записи текущего пользователя
 * GET /api/users/me/bookings
 * Требует авторизации (authMiddleware)
 */
export const getMyBookings = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Не авторизован',
      });
    }

    // Получаем записи пользователя
    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user.userId,
      },
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
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json({
      status: 'success',
      data: bookings,
    });
  } catch (error) {
    console.error('Ошибка при получении записей:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось загрузить записи',
    });
  }
};

/**
 * Обновить профиль пользователя
 * PUT /api/users/me
 * Требует авторизации (authMiddleware)
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Не авторизован',
      });
    }

    const { name, phone } = req.body;

    // Проверяем, не занят ли телефон другим пользователем
    if (phone) {
      const existingUser = await prisma.user.findUnique({
        where: { phone },
      });

      if (existingUser && existingUser.id !== req.user.userId) {
        return res.status(409).json({
          status: 'error',
          message: 'Этот номер телефона уже используется',
        });
      }
    }

    // Обновляем профиль
    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.userId,
      },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
      },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
      },
    });

    res.json({
      status: 'success',
      message: 'Профиль обновлён',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось обновить профиль',
    });
  }
};
