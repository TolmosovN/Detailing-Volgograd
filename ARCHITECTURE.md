# 🏛️ Архитектура проекта Detailing Volgograd

## 📐 Общая схема

```
┌─────────────────────────────────────────────────────────────┐
│                        ПОЛЬЗОВАТЕЛЬ                          │
│                    (Браузер / Мобильный)                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/HTTPS
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                     FRONTEND (Next.js)                       │
│                   http://localhost:3000                      │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Features   │  │   Widgets    │  │    Shared    │      │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤      │
│  │ - booking    │  │ - Header     │  │ - ui         │      │
│  │ - services   │  │ - Footer     │  │ - api        │      │
│  │              │  │              │  │ - lib        │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ REST API (JSON)
                        │ http://localhost:3001/api
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                   BACKEND (Express.js)                       │
│                   http://localhost:3001                      │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Middleware                         │   │
│  │  CORS │ JSON Parser │ Error Handler │ Validator      │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │                      Routes                           │   │
│  │  /api/services  │  /api/bookings  │  /api/health    │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │                   Controllers                         │   │
│  │  servicesController │ bookingsController             │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │                  Prisma Client                        │   │
│  │            (ORM для работы с БД)                      │   │
│  └──────────────────────┬───────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ SQL
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   MySQL Database                             │
│               detailing_volgograd                            │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   users    │  │  services  │  │  bookings  │            │
│  ├────────────┤  ├────────────┤  ├────────────┤            │
│  │ id         │  │ id         │  │ id         │            │
│  │ email      │  │ name       │  │ userId  ───┼──┐         │
│  │ phone      │  │ description│  │ serviceId──┼─┐│         │
│  │ name       │  │ priceFrom  │  │ date       │ ││         │
│  │ password   │  │ duration   │  │ time       │ ││         │
│  │ role       │  │ isActive   │  │ status     │ ││         │
│  └────────────┘  └────────────┘  └────────────┘ ││         │
│         ▲                 ▲              │       ││         │
│         └─────────────────┴──────────────┘       ││         │
│                                                   ││         │
│  ┌────────────────────────────────────────────┐  ││         │
│  │              payments                      │◄─┘│         │
│  ├────────────────────────────────────────────┤   │         │
│  │ id                                         │   │         │
│  │ bookingId ─────────────────────────────────┼───┘         │
│  │ amount                                     │             │
│  │ status                                     │             │
│  │ provider                                   │             │
│  └────────────────────────────────────────────┘             │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 Поток данных

### 1️⃣ Получение списка услуг

```
Пользователь
    │
    │ 1. Открывает главную страницу
    ▼
Next.js (client/app/page.tsx)
    │
    │ 2. useEffect вызывает servicesApi.getServices()
    ▼
API Client (shared/api/servicesApi.ts)
    │
    │ 3. GET /api/services
    ▼
Express Router (server/src/routes/services.ts)
    │
    │ 4. Вызывает getServices()
    ▼
Services Controller (server/src/controllers/servicesController.ts)
    │
    │ 5. prisma.service.findMany()
    ▼
Prisma Client
    │
    │ 6. SELECT * FROM services WHERE isActive = 1
    ▼
MySQL Database
    │
    │ 7. Возвращает данные
    ▼
Пользователь видит список услуг
```

### 2️⃣ Создание записи

```
Пользователь
    │
    │ 1. Заполняет форму и нажимает "Записаться"
    ▼
BookingForm (features/booking/components/BookingForm.tsx)
    │
    │ 2. Валидация на фронте (validateForm)
    ▼
bookingApi.createBooking(payload)
    │
    │ 3. POST /api/bookings
    │    Body: { serviceId, date, time, name, phone, email }
    ▼
Express Validator Middleware
    │
    │ 4. Валидация данных (phone, email, date, time)
    ▼
Bookings Controller (server/src/controllers/bookingsController.ts)
    │
    │ 5. Проверка существования услуги
    │ 6. Проверка дубликатов на это время
    │ 7. prisma.booking.create()
    ▼
Prisma Client
    │
    │ 8. INSERT INTO bookings (...)
    ▼
MySQL Database
    │
    │ 9. Возвращает созданную запись
    ▼
Пользователь видит сообщение "Запись успешно создана!"
```

---

## 📂 Структура Frontend (Feature-Sliced Design)

```
client/src/
│
├── features/              # Фичи (бизнес-логика)
│   ├── booking/
│   │   └── components/
│   │       └── BookingForm.tsx    # Форма записи
│   └── services/
│       ├── components/
│       │   └── ServicesList.tsx   # Список услуг
│       ├── data.ts                # Моковые данные (deprecated)
│       └── types.ts               # TypeScript типы
│
├── widgets/               # Крупные композитные компоненты
│   ├── header/
│   │   └── Header.tsx            # Шапка сайта
│   └── footer/
│       └── Footer.tsx            # Подвал сайта
│
└── shared/                # Переиспользуемый код
    ├── api/               # API клиенты
    │   ├── apiClient.ts          # Базовый HTTP клиент
    │   ├── servicesApi.ts        # API для услуг
    │   └── bookingApi.ts         # API для записей
    │
    ├── ui/                # UI компоненты
    │   ├── Button.tsx
    │   ├── Card.tsx
    │   ├── Container.tsx
    │   └── Input.tsx
    │
    ├── lib/               # Утилиты
    │   └── index.ts              # formatPrice, isValidPhone, etc.
    │
    └── config/            # Конфигурация
        └── index.ts              # API_URL, константы
