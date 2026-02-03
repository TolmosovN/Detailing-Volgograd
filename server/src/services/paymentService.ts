import { PrismaClient, PaymentStatus, BookingStatus } from '@prisma/client';
import { paymentConfig, isMockMode } from '../config/payment';

const prisma = new PrismaClient();

/**
 * Тип данных для создания платежа
 */
export type CreatePaymentData = {
  bookingId: number;
  amount: number; // в копейках
  description: string;
  returnUrl?: string;
};

/**
 * Результат создания платежа
 */
export type PaymentResult = {
  paymentId: number;
  status: PaymentStatus;
  paymentUrl?: string;
  externalId?: string;
};

/**
 * Сервис для работы с платежами
 */
export class PaymentService {
  /**
   * Создать платеж
   */
  async createPayment(data: CreatePaymentData): Promise<PaymentResult> {
    const { bookingId, amount, description, returnUrl } = data;

    // Проверяем, что запись существует
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });

    if (!booking) {
      throw new Error('Запись не найдена');
    }

    // Проверяем, что платеж еще не создан или не оплачен
    if (booking.payment && booking.payment.status === PaymentStatus.PAID) {
      throw new Error('Запись уже оплачена');
    }

    // В зависимости от режима создаем платеж
    if (isMockMode()) {
      return this.createMockPayment(bookingId, amount, description);
    } else {
      return this.createYukassaPayment(bookingId, amount, description, returnUrl);
    }
  }

  /**
   * Mock платеж (для разработки)
   */
  private async createMockPayment(
    bookingId: number,
    amount: number,
    description: string
  ): Promise<PaymentResult> {
    // Создаем или обновляем Payment запись
    const payment = await prisma.payment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        amount,
        status: PaymentStatus.PENDING,
        provider: 'mock',
        paymentMethod: 'card',
        externalId: `mock_${Date.now()}`,
        paymentUrl: `/payment/${bookingId}`,
      },
      update: {
        amount,
        status: PaymentStatus.PENDING,
        updatedAt: new Date(),
      },
    });

    // В mock режиме автоматически подтверждаем платеж через 3 секунды
    setTimeout(async () => {
      await this.confirmPayment(payment.id, {
        externalId: payment.externalId!,
        status: PaymentStatus.PAID,
      });
    }, paymentConfig.mock.autoConfirmDelayMs);

    return {
      paymentId: payment.id,
      status: payment.status,
      paymentUrl: payment.paymentUrl || undefined,
      externalId: payment.externalId || undefined,
    };
  }

  /**
   * Создание платежа через ЮKassa (реальная интеграция)
   */
  private async createYukassaPayment(
    bookingId: number,
    amount: number,
    description: string,
    returnUrl?: string
  ): Promise<PaymentResult> {
    // TODO: Реальная интеграция с ЮKassa
    // Здесь будет код для создания платежа в ЮKassa API
    // Сейчас просто заглушка
    
    const payment = await prisma.payment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        amount,
        status: PaymentStatus.PENDING,
        provider: 'yukassa',
        paymentUrl: returnUrl || paymentConfig.yukassa.returnUrl,
      },
      update: {
        amount,
        status: PaymentStatus.PENDING,
        updatedAt: new Date(),
      },
    });

    return {
      paymentId: payment.id,
      status: payment.status,
      paymentUrl: payment.paymentUrl || undefined,
    };
  }

  /**
   * Подтвердить платеж (webhook от платежной системы)
   */
  async confirmPayment(
    paymentId: number,
    data: {
      externalId: string;
      status: PaymentStatus;
      paymentMethod?: string;
    }
  ): Promise<void> {
    const { externalId, status, paymentMethod } = data;

    // Обновляем платеж
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        externalId,
        paymentMethod: paymentMethod || undefined,
        paidAt: status === PaymentStatus.PAID ? new Date() : undefined,
        updatedAt: new Date(),
      },
      include: {
        booking: true,
      },
    });

    // Если платеж успешен - автоматически подтверждаем запись
    if (status === PaymentStatus.PAID) {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: {
          status: BookingStatus.CONFIRMED,
          updatedAt: new Date(),
        },
      });

      console.log(`✅ Платеж ${paymentId} подтвержден. Запись ${payment.bookingId} автоматически подтверждена.`);
    }
  }

  /**
   * Получить информацию о платеже
   */
  async getPayment(paymentId: number) {
    return prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            service: true,
            user: true,
          },
        },
      },
    });
  }

  /**
   * Получить платеж по ID записи
   */
  async getPaymentByBookingId(bookingId: number) {
    return prisma.payment.findUnique({
      where: { bookingId },
      include: {
        booking: {
          include: {
            service: true,
          },
        },
      },
    });
  }

  /**
   * Обработать webhook от ЮKassa
   */
  async handleYukassaWebhook(webhookData: any): Promise<void> {
    // TODO: Реальная обработка webhook от ЮKassa
    // Здесь будет проверка подписи и обработка уведомления
    console.log('Получен webhook от ЮKassa:', webhookData);
  }
}

export const paymentService = new PaymentService();
