# 🚗 Detailing Volgograd

Современный веб-сайт для автомойки с онлайн-записью на услуги, системой управления записями и интеграцией с платежными системами.

## 🎯 О проекте

Полнофункциональное веб-приложение для автомойки "Detailing Volgograd", включающее:
- 💻 Адаптивный фронтенд на Next.js 14
- 🔧 RESTful API на Express.js
- 🗄️ База данных MySQL с Prisma ORM
- 📱 Mobile-first дизайн
- 🎨 Современный UI с Tailwind CSS

## 📚 Документация

### Установка и разработка:
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Подробная инструкция по установке и запуску
- **[client/README.md](./client/README.md)** - Документация фронтенда
- **[server/README.md](./server/README.md)** - Документация бэкенда
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Архитектура приложения

### Деплой и продакшен:
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Руководство по деплою на VPS/PaaS
- **[SECURITY.md](./SECURITY.md)** - Меры безопасности и чеклист
- **[PAYMENT_SETUP.md](./PAYMENT_SETUP.md)** - Настройка платежной системы Yookassa

### Этапы разработки:
- **[STAGE9_COMPLETED.md](./STAGE9_COMPLETED.md)** - Уведомления и UI/UX улучшения
- **[UI_IMPROVEMENTS_COMPLETE.md](./UI_IMPROVEMENTS_COMPLETE.md)** - Детали UI улучшений
- **[STAGE10_PLAN.md](./STAGE10_PLAN.md)** - Финальная подготовка к деплою

## ⚡ Быстрый старт

### Предварительные требования
- Node.js 18+
- MySQL 8+
- npm 9+

### Установка

1. Клонируйте репозиторий и настройте окружение:
```bash
cp .env.example .env
# Отредактируйте .env, указав данные MySQL
```

2. Установите зависимости и запустите проект:
```bash
# Backend
cd server
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev

# Frontend (в новом терминале)
cd client
npm install
npm run dev
```

3. Откройте [http://localhost:3000](http://localhost:3000)

📖 **Полная инструкция**: см. [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🏗️ Структура проекта

```
Detailing-Volgograd/
├── client/              # Frontend (Next.js)
│   ├── app/            # Next.js App Router
│   ├── src/
│   │   ├── features/   # Фичи (booking, services)
│   │   ├── widgets/    # Виджеты (header, footer)
│   │   └── shared/     # Общий код (ui, api, lib)
│   └── package.json
├── server/             # Backend (Express)
│   ├── prisma/        # Схема БД и миграции
│   ├── src/
│   │   ├── config/    # Конфигурация
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middleware/
│   └── package.json
├── .env               # Переменные окружения
└── README.md
```

## 🛠️ Технологический стек

### Frontend
- **Next.js 14** - React framework с App Router
- **TypeScript** - Статическая типизация
- **Tailwind CSS** - Утилитарные стили
- **Feature-Sliced Design** - Архитектура

### Backend
- **Express.js** - Web framework
- **Prisma ORM** - Работа с БД
- **MySQL** - База данных
- **express-validator** - Валидация
- **TypeScript** - Типизация

### Дополнительные технологии
- **React Hot Toast** - Toast уведомления
- **Framer Motion** - Анимации
- **React Loading Skeleton** - Loading states
- **Winston** - Логирование
- **Helmet** - Безопасность HTTP заголовков
- **Express Rate Limit** - Защита от DDoS

### Интеграции
- **Платежи**: Yookassa (mock режим для разработки)
- **Email**: Nodemailer + Handlebars (mock режим для разработки)
- **Карты**: Готово к интеграции Google Maps / Яндекс.Карты

## 📊 API Endpoints

### Авторизация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему

### Services (Услуги)
- `GET /api/services` - Список активных услуг
- `GET /api/services/:id` - Услуга по ID

### Bookings (Записи)
- `POST /api/bookings` - Создать запись (с платежом)
- `GET /api/bookings` - Список записей

### Users (Пользователи)
- `GET /api/users/me` - Текущий пользователь
- `GET /api/users/me/bookings` - Записи пользователя

### Admin (Админ-панель)
- `GET /api/admin/stats` - Статистика
- `GET /api/admin/bookings` - Все записи с фильтрами
- `PATCH /api/admin/bookings/:id/status` - Изменить статус записи
- `POST /api/admin/services` - Создать услугу
- `PUT /api/admin/services/:id` - Обновить услугу
- `DELETE /api/admin/services/:id` - Деактивировать услугу

### Payments (Платежи)
- `POST /api/payments/create` - Создать платеж
- `GET /api/payments/:id` - Получить платеж
- `GET /api/payments/booking/:bookingId` - Платеж по записи
- `POST /api/payments/:id/confirm` - Подтвердить платеж (тест)
- `POST /api/payments/webhook` - Webhook от платежной системы

### Health & Monitoring
- `GET /api/health` - Полный health check
- `GET /api/health/ready` - Readiness probe
- `GET /api/health/live` - Liveness probe

## 🎯 Этапы разработки

- ✅ **Этап 1-4**: Инициализация, UI компоненты, главная, форма записи
- ✅ **Этап 5**: Подключение реального API (Express + Prisma + MySQL)
- ✅ **Этап 6**: Авторизация и личный кабинет (JWT, роли)
- ✅ **Этап 7**: Админ-панель для управления записями
- ✅ **Этап 8**: Интеграция платежных систем (Yookassa mock)
- ✅ **Этап 9**: Email уведомления + UI/UX улучшения
  - Loading Skeletons
  - Модальные окна
  - Поиск и фильтры
  - Анимации (Framer Motion)
  - Toast notifications
- ✅ **Этап 10**: Финальная подготовка
  - Оптимизация производительности
  - SEO настройки (метатеги, sitemap, robots.txt)
  - Безопасность (Helmet, Rate limiting, Graceful shutdown)
  - Мониторинг и логирование (Winston)
  - Документация деплоя
- 🚀 **Этап 11**: Деплой (следующий шаг)

## 👨‍💻 Для разработчиков

### Правила разработки
- Код с комментариями на русском
- Feature-based архитектура на фронте
- Контроллеры/сервисы на бэкенде
- Все секреты в `.env` файлах
- Mobile-first подход

### Полезные команды

**Prisma:**
```bash
npm run prisma:studio    # GUI для БД
npm run prisma:migrate   # Создать миграцию
npm run seed             # Заполнить БД тестовыми данными
```

**Проверка:**
```bash
# Health check
curl http://localhost:5000/api/health

# Получить услуги
curl http://localhost:5000/api/services

# Тестовые пользователи (после seed):
# Админ: admin@detailing.ru / admin123
# Клиент: test@example.com / test123
```

## 🔐 Безопасность

Приложение включает:
- ✅ JWT аутентификация
- ✅ Bcrypt хеширование паролей
- ✅ Helmet для HTTP заголовков
- ✅ Rate limiting (защита от DDoS)
- ✅ CORS настройки
- ✅ Валидация всех входных данных
- ✅ XSS защита
- ✅ SQL injection защита (Prisma)

См. [SECURITY.md](./SECURITY.md) для деталей.

## 📝 Дополнительные правила проекта

См. файл [.cursorrules](./.cursorrules) для полного списка правил разработки.