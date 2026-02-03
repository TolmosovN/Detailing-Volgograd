# 📋 Руководство по установке и запуску проекта

Пошаговая инструкция для запуска проекта **Detailing Volgograd** (фронтенд + бэкенд).

---

## 📦 Предварительные требования

Перед началом убедитесь, что у вас установлены:

- **Node.js** 18+ ([скачать](https://nodejs.org/))
- **npm** 9+ (устанавливается с Node.js)
- **MySQL** 8+ ([скачать](https://dev.mysql.com/downloads/mysql/))

---

## 🗄️ Шаг 1: Настройка MySQL

1. Запустите MySQL сервер
2. Создайте базу данных:
```sql
CREATE DATABASE detailing_volgograd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Запомните ваши учетные данные:
   - Пользователь (обычно `root`)
   - Пароль
   - Хост (обычно `localhost`)
   - Порт (обычно `3306`)

---

## 🔧 Шаг 2: Настройка переменных окружения

1. Скопируйте `.env.example` в `.env`:
```bash
cp .env.example .env
```

2. Откройте `.env` и обновите строку подключения к БД:
```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/detailing_volgograd"
```
Замените `YOUR_PASSWORD` на ваш пароль MySQL.

3. Создайте `.env.local` в папке `client/`:
```bash
cd client
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
cd ..
```

---

## 🚀 Шаг 3: Установка зависимостей

### Backend:
```bash
cd server
npm install
```

### Frontend:
```bash
cd ../client
npm install
cd ..
```

---

## 🗃️ Шаг 4: Инициализация базы данных

```bash
cd server

# Генерируем Prisma Client
npm run prisma:generate

# Создаём таблицы в БД
npm run prisma:migrate

# Заполняем БД тестовыми данными
npm run seed
```

Вы должны увидеть:
```
🧹 База данных очищена
✅ Создано 3 услуг
✅ Создан тестовый пользователь: test@example.com
🎉 Seed выполнен успешно!
```

---

## ▶️ Шаг 5: Запуск приложения

### В одном терминале запустите Backend:
```bash
cd server
npm run dev
```

Вы должны увидеть:
```
🚀 Сервер запущен на http://localhost:3001
🌍 Окружение: development
✅ CORS разрешен для: http://localhost:3000
```

### В другом терминале запустите Frontend:
```bash
cd client
npm run dev
```

Откройте браузер: [http://localhost:3000](http://localhost:3000)

---

## ✅ Шаг 6: Проверка работоспособности

### 1. Проверьте health-check бэкенда:
```bash
curl http://localhost:3001/api/health
```

Должен вернуть:
```json
{
  "status": "ok",
  "timestamp": "2026-02-03T...",
  "environment": "development"
}
```

### 2. Проверьте получение услуг:
```bash
curl http://localhost:3001/api/services
```

Должен вернуть массив из 3 услуг.

### 3. Откройте фронтенд:
- Перейдите на [http://localhost:3000](http://localhost:3000)
- Кликните "Записаться"
- Заполните форму и отправьте
- Запись должна успешно создаться в БД

---

## 🔍 Просмотр базы данных

Prisma Studio - это GUI для просмотра и редактирования данных:

```bash
cd server
npm run prisma:studio
```

Откроется [http://localhost:5555](http://localhost:5555)

---

## 🐛 Решение проблем

### Ошибка подключения к MySQL:
```
Error: Can't reach database server at `localhost:3306`
```
**Решение:** Убедитесь, что MySQL запущен и учетные данные в `.env` корректны.

### Ошибка "P1001: Can't reach database server":
```bash
# Проверьте статус MySQL
# macOS/Linux:
sudo systemctl status mysql
# Windows:
net start MySQL

# Попробуйте подключиться вручную:
mysql -u root -p
```

### Порт 3001 или 3000 занят:
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Решение:** 
- Измените порт в `.env` (PORT=3002)
- Или завершите процесс, занимающий порт

### Ошибка CORS на фронтенде:
```
Access to fetch at 'http://localhost:3001' has been blocked by CORS policy
```
**Решение:** Убедитесь, что в `.env` указан `CORS_ORIGIN=http://localhost:3000`

---

## 📚 Полезные команды

### Backend:
```bash
# Разработка
npm run dev

# Production сборка
npm run build
npm start

# Просмотр БД
npm run prisma:studio

# Создать новую миграцию
npm run prisma:migrate

# Пересоздать БД
npx prisma migrate reset
```

### Frontend:
```bash
# Разработка
npm run dev

# Production сборка
npm run build
npm start

# Линтинг
npm run lint
```

---

## 🎉 Готово!

Теперь у вас работает полноценное приложение:
- ✅ Фронтенд на Next.js
- ✅ Бэкенд на Express
- ✅ База данных MySQL
- ✅ API для услуг и записей

Следующие шаги:
1. Изучите код в `client/src/` и `server/src/`
2. Попробуйте создать несколько записей через форму
3. Посмотрите данные в Prisma Studio
4. Начните добавлять новые функции!
