# 🚀 Руководство по деплою

Этот документ описывает процесс развертывания приложения в продакшене.

---

## 📋 Предварительные требования

### Необходимые инструменты:
- ✅ Node.js 18+ 
- ✅ npm или yarn
- ✅ MySQL 8+
- ✅ Git
- ✅ PM2 (для управления процессами)
- ✅ Nginx (reverse proxy)

---

## 🎯 Варианты деплоя

### Вариант 1: VPS/Dedicated Server (рекомендуется)
- Полный контроль
- Дешевле для постоянной нагрузки
- Провайдеры: DigitalOcean, Hetzner, Timeweb, REG.RU

### Вариант 2: PaaS (Platform as a Service)
- Проще настройка
- Автомасштабирование
- Провайдеры:
  - **Vercel** (Frontend - Next.js)
  - **Railway** / **Render** (Backend + DB)
  - **PlanetScale** (Database)

---

## 🔧 Вариант 1: Деплой на VPS

### Шаг 1: Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Установка MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Установка Nginx
sudo apt install -y nginx

# Установка PM2
sudo npm install -g pm2
```

### Шаг 2: Настройка MySQL

```bash
# Войти в MySQL
sudo mysql

# Создать базу данных и пользователя
```

```sql
CREATE DATABASE detailing_volgograd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'detailing_user'@'localhost' IDENTIFIED BY 'сильный_пароль';
GRANT ALL PRIVILEGES ON detailing_volgograd.* TO 'detailing_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Шаг 3: Клонирование проекта

```bash
# Создать директорию для приложения
cd /var/www
sudo mkdir detailing-volgograd
sudo chown $USER:$USER detailing-volgograd
cd detailing-volgograd

# Клонировать репозиторий
git clone https://github.com/your-username/detailing-volgograd.git .

# Или загрузить файлы через SFTP/SCP
```

### Шаг 4: Настройка Backend

```bash
cd server

# Установить зависимости
npm ci --production

# Создать .env файл
cp .env.example .env
nano .env
```

**Настройка server/.env:**
```env
NODE_ENV=production
PORT=5000

DATABASE_URL=mysql://detailing_user:сильный_пароль@localhost:3306/detailing_volgograd

JWT_SECRET=<сгенерированный_секретный_ключ_64_символа>
JWT_EXPIRES_IN=7d

CORS_ORIGIN=https://yourdomain.com

# Email
EMAIL_ENABLED=true
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Detailing Volgograd <noreply@yourdomain.com>

FRONTEND_URL=https://yourdomain.com

# Payment (если подключаете Yookassa)
PAYMENT_MODE=production
YUKASSA_SHOP_ID=your-shop-id
YUKASSA_SECRET_KEY=your-secret-key
YUKASSA_RETURN_URL=https://yourdomain.com/payment/success
```

**Генерация JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

```bash
# Применить миграции БД
npx prisma migrate deploy

# Создать seed данные
npx prisma db seed

# Сборка TypeScript
npm run build

# Запуск с PM2
pm2 start dist/index.js --name detailing-api
pm2 save
pm2 startup
```

### Шаг 5: Настройка Frontend

```bash
cd ../client

# Установить зависимости
npm ci --production

# Создать .env файл
cp .env.example .env.local
nano .env.local
```

**Настройка client/.env.local:**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

```bash
# Сборка production build
npm run build

# Запуск с PM2
pm2 start npm --name detailing-web -- start
pm2 save
```

### Шаг 6: Настройка Nginx

```bash
sudo nano /etc/nginx/sites-available/detailing-volgograd
```

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Активировать конфигурацию
sudo ln -s /etc/nginx/sites-available/detailing-volgograd /etc/nginx/sites-enabled/

# Проверить конфигурацию
sudo nginx -t

# Перезапустить Nginx
sudo systemctl restart nginx
```

### Шаг 7: SSL сертификат (HTTPS)

```bash
# Установить Certbot
sudo apt install -y certbot python3-certbot-nginx

# Получить SSL сертификат
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Автообновление сертификата
sudo certbot renew --dry-run
```

---

## 🌐 Вариант 2: Деплой на PaaS

### Frontend на Vercel

1. **Зарегистрируйтесь на Vercel**
   - https://vercel.com

2. **Подключите GitHub репозиторий**
   ```
   Project Settings:
   - Root Directory: client
   - Framework Preset: Next.js
   - Build Command: npm run build
   - Output Directory: .next
   ```

3. **Настройте переменные окружения**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
   ```

4. **Deploy**
   - Vercel автоматически соберет и задеплоит

### Backend на Railway/Render

1. **Зарегистрируйтесь**
   - Railway: https://railway.app
   - Render: https://render.com

2. **Создайте MySQL базу данных**
   - Получите DATABASE_URL

