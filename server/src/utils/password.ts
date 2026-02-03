import bcrypt from 'bcrypt';

/**
 * Количество раундов для bcrypt (чем больше - тем безопаснее, но медленнее)
 */
const SALT_ROUNDS = 10;

/**
 * Хеширование пароля
 * @param password - Открытый пароль
 * @returns Хешированный пароль
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Проверка пароля
 * @param password - Введённый пароль
 * @param hashedPassword - Хешированный пароль из БД
 * @returns true если пароль совпадает
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
