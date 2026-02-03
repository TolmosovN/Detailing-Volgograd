import { Request, Response, NextFunction } from 'express';

/**
 * Middleware для проверки прав администратора.
 * Должен использоваться ПОСЛЕ authMiddleware.
 * 
 * @example
 * router.get('/admin/stats', authMiddleware, adminAuthMiddleware, getStats);
 */
export const adminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Проверяем, что пользователь авторизован (должен быть установлен authMiddleware)
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Требуется авторизация',
      });
      return;
    }

    // Проверяем роль пользователя
    if (req.user.role !== 'ADMIN') {
      res.status(403).json({
        status: 'error',
        message: 'Доступ запрещён. Требуются права администратора.',
      });
      return;
    }

    // Пользователь - администратор, пропускаем дальше
    next();
  } catch (error) {
    console.error('Ошибка в adminAuthMiddleware:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка проверки прав доступа',
    });
  }
};