3. **Создайте Web Service**
   ```
   Build Settings:
   - Root Directory: server
   - Build Command: npm ci && npm run build
   - Start Command: npm start
   ```

4. **Настройте Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<из Railway/Render DB>
   JWT_SECRET=<сгенерированный>
   CORS_ORIGIN=https://your-site.vercel.app
   # ... остальные переменные
   ```

5. **Deploy**
   - Платформа автоматически задеплоит

---

## ✅ Чеклист перед деплоем

### Backend:
- [ ] `.env` настроен с production значениями
- [ ] `JWT_SECRET` сгенерирован и установлен
- [ ] `DATABASE_URL` указывает на продакшен БД
- [ ] `CORS_ORIGIN` установлен на фронтенд домен
- [ ] Миграции БД применены (`prisma migrate deploy`)
- [ ] Seed данные созданы (админ пользователь)
- [ ] Email настроен (если используется)
- [ ] Платежи настроены (если используется Yookassa)
- [ ] TypeScript скомпилирован (`npm run build`)

### Frontend:
- [ ] `.env.local` настроен
- [ ] `NEXT_PUBLIC_API_URL` указывает на бэкенд
- [ ] `NEXT_PUBLIC_SITE_URL` установлен
- [ ] Production build создан (`npm run build`)

### Безопасность:
- [ ] Все `.env` файлы в `.gitignore`
- [ ] SSL сертификат установлен (HTTPS)
- [ ] Firewall настроен
- [ ] Только необходимые порты открыты
- [ ] Секретные ключи не в коде

### Мониторинг:
- [ ] PM2 процессы запущены
- [ ] PM2 автозапуск настроен (`pm2 startup`)
- [ ] Логи настроены и доступны
- [ ] Health check endpoints работают

---

## 🔄 Обновление приложения

```bash
cd /var/www/detailing-volgograd

# Backend
cd server
git pull
npm ci --production
npm run build
npx prisma migrate deploy
pm2 restart detailing-api

# Frontend
cd ../client
git pull
npm ci --production
npm run build
pm2 restart detailing-web

# Проверить статус
pm2 status
```

---

## 📊 Мониторинг

### Просмотр логов

```bash
# PM2 логи
pm2 logs detailing-api
pm2 logs detailing-web

# Логи приложения
tail -f server/logs/combined.log
tail -f server/logs/error.log

# Nginx логи
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Мониторинг процессов

```bash
pm2 monit
pm2 status
```

### Health check

```bash
curl https://api.yourdomain.com/api/health
```

---

## 🚨 Troubleshooting

### Backend не запускается

```bash
# Проверить логи
pm2 logs detailing-api --lines 100

# Проверить порт
sudo netstat -tulpn | grep 5000

# Проверить подключение к БД
cd server && npx prisma db pull
```

### Frontend не загружается

```bash
# Проверить логи
pm2 logs detailing-web --lines 100

# Проверить порт
sudo netstat -tulpn | grep 3000

# Перезапустить
pm2 restart detailing-web
```

### 502 Bad Gateway (Nginx)

```bash
# Проверить что процессы запущены
pm2 status

# Проверить Nginx конфиг
sudo nginx -t

# Проверить логи
sudo tail -f /var/log/nginx/error.log
```

### Не работают платежи

```bash
# Проверить переменные окружения
cd server && cat .env | grep YUKASSA

# Проверить логи
tail -f logs/combined.log | grep payment
```

---

## 📚 Полезные команды

```bash
# PM2
pm2 list                 # Список процессов
pm2 restart all          # Перезапуск всех
pm2 stop all             # Остановка всех
pm2 delete all           # Удаление всех
pm2 logs --lines 100     # Последние 100 строк логов

# MySQL
sudo mysql               # Войти в MySQL
SHOW DATABASES;          # Список БД
USE database_name;       # Выбрать БД
SHOW TABLES;             # Список таблиц

# Nginx
sudo systemctl status nginx    # Статус
sudo systemctl restart nginx   # Перезапуск
sudo nginx -t                  # Проверка конфига
```

---

## 🎯 Что дальше?

После успешного деплоя:

1. **Тестирование**
   - Проверьте все функции
   - Протестируйте на разных устройствах
   - Проверьте производительность

2. **Мониторинг**
   - Настройте уведомления об ошибках
   - Отслеживайте метрики
   - Анализируйте логи

3. **Бэкапы**
   - Настройте автоматические бэкапы БД
   - Регулярно сохраняйте код

4. **Обновления**
   - Регулярно обновляйте зависимости
   - Следите за security updates

---

## 🎉 Готово!

Ваше приложение теперь в продакшене! 🚀

**Полезные ссылки:**
- Frontend: https://yourdomain.com
- Backend API: https://api.yourdomain.com
- Health Check: https://api.yourdomain.com/api/health
- Админ-панель: https://yourdomain.com/admin
