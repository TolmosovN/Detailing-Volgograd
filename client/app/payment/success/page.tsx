"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@shared/ui/Container";
import { Card } from "@shared/ui/Card";
import { Button } from "@shared/ui/Button";
import { formatPrice } from "@shared/lib";
import { paymentsApi, type PaymentWithBooking } from "@shared/api/paymentsApi";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [payment, setPayment] = useState<PaymentWithBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      loadPayment();
    } else {
      setIsLoading(false);
    }
  }, [bookingId]);

  const loadPayment = async () => {
    try {
      const response = await paymentsApi.getPaymentByBookingId(
        parseInt(bookingId!)
      );
      if (response.status === "success" && response.data) {
        setPayment(response.data);
      }
    } catch (error) {
      console.error("Ошибка загрузки платежа:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container className="py-16">
        <div className="text-center text-slate-400">Загрузка...</div>
      </Container>
    );
  }

  const amountInRubles = payment ? payment.amount / 100 : 0;

  return (
    <Container className="py-16">
      <Card className="max-w-md mx-auto text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold mb-2 text-green-400">
          Оплата успешна!
        </h1>
        <p className="text-slate-400 mb-6">
          Ваша запись подтверждена и оплачена
        </p>

        {payment && (
          <div className="space-y-4 mb-6 text-left">
            <div>
              <p className="text-sm text-slate-400">Услуга:</p>
              <p className="font-semibold">{payment.booking.service.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Дата:</p>
                <p className="font-medium">
                  {new Date(payment.booking.date).toLocaleDateString("ru-RU")}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Время:</p>
                <p className="font-medium">{payment.booking.time}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-400">Оплачено:</p>
              <p className="font-bold text-xl text-brand">
                {formatPrice(amountInRubles)}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button onClick={() => router.push("/profile")} className="w-full">
            Перейти в профиль
          </Button>
          <Button onClick={() => router.push("/")} variant="outline" className="w-full">
            На главную
          </Button>
        </div>

        <p className="text-xs text-slate-500 mt-6">
          Подтверждение отправлено на вашу почту
        </p>
      </Card>
    </Container>
  );
}
