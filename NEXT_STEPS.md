# 🎯 Следующие шаги для запуска проекта

## ✅ Что уже сделано:

1. ✅ Создана структура бэкенда с Express.js
2. ✅ Настроен Prisma ORM с MySQL
3. ✅ Созданы контроллеры для услуг и записей
4. ✅ Обновлены API клиенты на фронтенде
5. ✅ Установлены зависимости для backend
6. ✅ Создана документация (README.md, SETUP_GUIDE.md)

---

## 🔴 ЧТО НУЖНО СДЕЛАТЬ СЕЙЧАС:

### Шаг 1: Настройка MySQL

**ВАЖНО:** Перед продолжением убедитесь, что у вас установлен и запущен MySQL!

#### Установка MySQL (если не установлен):

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

**Windows (WSL):**
```bash
# Установка
sudo apt update
sudo apt install mysql-server

# Запуск (может потребоваться sudo)
sudo service mysql start

# Проверка статуса
sudo service mysql status
```

**macOS:**
```bash
brew install mysql
brew services start mysql
```

#### Создание базы данных:

1. Войдите в MySQL:
```bash
sudo mysql -u root -p
```

2. Создайте базу данных:
```sql
CREATE DATABASE detailing_volgograd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. (Опционально) Создайте отдельного пользователя:
```sql
CREATE USER 'detailing_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON detailing_volgograd.* TO 'detailing_user'@'localhost';
FLUSH PRIVILEGES;
exit;
```

---

### Шаг 2: Обновите .env файл

Откройте файл `.env` в корне проекта и обновите строку `DATABASE_URL`:

**Если используете root:**
```env
DATABASE_URL="mysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/detailing_volgograd"
```

**Если создали отдельного пользователя:**
```env
DATABASE_URL="mysql://detailing_user:your_secure_password@localhost:3306/detailing_volgograd"
```

---

### Шаг 3: Инициализация Prisma

Выполните следующие команды:

```bash
cd server

# 1. Генерируем Prisma Client
npm run prisma:generate

# 2. Создаём таблицы в базе данных
npm run prisma:migrate

# 3. Заполняем БД тестовыми данными
npm run seed
```

Вы должны увидеть:
```
✅ Создано 3 услуг
✅ Создан тестовый пользователь: test@example.com
🎉 Seed выполнен успешно!
```

---

### Шаг 4: Запуск серверов

**Терминал 1 - Backend:**
```bash
cd server
npm run dev
```

Должно появиться:
```
🚀 Сервер запущен на http://localhost:3001
🌍 Окружение: development
✅ CORS разрешен для: http://localhost:3000
```

**Терминал 2 - Frontend:**
```bash
cd client
npm run dev
```

---

### Шаг 5: Проверка работы

1. **Откройте в браузере:** [http://localhost:3000](http://localhost:3000)

2. **Проверьте API:**
```bash
# Health check
curl http://localhost:3001/api/health

# Получить список услуг
curl http://localhost:3001/api/services
```

3. **Протестируйте запись:**
   - Перейдите на страницу "Записаться"
   - Заполните форму
   - Нажмите "Записаться"
   - Запись должна успешно создаться!

4. **Просмотрите данные в Prisma Studio:**
```bash
cd server
npm run prisma:studio
```
Откроется GUI на [http://localhost:5555](http://localhost:5555)

---

## 🐛 Возможные проблемы

### "Can't reach database server"
**Причина:** MySQL не запущен или неверные учетные данные.

**Решение:**
```bash
# Проверьте статус MySQL
sudo service mysql status

# Запустите MySQL
sudo service mysql start

# Проверьте подключение
mysql -u root -p
```

### "Port 3001 already in use"
**Решение:** Измените порт в `.env`:
```env
PORT=3002
```

### "P3009: Migrate found failed migrations"
**Решение:** Сбросьте миграции:
```bash
cd server
npx prisma migrate reset
```

---

## 📊 Что дальше?

После успешного запуска можно приступать к:
- ✅ Тестированию создания записей
- 📱 Добавлению новых услуг через Prisma Studio
- 👤 Разработке системы авторизации (Этап 6)
- 🔐 Созданию админ-панели (Этап 7)
- 💳 Интеграции платежных систем (Этап 8)

---

## 💡 Нужна помощь?

Если возникли проблемы:
1. Проверьте логи в консоли
2. Убедитесь, что MySQL запущен
3. Проверьте правильность `DATABASE_URL` в `.env`
4. Изучите [SETUP_GUIDE.md](./SETUP_GUIDE.md) для детальных инструкций
