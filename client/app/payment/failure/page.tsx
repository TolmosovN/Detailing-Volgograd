"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@shared/ui/Container";
import { Card } from "@shared/ui/Card";
import { Button } from "@shared/ui/Button";

export default function PaymentFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  return (
    <Container className="py-16">
      <Card className="max-w-md mx-auto text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-3xl font-bold mb-2 text-red-400">
          Ошибка оплаты
        </h1>
        <p className="text-slate-400 mb-6">
          К сожалению, не удалось обработать платеж.
          <br />
          Пожалуйста, попробуйте снова.
        </p>

        <div className="space-y-3">
          {bookingId && (
            <Button
              onClick={() => router.push(`/payment/${bookingId}`)}
              className="w-full"
            >
              Попробовать снова
            </Button>
          )}
          <Button
            onClick={() => router.push("/profile")}
            variant="outline"
            className="w-full"
          >
            Перейти в профиль
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full"
          >
            На главную
          </Button>
        </div>

        <p className="text-xs text-slate-500 mt-6">
          Если проблема повторяется, свяжитесь с нами по телефону
        </p>
      </Card>
    </Container>
  );
}
