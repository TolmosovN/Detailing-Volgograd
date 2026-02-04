# 💳 Настройка платежей - от Тестирования до Продакшена

## 📋 Текущий режим: MOCK (для разработки)

### Как работает Mock режим:

1. **Вы нажимаете "Оплатить картой"**
2. **Подождите 3-4 секунды**
3. **Автоматическое перенаправление на SUCCESS**
4. **Платеж помечается как PAID**
5. **Запись подтверждается (статус CONFIRMED)**

**Mock режим НЕ требует:**
- ❌ Реальной банковской карты
- ❌ API ключей ЮKassa
- ❌ Интернет соединения с платежной системой

---

## 🚀 Переход на ПРОДАКШЕН (ЮKassa)

### Шаг 1: Регистрация в ЮKassa

1. Зайдите на https://yookassa.ru/
2. Зарегистрируйте магазин
3. Получите в личном кабинете:
   - **Shop ID** (ID магазина)
   - **Secret Key** (секретный ключ)

### Шаг 2: Обновите `.env` файл

Откройте `server/.env` и измените:

```bash
# Было (Mock режим):
PAYMENT_MODE=mock

# Стало (Продакшн):
PAYMENT_MODE=production

# Добавьте ключи ЮKassa:
YUKASSA_SHOP_ID=ваш_shop_id_из_личного_кабинета
YUKASSA_SECRET_KEY=ваш_secret_key_из_личного_кабинета
YUKASSA_RETURN_URL=https://ваш-домен.ru/payment/success
```

### Шаг 3: Установите SDK ЮKassa

```bash
cd server
npm install @a2seven/yoo-checkout
```

### Шаг 4: Обновите Payment Service

Откройте `server/src/services/paymentService.ts` и замените функцию `createYukassaPayment`:

```typescript
import { YooCheckout } from '@a2seven/yoo-checkout';

private async createYukassaPayment(
  bookingId: number,
  amount: number,
  description: string,
  returnUrl?: string
): Promise<PaymentResult> {
  // Инициализация ЮKassa SDK
  const checkout = new YooCheckout({
    shopId: paymentConfig.yukassa.shopId,
    secretKey: paymentConfig.yukassa.secretKey,
  });

  try {
    // Создаем платеж в ЮKassa
    const payment = await checkout.createPayment({
      amount: {
        value: (amount / 100).toFixed(2), // конвертируем копейки в рубли
        currency: 'RUB',
      },
      confirmation: {
        type: 'redirect',
        return_url: returnUrl || paymentConfig.yukassa.returnUrl,
      },
      capture: true, // автоматическое списание
      description: description,
      metadata: {
        bookingId: bookingId.toString(),
      },
    });

    // Сохраняем платеж в БД
    const dbPayment = await prisma.payment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        amount,
        status: PaymentStatus.PENDING,
        provider: 'yukassa',
        paymentMethod: 'card',
        externalId: payment.id,
        paymentUrl: payment.confirmation.confirmation_url,
      },
      update: {
        amount,
        status: PaymentStatus.PENDING,
        provider: 'yukassa',
        externalId: payment.id,
        paymentUrl: payment.confirmation.confirmation_url,
      },
    });

    return {
      paymentId: dbPayment.id,
      status: dbPayment.status,
      paymentUrl: payment.confirmation.confirmation_url,
      externalId: payment.id,
    };
  } catch (error: any) {
    console.error('Ошибка создания платежа в ЮKassa:', error);
    throw new Error('Не удалось создать платеж');
  }
}
```

### Шаг 5: Настройте Webhook в ЮKassa

1. Зайдите в личный кабинет ЮKassa
2. Перейдите в "Настройки" → "Уведомления"
3. Укажите URL вебхука: `https://ваш-домен.ru/api/payments/webhook`
4. Выберите события: "Успешный платеж", "Отмененный платеж"

### Шаг 6: Обновите Webhook Controller

Откройте `server/src/controllers/paymentsController.ts` и обновите функцию `handleWebhook`:

```typescript
import { YooCheckout } from '@a2seven/yoo-checkout';

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const event = req.body;

    // Проверяем событие от ЮKassa
    if (event.event === 'payment.succeeded') {
      const paymentId = event.object.id;
      const bookingId = parseInt(event.object.metadata.bookingId);

      // Подтверждаем платеж
      await paymentService.confirmPayment(paymentId, bookingId);

      res.status(200).json({ status: 'ok' });
    } else if (event.event === 'payment.canceled') {
      // Обрабатываем отмену платежа
      const externalId = event.object.id;
      
      await prisma.payment.updateMany({
        where: { externalId },
        data: { status: 'FAILED' },
      });

      res.status(200).json({ status: 'ok' });
    } else {
      res.status(200).json({ status: 'ignored' });
    }
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error' 
    });
  }
};
```

