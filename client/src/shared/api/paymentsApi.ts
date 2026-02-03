import { apiClient } from "./apiClient";

/**
 * Статус платежа
 */
export type PaymentStatus = "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "REFUNDED";

/**
 * Данные платежа
 */
export type Payment = {
  id: number;
  bookingId: number;
  amount: number; // в копейках
  status: PaymentStatus;
  paymentMethod?: string;
  provider?: string;
  externalId?: string;
  paymentUrl?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Платеж с информацией о записи
 */
export type PaymentWithBooking = Payment & {
  booking: {
    id: number;
    date: string;
    time: string;
    status: string;
    name: string;
    phone: string;
    email: string;
    service: {
      id: number;
      name: string;
      description: string;
      priceFrom: number;
      duration: number;
    };
  };
};

/**
 * Ответы от API
 */
export type PaymentResponse = {
  status: "success" | "error";
  message?: string;
  data?: Payment;
};

export type PaymentWithBookingResponse = {
  status: "success" | "error";
  message?: string;
  data?: PaymentWithBooking;
};

export type CreatePaymentResponse = {
  status: "success" | "error";
  message?: string;
  data?: {
    paymentId: number;
    status: PaymentStatus;
    paymentUrl?: string;
    externalId?: string;
  };
};

/**
 * Payload для создания платежа
 */
export type CreatePaymentPayload = {
  bookingId: number;
  amount: number; // в копейках
  description?: string;
  returnUrl?: string;
};

/**
 * API для работы с платежами
 */
export const paymentsApi = {
  /**
   * Создать платеж
   */
  async createPayment(payload: CreatePaymentPayload): Promise<CreatePaymentResponse> {
    return apiClient.request<CreatePaymentResponse>('/payments/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Получить платеж по ID
   */
  async getPayment(paymentId: number): Promise<PaymentWithBookingResponse> {
    return apiClient.request<PaymentWithBookingResponse>(`/payments/${paymentId}`);
  },

  /**
   * Получить платеж по ID записи
   */
  async getPaymentByBookingId(bookingId: number): Promise<PaymentWithBookingResponse> {
    return apiClient.request<PaymentWithBookingResponse>(
      `/payments/booking/${bookingId}`
    );
  },

  /**
   * Подтвердить платеж (для тестирования)
   */
  async confirmPayment(
    paymentId: number,
    data: {
      status: PaymentStatus;
      externalId?: string;
      paymentMethod?: string;
    }
  ): Promise<PaymentResponse> {
    return apiClient.request<PaymentResponse>(`/payments/${paymentId}/confirm`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
