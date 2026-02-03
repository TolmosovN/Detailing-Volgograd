# 🐳 Руководство по запуску проекта с Docker

Это пошаговая инструкция для запуска базы данных MySQL в Docker Desktop.

---

## ✅ ШАГ 1: Проверка готовности (УЖЕ СДЕЛАНО)

Я уже создал для вас:
- ✅ `docker-compose.yml` - конфигурация для MySQL
- ✅ Обновил `.env` - настроил подключение к БД

---

## 📋 ШАГ 2: Запустить MySQL в Docker

### Откройте терминал в корне проекта и выполните:

```bash
docker-compose up -d
```

### Что произойдёт:
1. Docker скачает образ MySQL 8.0 (первый раз, займёт 1-2 минуты)
2. Создаст контейнер с именем `detailing_mysql`
3. Запустит MySQL на порту 3306
4. Автоматически создаст базу данных `detailing_volgograd`

### Вы увидите:
```
[+] Running 2/2
 ✔ Network detailing-volgograd_default      Created
 ✔ Container detailing_mysql                Started
```

---

## 🔍 ШАГ 3: Проверить, что MySQL запущен

### Вариант 1: Через Docker Desktop
1. Откройте Docker Desktop
2. Перейдите во вкладку **Containers**
3. Вы должны увидеть контейнер `detailing_mysql` с **зелёным** статусом

### Вариант 2: Через терминал
```bash
docker ps
```

Вы должны увидеть:
```
CONTAINER ID   IMAGE       COMMAND                  STATUS         PORTS                    NAMES
xxxxx          mysql:8.0   "docker-entrypoint.s…"   Up 10 seconds  0.0.0.0:3306->3306/tcp   detailing_mysql
```

---

## 🗄️ ШАГ 4: Инициализация Prisma

Теперь нужно создать таблицы в базе данных.

### Перейдите в папку server:
```bash
cd server
```

### Выполните команды по порядку:

#### 4.1 Генерация Prisma Client
```bash
npm run prisma:generate
```

**Что это делает:** Создаёт TypeScript код для работы с БД на основе `schema.prisma`

Вы увидите:
```
✔ Generated Prisma Client
```

#### 4.2 Создание таблиц
```bash
npm run prisma:migrate
```

**Что это делает:** Создаёт таблицы в MySQL (users, services, bookings, payments)

Введите имя миграции (например: `init`) и нажмите Enter.

Вы увидите:
```
✔ Your database is now in sync with your Prisma schema.
```

#### 4.3 Заполнение тестовыми данными
```bash
npm run seed
```

**Что это делает:** Добавляет 3 услуги и тестового пользователя

Вы увидите:
```
🧹 База данных очищена
✅ Создано 3 услуг
✅ Создан тестовый пользователь: test@example.com
🎉 Seed выполнен успешно!
```

---

## 🚀 ШАГ 5: Запуск приложения

### Терминал 1 - Backend
```bash
cd server
npm run dev
```

Вы увидите:
```
🚀 Сервер запущен на http://localhost:3001
🌍 Окружение: development
✅ CORS разрешен для: http://localhost:3000
```

### Терминал 2 - Frontend
```bash
cd client
npm run dev
```

Откройте браузер: **http://localhost:3000**

---

## ✅ ШАГ 6: Проверка работы

### 1. Проверьте API через браузер или терминал:

**Health check:**
```bash
curl http://localhost:3001/api/health
```

**Список услуг:**
```bash
curl http://localhost:3001/api/services
```

### 2. Проверьте форму записи:
1. Откройте http://localhost:3000
2. Перейдите в раздел "Записаться"
3. Заполните форму
4. Нажмите "Записаться"
5. Должно появиться: "Запись успешно создана!"

### 3. Просмотрите данные в Prisma Studio:
```bash
cd server
npm run prisma:studio
```

Откроется GUI на http://localhost:5555, где вы увидите все данные в БД.

---

## 💡 Полезные команды Docker

```bash
# Запустить MySQL
docker-compose up -d

# Остановить MySQL (БД сохранится!)
docker-compose down

# Остановить и удалить БД (ОСТОРОЖНО!)
docker-compose down -v

# Посмотреть логи MySQL
docker-compose logs mysql

# Перезапустить MySQL
docker-compose restart

# Войти в контейнер MySQL (для продвинутых)
docker exec -it detailing_mysql mysql -u root -ppassword123
```

---

## 🐛 Решение проблем

### Ошибка: "port 3306 is already allocated"
**Причина:** У вас уже запущен MySQL на порту 3306

**Решение:**
```bash
# Остановите другой MySQL
sudo service mysql stop  # Linux/WSL
# или найдите процесс в диспетчере задач (Windows)
```

### Ошибка: "Can't connect to MySQL server"
**Причина:** MySQL ещё не запустился полностью

**Решение:** Подождите 10-20 секунд и попробуйте снова

### Нужно начать с чистой БД
```bash
# Остановить и удалить данные
docker-compose down -v

# Запустить заново
docker-compose up -d

# Повторить шаг 4 (prisma:migrate и seed)
```

---

## 🎉 Готово!

Теперь у вас:
- ✅ MySQL работает в Docker
- ✅ Prisma подключена к БД
- ✅ Таблицы созданы
- ✅ Тестовые данные загружены
- ✅ Backend и Frontend запущены

**Следующий шаг:** Протестируйте создание записи через форму на сайте!