```

---

## 📂 Структура Backend (MVC pattern)

```
server/src/
│
├── config/                # Конфигурация
│   └── index.ts                  # PORT, CORS_ORIGIN, NODE_ENV
│
├── controllers/           # Контроллеры (бизнес-логика)
│   ├── servicesController.ts     # Логика для услуг
│   └── bookingsController.ts     # Логика для записей
│
├── routes/                # Маршруты
│   ├── services.ts               # GET /api/services
│   └── bookings.ts               # POST /api/bookings
│
├── middleware/            # Middleware
│   └── errorHandler.ts           # Обработка ошибок
│
└── index.ts               # Точка входа (Express app)
```

---

## 🔐 Модели данных (Prisma Schema)

### User (Пользователь)
```typescript
{
  id: number
  email: string
  phone: string
  name: string
  password: string       // хешированный
  role: "CLIENT" | "ADMIN"
  bookings: Booking[]
}
```

### Service (Услуга)
```typescript
{
  id: number
  name: string           // "Экспресс-мойка"
  description: string
  priceFrom: number      // в рублях
  duration: number       // в минутах
  isActive: boolean
}
```

### Booking (Запись)
```typescript
{
  id: number
  userId: number         // FK -> User
  serviceId: number      // FK -> Service
  date: Date
  time: string           // "10:00"
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
  name: string           // для записи без регистрации
  phone: string
  email: string
}
```

### Payment (Платёж)
```typescript
{
  id: number
  bookingId: number      // FK -> Booking
  amount: number         // в рублях
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
  provider: string       // "stripe", "yukassa"
  externalId: string     // ID транзакции
}
```

---

## 🔌 API Endpoints

### Services
| Метод | Путь | Описание | Ответ |
|-------|------|----------|-------|
| GET | `/api/services` | Список всех активных услуг | `Service[]` |
| GET | `/api/services/:id` | Услуга по ID | `Service` |

### Bookings
| Метод | Путь | Описание | Тело | Ответ |
|-------|------|----------|------|-------|
| POST | `/api/bookings` | Создать запись | `CreateBookingPayload` | `BookingResponse` |
| GET | `/api/bookings` | Список всех записей | - | `Booking[]` |

### Health
| Метод | Путь | Описание | Ответ |
|-------|------|----------|-------|
| GET | `/api/health` | Статус сервера | `{ status: "ok" }` |

---

## 🛡️ Безопасность

### Реализовано:
- ✅ CORS (только с http://localhost:3000)
- ✅ Валидация данных (express-validator)
- ✅ SQL-инъекции защищены (Prisma ORM)
- ✅ XSS защита (React escaping)
- ✅ Проверка дубликатов записей

### TODO (в будущем):
- ⏳ JWT аутентификация
- ⏳ Rate limiting
- ⏳ Хеширование паролей (bcrypt)
- ⏳ HTTPS в production
- ⏳ Helmet.js для безопасности заголовков

---

## 🚀 Технологии

### Frontend
- **Next.js 14** - React framework (App Router)
- **TypeScript** - Типизация
- **Tailwind CSS** - Утилитарные стили
- **React Hooks** - Управление состоянием

### Backend
- **Express.js 4** - Web framework
- **Prisma 5** - ORM
- **TypeScript** - Типизация
- **express-validator 7** - Валидация

### Database
- **MySQL 8** - Реляционная БД

### DevOps (будущее)
- **Docker** - Контейнеризация
- **Nginx** - Reverse proxy
- **PM2** - Process manager

---

## 📈 Масштабируемость

### Текущее состояние:
- Монолитная архитектура (frontend + backend на одной машине)
- Подходит для небольших проектов (<10k пользователей)

### Будущие улучшения:
1. **Кеширование** - Redis для сессий и популярных запросов
2. **CDN** - Для статики Next.js
3. **Load Balancer** - Несколько инстансов backend
4. **Database реплики** - Master-Slave для чтения
5. **Микросервисы** - Разделение на отдельные сервисы (auth, bookings, payments)

---

## 🎯 Следующие шаги развития

### Этап 6: Авторизация
```
JWT → Login/Register → Protected routes → User profile
```

### Этап 7: Админ-панель
```
Admin dashboard → Управление записями → Статистика → Отчёты
```

### Этап 8: Платежи
```
Stripe/ЮKassa → Webhooks → Payment confirmation → Email уведомления
```

---

**Эта архитектура обеспечивает:**
- ✅ Чистое разделение ответственности
- ✅ Легкость тестирования
- ✅ Простоту масштабирования
- ✅ Понятную структуру для новых разработчиков
