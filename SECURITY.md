# 🔒 Безопасность приложения

Этот документ описывает меры безопасности, реализованные в проекте.

---

## ✅ Реализованные меры безопасности

### 🛡️ HTTP заголовки (Helmet)

**Файл**: `server/src/middleware/security.ts`

Helmet автоматически устанавливает безопасные HTTP заголовки:
- `X-DNS-Prefetch-Control`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`
- `Strict-Transport-Security`
- `Content-Security-Policy`

### ⚡ Rate Limiting

**Файлы**: `server/src/middleware/security.ts`, `server/src/index.ts`

**Реализовано:**
- **Общий лимит**: 100 запросов за 15 минут на IP
- **Авторизация**: 5 попыток за 15 минут
- **Создание записей**: 10 записей за 1 час

Защита от:
- DDoS атак
- Brute force атак на логин
- Спама записей

### 🔑 Хеширование паролей

**Файл**: `server/src/controllers/authController.ts`

Используется `bcrypt` с salt rounds = 10 для безопасного хранения паролей.

### 🎫 JWT токены

**Файл**: `server/src/utils/jwt.ts`

- Токены подписываются секретным ключом
- Срок жизни: 7 дней (настраивается в .env)
- Токен хранится в localStorage (клиент)

### ✅ Валидация данных

**Файлы**: контроллеры (`*Controller.ts`)

Используется `express-validator` для проверки всех входных данных:
- Email формат
- Обязательные поля
- Типы данных
- Длина строк

### 🌐 CORS

**Файл**: `server/src/index.ts`

CORS настроен только для фронтенд домена:
```typescript
cors({
  origin: config.corsOrigin, // Только доверенный домен
  credentials: true,
})
```

### 🔐 Переменные окружения

**Файлы**: `.env` (игнорируется git)

Все секретные данные хранятся в переменных окружения:
- `DATABASE_URL`
- `JWT_SECRET`
- `EMAIL_PASSWORD`
- `YUKASSA_SECRET_KEY`

**❗ НИКОГДА не коммитьте .env файлы!**

### 🚫 XSS Protection

React автоматически экранирует вывод, но дополнительно:
- CSP заголовки через Helmet
- Валидация на бэкенде
- Никогда не используем `dangerouslySetInnerHTML`

### 🔒 SQL Injection Protection

Prisma ORM автоматически защищает от SQL injection через:
- Параметризованные запросы
- Типизация TypeScript

---

## ⚠️ Что нужно сделать перед деплоем

### 1. Сменить секреты

```env
# В .env файлах:
JWT_SECRET=<сгенерируйте длинный случайный ключ>
DATABASE_URL=<продакшен БД>
EMAIL_PASSWORD=<реальный пароль>
```

**Генерация JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Настроить CORS

```env
# server/.env
CORS_ORIGIN=https://yourdomain.com
```

### 3. Включить HTTPS

В продакшене ОБЯЗАТЕЛЬНО используйте HTTPS:
- Через Nginx reverse proxy
- Через CDN (Cloudflare)
- Через хостинг провайдера

### 4. Настроить Helmet CSP

Если используете внешние скрипты/стили, обновите CSP в `security.ts`:

```typescript
contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://trusted-domain.com"],
    // ...
  },
}
```

### 5. Проверить .gitignore

Убедитесь что игнорируются:
```
.env
.env.*
logs/
*.log
```

---

## 🔍 Регулярные проверки

### Аудит зависимостей

```bash
cd server && npm audit
cd client && npm audit
```

**Исправление уязвимостей:**
```bash
npm audit fix
```

### Обновление пакетов

```bash
npm outdated
npm update
```

---

## 🚨 Что делать при инциденте

### 1. Немедленно:
- Смените все секретные ключи
- Инвалидируйте все JWT токены
- Проверьте логи на подозрительную активность

### 2. Анализ:
```bash
# Проверить логи
tail -n 1000 server/logs/error.log
tail -n 1000 server/logs/combined.log
```

### 3. Уведомления:
- Уведомите пользователей если утекли данные
- Измените пароли БД
- Обновите SSL сертификаты

---

## 📚 Дополнительные ресурсы

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js Docs](https://helmetjs.github.io/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)

---

## ✅ Чеклист безопасности

- [x] Helmet middleware установлен
- [x] Rate limiting настроен
- [x] Пароли хешируются
- [x] JWT токены защищены
- [x] Валидация входных данных
- [x] CORS настроен
- [x] Секреты в .env
- [x] XSS защита
- [x] SQL injection защита
- [ ] HTTPS настроен (перед деплоем)
- [ ] Секреты сменены (перед деплоем)
- [ ] CSP настроен под проект
- [ ] Регулярный аудит зависимостей
