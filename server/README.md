# Backend Detailing Volgograd

Express.js backend для сайта автомойки с использованием Prisma ORM и MySQL.

## 🚀 Установка

1. Установите зависимости:
```bash
npm install
```

2. Настройте переменные окружения:
   - Создайте файл `.env` в корне проекта (или используйте корневой `.env`)
   - Обновите `DATABASE_URL` с вашими учетными данными MySQL:
   ```
   DATABASE_URL="mysql://root:your_password@localhost:3306/detailing_volgograd"
   ```

3. Инициализируйте базу данных:
```bash
# Генерация Prisma Client
npm run prisma:generate

# Создание таблиц в БД
npm run prisma:migrate

# Заполнение БД тестовыми данными
npm run seed
```

## 🏃 Запуск

### Режим разработки
```bash
npm run dev
```
Сервер запустится на `http://localhost:3001`

### Production режим
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Services (Услуги)
- `GET /api/services` - Получить список всех активных услуг
- `GET /api/services/:id` - Получить услугу по ID

### Bookings (Записи)
- `POST /api/bookings` - Создать новую запись на мойку
- `GET /api/bookings` - Получить список всех записей (для админа)

### Health Check
- `GET /api/health` - Проверка работоспособности сервера

## 🗄️ База данных

### Модели:
- **User** - Пользователи (клиенты и админы)
- **Service** - Услуги автомойки
- **Booking** - Записи на мойку
- **Payment** - Платежи

### Prisma команды:
```bash
# Открыть Prisma Studio (GUI для БД)
npm run prisma:studio

# Создать новую миграцию
npm run prisma:migrate

# Сбросить БД и применить все миграции
npx prisma migrate reset
```

## 📝 Структура проекта

```
server/
├── prisma/
│   ├── schema.prisma      # Схема базы данных
│   └── seed.ts            # Скрипт для заполнения БД
├── src/
│   ├── config/
│   │   └── index.ts       # Конфигурация приложения
│   ├── controllers/
│   │   ├── servicesController.ts
│   │   └── bookingsController.ts
│   ├── middleware/
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── services.ts
│   │   └── bookings.ts
│   └── index.ts           # Точка входа
├── package.json
└── tsconfig.json
```

## 🔧 Технологии

- **Express.js** - Web framework
- **Prisma** - ORM для работы с MySQL
- **TypeScript** - Типизация
- **express-validator** - Валидация данных
- **cors** - CORS middleware

## 📌 TODO

- [ ] Добавить аутентификацию JWT
- [ ] Реализовать роль админа
- [ ] Подключить платежные системы
- [ ] Добавить отправку email уведомлений
- [ ] Добавить отправку SMS
