import { Router } from 'express';
import {
  register,
  registerValidation,
  login,
  loginValidation,
} from '../controllers/authController';

const router = Router();

/**
 * POST /api/auth/register
 * Регистрация нового пользователя
 */
router.post('/register', registerValidation, register);

/**
 * POST /api/auth/login
 * Вход в систему
 */
router.post('/login', loginValidation, login);

export default router;
