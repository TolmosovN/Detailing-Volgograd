# 📋 ЭТАП 6: Авторизация и личный кабинет

## 🎯 Цель этапа:

Добавить систему регистрации и авторизации пользователей с использованием JWT токенов, чтобы пользователи могли:
- Регистрироваться и входить в систему
- Видеть свои записи в личном кабинете
- Управлять своим профилем
- Автоматически заполнять данные при записи

---

## 📊 Что будем реализовывать:

### Backend (Express + JWT)
1. ✅ **Регистрация** (`POST /api/auth/register`)
   - Проверка уникальности email/телефона
   - Хеширование пароля (bcrypt)
   - Создание пользователя в БД
   - Возврат JWT токена

2. ✅ **Вход** (`POST /api/auth/login`)
   - Проверка email + пароль
   - Генерация JWT токена
   - Возврат токена и данных пользователя

3. ✅ **Middleware для защиты роутов**
   - Проверка JWT токена
   - Извлечение данных пользователя
   - Защита приватных endpoint'ов

4. ✅ **Профиль пользователя** (`GET /api/users/me`)
   - Получение данных текущего пользователя
   - Обновление профиля

5. ✅ **Мои записи** (`GET /api/bookings/my`)
   - Список записей текущего пользователя
   - Отмена записи

### Frontend (Next.js + React Context)
1. ✅ **Страница регистрации** (`/register`)
   - Форма с валидацией
   - Отправка данных на backend
   - Сохранение токена

2. ✅ **Страница входа** (`/login`)
   - Форма входа
   - Обработка ошибок
   - Редирект после входа

3. ✅ **Auth Context** (управление состоянием)
   - Хранение токена в localStorage
   - Проверка авторизации
   - Logout функция

4. ✅ **Личный кабинет** (`/profile`)
   - Информация о пользователе
   - Список записей
   - Кнопка выхода

5. ✅ **Обновление формы записи**
   - Автозаполнение для авторизованных
   - Упрощённая форма (без email/phone)

6. ✅ **Защищённые роуты**
   - Редирект неавторизованных на /login
   - Доступ к личному кабинету только для авторизованных

---

## 🗂️ Структура файлов (что создадим):

```
server/
├── src/
│   ├── middleware/
│   │   └── auth.ts                    # ✅ JWT middleware
│   ├── controllers/
│   │   ├── authController.ts          # ✅ Регистрация/Вход
│   │   └── usersController.ts         # ✅ Профиль пользователя
│   ├── routes/
│   │   ├── auth.ts                    # ✅ Роуты auth
│   │   └── users.ts                   # ✅ Роуты users
│   └── utils/
│       ├── jwt.ts                     # ✅ Утилиты для JWT
│       └── password.ts                # ✅ Хеширование паролей

client/
├── app/
│   ├── register/
│   │   └── page.tsx                   # ✅ Страница регистрации
│   ├── login/
│   │   └── page.tsx                   # ✅ Страница входа
│   └── profile/
│       └── page.tsx                   # ✅ Личный кабинет
├── src/
│   ├── features/
│   │   └── auth/
│   │       ├── components/
│   │       │   ├── RegisterForm.tsx   # ✅ Форма регистрации
│   │       │   ├── LoginForm.tsx      # ✅ Форма входа
│   │       │   └── UserProfile.tsx    # ✅ Профиль пользователя
│   │       ├── context/
│   │       │   └── AuthContext.tsx    # ✅ Context для auth
│   │       └── types.ts               # ✅ TypeScript типы
│   └── shared/
│       ├── api/
│       │   ├── authApi.ts             # ✅ API для auth
│       │   └── usersApi.ts            # ✅ API для users
│       └── hooks/
│           ├── useAuth.ts             # ✅ Hook для auth
│           └── useProtectedRoute.ts   # ✅ Hook для защиты роутов
```

---

## 🔧 Технологии:

### Backend
- **bcrypt** - Хеширование паролей
- **jsonwebtoken** - Генерация и проверка JWT
- **express-validator** - Валидация данных

### Frontend
- **React Context API** - Управление состоянием auth
- **localStorage** - Хранение JWT токена
- **Next.js middleware** - Защита роутов

