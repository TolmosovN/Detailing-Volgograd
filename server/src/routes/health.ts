import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';

const router = Router();

/**
 * Health check endpoint
 * Проверяет работоспособность сервера и базы данных
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // Проверяем подключение к БД
    await prisma.$queryRaw`SELECT 1`;
    
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
    };
    
    res.status(200).json(healthCheck);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: 'Service unavailable',
    });
  }
});

/**
 * Readiness check endpoint
 * Для k8s или других оркестраторов
 */
router.get('/ready', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready' });
  }
});

/**
 * Liveness check endpoint
 * Проверяет что процесс жив
 */
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({ status: 'alive' });
});

export default router;
