import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Ошибка:', err);

  res.status(500).json({
    status: 'error',
    message: err.message || 'Внутренняя ошибка сервера',
  });
};
