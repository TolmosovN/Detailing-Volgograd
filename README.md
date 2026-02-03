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

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Подробная инструкция по установке и запуску
- **[client/README.md](./client/README.md)** - Документация фронтенда
- **[server/README.md](./server/README.md)** - Документация бэкенда

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

### Будущие интеграции
- Платежи: Stripe / ЮKassa / CloudPayments
- Карты: Google Maps / Яндекс.Карты
- Уведомления: Email (SMTP) / SMS

## 📊 API Endpoints

### Services
- `GET /api/services` - Список услуг
- `GET /api/services/:id` - Услуга по ID

### Bookings
- `POST /api/bookings` - Создать запись
- `GET /api/bookings` - Список записей

### Health
- `GET /api/health` - Статус сервера

## 🎯 Этапы разработки

- ✅ **Этап 1**: Инициализация проекта, настройка структуры
- ✅ **Этап 2**: Разработка UI компонентов (Header, Footer, Cards)
- ✅ **Этап 3**: Главная страница с витриной услуг
- ✅ **Этап 4**: Страница записи с формой и валидацией
- ✅ **Этап 5**: Подключение реального API (Express + Prisma + MySQL)
- 🔄 **Этап 6**: Авторизация и личный кабинет
- 🔄 **Этап 7**: Админ-панель для управления записями
- 🔄 **Этап 8**: Интеграция платежных систем
- 🔄 **Этап 9**: Карта и контактная информация
- 🔄 **Этап 10**: Оптимизация и деплой

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
curl http://localhost:3001/api/health

# Получить услуги
curl http://localhost:3001/api/services
```

## 📝 Дополнительные правила проекта

См. файл [.cursorrules](./.cursorrules) для полного списка правил разработки.