import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { 
  helmetMiddleware, 
  generalLimiter, 
  authLimiter, 
  bookingLimiter,
  requestLogger 
} from './middleware/security';
import { logger } from './utils/logger';
import servicesRoutes from './routes/services';
import bookingsRoutes from './routes/bookings';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import adminRoutes from './routes/admin';
import paymentsRoutes from './routes/payments';
import healthRoutes from './routes/health';

const app = express();

// Security middleware
app.use(helmetMiddleware);
app.use(generalLimiter); // Общий rate limiting

// CORS
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression для уменьшения размера ответов
app.use(compression());

// Request logging
app.use(requestLogger);

// Health check endpoints
app.use('/api/health', healthRoutes);

// Роуты API (с rate limiting)
app.use('/api/auth', authLimiter, authRoutes); // Строгий лимит для авторизации
app.use('/api/users', usersRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/bookings', bookingLimiter, bookingsRoutes); // Лимит для записей
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Эндпоинт не найден',
  });
});

// Error handler
app.use(errorHandler);

// Запуск сервера
const server = app.listen(config.port, () => {
  logger.info(`🚀 Сервер запущен на http://localhost:${config.port}`);
  logger.info(`🌍 Окружение: ${config.nodeEnv}`);
  logger.info(`✅ CORS разрешен для: ${config.corsOrigin}`);
  console.log(`🚀 Сервер запущен на http://localhost:${config.port}`);
  console.log(`🌍 Окружение: ${config.nodeEnv}`);
  console.log(`✅ CORS разрешен для: ${config.corsOrigin}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM получен, начинаем graceful shutdown');
  server.close(() => {
    logger.info('Сервер закрыт, процесс завершается');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT получен, начинаем graceful shutdown');
  server.close(() => {
    logger.info('Сервер закрыт, процесс завершается');
    process.exit(0);
  });
});