---

## 📝 Пошаговый план реализации:

### Шаг 1: Подготовка (15 минут)
**Backend:**
1. Установить зависимости:
   ```bash
   cd server
   npm install bcrypt jsonwebtoken
   npm install --save-dev @types/bcrypt @types/jsonwebtoken
   ```

2. Добавить переменные в `.env`:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=7d
   ```

**Frontend:**
Никаких дополнительных зависимостей не нужно!

---

### Шаг 2: Backend - Утилиты (20 минут)

**2.1 Создать утилиты для паролей**
`server/src/utils/password.ts`:
- Функция для хеширования пароля (bcrypt)
- Функция для проверки пароля

**2.2 Создать утилиты для JWT**
`server/src/utils/jwt.ts`:
- Функция для генерации токена
- Функция для верификации токена

---

### Шаг 3: Backend - Middleware (15 минут)

**Создать middleware для проверки авторизации**
`server/src/middleware/auth.ts`:
- Извлечение токена из заголовка Authorization
- Проверка валидности токена
- Добавление данных пользователя в req.user

---

### Шаг 4: Backend - Контроллеры (45 минут)

**4.1 Auth Controller**
`server/src/controllers/authController.ts`:
- `register` - Регистрация нового пользователя
  - Валидация email, phone, password
  - Проверка уникальности
  - Хеширование пароля
  - Создание пользователя
  - Генерация JWT
  
- `login` - Вход в систему
  - Проверка email
  - Проверка пароля
  - Генерация JWT

**4.2 Users Controller**
`server/src/controllers/usersController.ts`:
- `getMe` - Получить данные текущего пользователя
- `updateProfile` - Обновить профиль
- `getMyBookings` - Получить мои записи

---

### Шаг 5: Backend - Роуты (15 минут)

**5.1 Auth Routes**
`server/src/routes/auth.ts`:
- `POST /api/auth/register`
- `POST /api/auth/login`

**5.2 Users Routes**
`server/src/routes/users.ts`:
- `GET /api/users/me` (защищён auth middleware)
- `PUT /api/users/me` (защищён)
- `GET /api/users/me/bookings` (защищён)

**5.3 Обновить Bookings Routes**
`server/src/routes/bookings.ts`:
- Использовать auth middleware (опциональный)
- Привязывать запись к userId если авторизован

---

### Шаг 6: Frontend - Auth Context (30 минут)

**Создать контекст для управления авторизацией**
`client/src/features/auth/context/AuthContext.tsx`:
- State: user, token, isAuthenticated, isLoading
- Функции:
  - `login(email, password)`
  - `register(email, password, name, phone)`
  - `logout()`
  - `checkAuth()` - проверка токена при загрузке
- Сохранение/удаление токена в localStorage

---

### Шаг 7: Frontend - API клиенты (20 минут)

**7.1 Auth API**
`client/src/shared/api/authApi.ts`:
- `register(data)` - POST /api/auth/register
- `login(data)` - POST /api/auth/login

**7.2 Users API**
`client/src/shared/api/usersApi.ts`:
- `getMe()` - GET /api/users/me
- `updateProfile(data)` - PUT /api/users/me
- `getMyBookings()` - GET /api/users/me/bookings

**7.3 Обновить apiClient**
`client/src/shared/api/apiClient.ts`:
- Добавить автоматическую отправку Authorization заголовка
- Брать token из localStorage

---

### Шаг 8: Frontend - Формы (45 минут)

**8.1 Форма регистрации**
`client/src/features/auth/components/RegisterForm.tsx`:
- Поля: email, phone, name, password, confirmPassword
- Валидация
- Обработка ошибок
- Редирект после регистрации

**8.2 Форма входа**
`client/src/features/auth/components/LoginForm.tsx`:
- Поля: email, password
- Обработка ошибок
- Редирект после входа

---

### Шаг 9: Frontend - Страницы (30 минут)

**9.1 Страница регистрации**
`client/app/register/page.tsx`:
- Использование RegisterForm
- Ссылка на страницу входа

**9.2 Страница входа**
`client/app/login/page.tsx`:
- Использование LoginForm
- Ссылка на страницу регистрации

**9.3 Страница профиля**
`client/app/profile/page.tsx`:
- Информация о пользователе
- Список записей
- Кнопка выхода
- Защита роута (редирект если не авторизован)

---

### Шаг 10: Frontend - Обновления (30 минут)

**10.1 Обновить Header**
`client/src/widgets/header/Header.tsx`:
- Показывать "Войти" / "Профиль" в зависимости от авторизации
- Ссылка на личный кабинет

**10.2 Обновить BookingForm**
`client/src/features/booking/components/BookingForm.tsx`:
- Автозаполнение email, phone, name для авторизованных
- Привязка записи к userId

---

### Шаг 11: Тестирование (20 минут)

**Проверить:**
1. ✅ Регистрация нового пользователя
2. ✅ Вход существующего пользователя
3. ✅ Доступ к личному кабинету
4. ✅ Просмотр своих записей
5. ✅ Автозаполнение формы записи
6. ✅ Выход из системы
7. ✅ Защита роутов (редирект на /login)

---

## ⏱️ Оценка времени:

| Этап | Время | Описание |
|------|-------|----------|
| Подготовка | 15 мин | Установка зависимостей |
| Backend утилиты | 20 мин | password.ts, jwt.ts |
| Backend middleware | 15 мин | auth.ts |
| Backend контроллеры | 45 мин | authController, usersController |
| Backend роуты | 15 мин | Настройка роутов |
| Frontend Context | 30 мин | AuthContext |
| Frontend API | 20 мин | authApi, usersApi |
| Frontend формы | 45 мин | RegisterForm, LoginForm |
| Frontend страницы | 30 мин | /register, /login, /profile |
| Обновления | 30 мин | Header, BookingForm |
| Тестирование | 20 мин | Проверка всех функций |

**ИТОГО:** ~4-5 часов работы

---

## 🔐 Безопасность:

### Что реализуем:
✅ Хеширование паролей (bcrypt)
✅ JWT токены для авторизации
✅ Валидация данных на backend
✅ Защита роутов middleware
✅ httpOnly cookies (опционально, для продвинутых)

### Что НЕ делаем на этом этапе (можно добавить позже):
- Email подтверждение
- Восстановление пароля
- 2FA (двухфакторная аутентификация)
- OAuth (Google/Facebook)
- Rate limiting

---

## 📦 Зависимости для установки:

### Backend:
```bash
npm install bcrypt jsonwebtoken
npm install --save-dev @types/bcrypt @types/jsonwebtoken
```

### Frontend:
Никаких дополнительных зависимостей! Используем встроенные React Context API и localStorage.

---

## 🎯 Результат этапа:

После завершения Этапа 6 у нас будет:

✅ **Регистрация и вход** - пользователи могут создавать аккаунты
✅ **JWT авторизация** - безопасная система токенов
✅ **Личный кабинет** - пользователи видят свои записи
✅ **Автозаполнение форм** - удобство для авторизованных
✅ **Защищённые роуты** - контроль доступа
✅ **Обновлённая модель записи** - связь с userId

---

## 📝 Что изменится в существующем коде:

### 1. Bookings Controller
Обновим создание записи:
- Если пользователь авторизован → берём userId из токена
- Если не авторизован → создаём с временным userId (как сейчас)

### 2. Header Component
Добавим:
- Проверку авторизации
- Кнопку "Войти" или "Профиль"

### 3. API Client
Добавим:
- Автоматическую отправку Authorization заголовка
- Обработку 401 ошибок (токен истёк)

---

## 🚀 Готовы начать?

Когда будете готовы, напишите **"начинаем этап 6"** и я:
1. Установлю нужные зависимости
2. Создам все файлы по порядку
3. Буду давать вам команды для тестирования

Или можем работать поэтапно, как в Этапе 5 - я создаю файлы, вы тестируете!

---

## 💡 Альтернативный подход (упрощённый):

Если хотите быстрее, можем сделать **упрощённую версию**:
- Убрать регистрацию (только логин)
- Упростить личный кабинет
- Базовая авторизация без JWT

**Но я рекомендую полную версию** - это стандартный подход в индустрии! 💪

---

**Что скажете? Готовы к Этапу 6?** 🚀
