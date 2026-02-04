import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { emailService } from '../services/emailService';

/**
 * Правила валидации для регистрации
 */
export const registerValidation = [
  body('email').isEmail().withMessage('Некорректный email'),
  body('phone').matches(/^\+7\d{10}$/).withMessage('Некорректный номер телефона (+7XXXXXXXXXX)'),
  body('name').trim().isLength({ min: 2 }).withMessage('Имя должно содержать минимум 2 символа'),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен содержать минимум 6 символов'),
];

/**
 * Правила валидации для входа
 */
export const loginValidation = [
  body('email').isEmail().withMessage('Некорректный email'),
  body('password').notEmpty().withMessage('Пароль обязателен'),
];

/**
 * Регистрация нового пользователя
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response) => {
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

    const { email, phone, name, password } = req.body;

    // Проверяем, существует ли пользователь с таким email
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return res.status(409).json({
        status: 'error',
        message: 'Пользователь с таким email уже существует',
      });
    }

    // Проверяем, существует ли пользователь с таким телефоном
    const existingUserByPhone = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUserByPhone) {
      return res.status(409).json({
        status: 'error',
        message: 'Пользователь с таким телефоном уже существует',
      });
    }

    // Хешируем пароль
    const hashedPassword = await hashPassword(password);

    // Создаём пользователя
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        name,
        password: hashedPassword,
        role: 'CLIENT',
      },
    });

    // Генерируем JWT токен
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Отправляем приветственное email (асинхронно, не блокируем ответ)
    emailService.sendWelcomeEmail(user.email, user.name).catch((error) => {
      console.error('Failed to send welcome email:', error);
    });

    // Возвращаем токен и данные пользователя (без пароля)
    res.status(201).json({
      status: 'success',
      message: 'Регистрация успешна',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось зарегистрировать пользователя',
    });
  }
};

/**
 * Вход в систему
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response) => {
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

    const { email, password } = req.body;

    // Ищем пользователя по email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Неверный email или пароль',
      });
    }

    // Проверяем пароль
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Неверный email или пароль',
      });
    }

    // Генерируем JWT токен
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Возвращаем токен и данные пользователя (без пароля)
    res.json({
      status: 'success',
      message: 'Вход выполнен успешно',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({
      status: 'error',
      message: 'Не удалось выполнить вход',
    });
  }
};
