import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Получить список всех активных услуг
 */
export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        priceFrom: 'asc',
      },
      select: {
        id: true,
        name: true,
        description: true,
        priceFrom: true,
        duration: true,
      },
    });

    res.json(services);
  } catch (error) {
    console.error('Ошибка при получении услуг:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось загрузить услуги',
    });
  }
};

/**
 * Получить одну услугу по ID
 */
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Услуга не найдена',
      });
    }

    res.json(service);
  } catch (error) {
    console.error('Ошибка при получении услуги:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось загрузить услугу',
    });
  }
};
