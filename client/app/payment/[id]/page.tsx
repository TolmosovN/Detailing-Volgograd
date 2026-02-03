"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Container } from "@shared/ui/Container";
import { Card } from "@shared/ui/Card";
import { Button } from "@shared/ui/Button";
import { formatPrice } from "@shared/lib";
import { paymentsApi, type PaymentWithBooking } from "@shared/api/paymentsApi";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [payment, setPayment] = useState<PaymentWithBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPayment();
  }, [bookingId]);

  const loadPayment = async () => {
    try {
      const response = await paymentsApi.getPaymentByBookingId(
        parseInt(bookingId)
      );
      if (response.status === "success" && response.data) {
        setPayment(response.data);

        // Если платеж уже оплачен, редиректим на success
        if (response.data.status === "PAID") {
          router.push(`/payment/success?bookingId=${bookingId}`);
        }
      } else {
        setError("Платеж не найден");
      }
    } catch (error) {
      console.error("Ошибка загрузки платежа:", error);
      setError("Не удалось загрузить информацию о платеже");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!payment) return;

    try {
      // Создаем платеж (это запустит mock автоподтверждение)
      const response = await paymentsApi.createPayment({
        bookingId: payment.bookingId,
        amount: payment.amount,
        description: `Оплата записи #${payment.bookingId}`,
        returnUrl: `${window.location.origin}/payment/success?bookingId=${bookingId}`,
      });

      if (response.status === "success" && response.data) {
        // В mock режиме автоподтверждение произойдёт через 3 секунды
        // Показываем сообщение и ждём
        alert("Оплата в процессе... (mock режим - автоподтверждение через 3 сек)");

        // Ждём 3.5 секунды и редиректим на success
        setTimeout(() => {
          router.push(`/payment/success?bookingId=${bookingId}`);
        }, 3500);
      }
    } catch (error) {
      console.error("Ошибка оплаты:", error);
      router.push(`/payment/failure?bookingId=${bookingId}`);
    }
  };

  if (isLoading) {
    return (
      <Container className="py-16">
        <div className="text-center text-slate-400">Загрузка...</div>
      </Container>
    );
  }

  if (error || !payment) {
    return (
      <Container className="py-16">
        <Card className="max-w-md mx-auto text-center">
          <p className="text-red-400 mb-4">{error || "Платеж не найден"}</p>
          <Button onClick={() => router.push("/")}>На главную</Button>
        </Card>
      </Container>
    );
  }

  const amountInRubles = payment.amount / 100;

  return (
    <Container className="py-16">
      <Card className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Оплата записи</h1>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-slate-400">Услуга:</p>
            <p className="font-semibold text-brand">
              {payment.booking.service.name}
            </p>
            <p className="text-sm text-slate-400">
              {payment.booking.service.description}
            </p>
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
            <p className="text-sm text-slate-400">Клиент:</p>
            <p className="font-medium">{payment.booking.name}</p>
            <p className="text-sm text-slate-400">{payment.booking.phone}</p>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-4 mb-6">
          <div className="flex justify-between items-center text-lg">
            <span className="font-semibold">Итого:</span>
            <span className="font-bold text-2xl text-brand">
              {formatPrice(amountInRubles)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={handlePayment} className="w-full">
            Оплатить картой
          </Button>

          <Button onClick={() => router.push("/")} variant="outline" className="w-full">
            Отменить
          </Button>
        </div>

        <p className="text-xs text-slate-500 text-center mt-4">
          🔒 Безопасная оплата
          <br />
          (Mock режим - автоподтверждение через 3 секунды)
        </p>
      </Card>
    </Container>
  );
}