### Шаг 7: Перезапустите Backend

```bash
cd server
npm run dev
```

---

## 🔄 Как работает ПРОДАКШН режим:

```
1. Клиент нажимает "Оплатить картой"
    ↓
2. Backend создает платеж в ЮKassa
    ↓
3. ЮKassa возвращает payment_url
    ↓
4. Клиент перенаправляется на страницу ЮKassa
    ↓
5. Клиент вводит данные карты
    ↓
6. ЮKassa обрабатывает платеж
    ↓
7. ЮKassa отправляет webhook на ваш сервер
    ↓
8. Backend подтверждает платеж и запись
    ↓
9. Клиент возвращается на /payment/success
```

---

## 🧪 Тестовый режим (перед продакшеном)

Можно использовать тестовый режим ЮKassa:

```bash
PAYMENT_MODE=test
YUKASSA_SHOP_ID=тестовый_shop_id
YUKASSA_SECRET_KEY=тестовый_secret_key
```

В тестовом режиме используйте тестовые карты ЮKassa:
- `5555 5555 5555 4444` - успешная оплата
- `5555 5555 5555 5599` - отклоненная оплата

---

## 📊 Сравнение режимов:

| Параметр | Mock | Test | Production |
|----------|------|------|------------|
| **Реальные деньги** | ❌ Нет | ❌ Нет | ✅ Да |
| **Требуются API ключи** | ❌ Нет | ✅ Да | ✅ Да |
| **Интеграция с ЮKassa** | ❌ Нет | ✅ Да | ✅ Да |
| **Автоподтверждение** | ✅ 3 сек | ❌ Webhook | ❌ Webhook |
| **Ввод карты** | ❌ Нет | ✅ Тестовая | ✅ Реальная |
| **Использование** | Разработка | Тестирование | Боевой сервер |

---

## ⚙️ Переключение режимов (быстрый способ):

### Вернуться к Mock:
```bash
PAYMENT_MODE=mock
```

### Включить Test:
```bash
PAYMENT_MODE=test
YUKASSA_SHOP_ID=test_...
YUKASSA_SECRET_KEY=test_...
```

### Включить Production:
```bash
PAYMENT_MODE=production
YUKASSA_SHOP_ID=live_...
YUKASSA_SECRET_KEY=live_...
```

**Перезапустите backend после изменения!**

---

## 🔒 Безопасность:

1. **НИКОГДА** не коммитьте `.env` файл в Git
2. **ВСЕГДА** используйте разные ключи для test и production
3. **Обязательно** меняйте `JWT_SECRET` в продакшене
4. **Используйте** HTTPS для продакшн сервера
5. **Проверяйте** подпись вебхуков от ЮKassa

---

## 🆘 Частые проблемы:

### Платеж не подтверждается:
- Проверьте, что webhook URL доступен извне (не localhost)
- Проверьте логи сервера на ошибки
- Убедитесь, что `PAYMENT_MODE` установлен правильно

### Редирект не работает:
- Проверьте `YUKASSA_RETURN_URL` в `.env`
- Убедитесь, что URL совпадает с настройками в ЮKassa

### "Платеж не найден":
- Убедитесь, что миграция применена (`npx prisma migrate dev`)
- Проверьте, что booking создается с payment записью

---

## 📞 Поддержка ЮKassa:

- 📧 Email: support@yookassa.ru
- 📱 Телефон: 8 (800) 250-66-99
- 📚 Документация: https://yookassa.ru/developers
- 💬 Telegram: @yookassa_support

---

## ✅ Чек-лист перед запуском в ПРОДАКШЕН:

- [ ] Зарегистрирован магазин в ЮKassa
- [ ] Получены production ключи
- [ ] Установлен `@a2seven/yoo-checkout`
- [ ] Обновлен `.env` с правильными ключами
- [ ] Обновлена функция `createYukassaPayment`
- [ ] Настроен webhook в ЮKassa
- [ ] Обновлена функция `handleWebhook`
- [ ] Протестирован процесс с тестовыми ключами
- [ ] Настроен HTTPS для сервера
- [ ] Изменен `JWT_SECRET` на уникальный
- [ ] Проверена доступность webhook URL
- [ ] Backend перезапущен с новыми настройками

---

**🎉 Готово! Теперь вы понимаете весь процесс от разработки до продакшена!**
