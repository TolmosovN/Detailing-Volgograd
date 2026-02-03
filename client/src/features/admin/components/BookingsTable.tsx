"use client";

import { useState } from "react";
import { Card } from "@shared/ui/Card";
import { Button } from "@shared/ui/Button";
import { formatPrice } from "@shared/lib";
import { StatusBadge } from "./StatusBadge";
import { adminApi, type AdminBooking } from "@shared/api/adminApi";

type BookingsTableProps = {
  bookings: AdminBooking[];
  onUpdate: () => void;
};

/**
 * Таблица всех записей для админа
 */
export const BookingsTable = ({ bookings, onUpdate }: BookingsTableProps) => {
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    setUpdatingId(bookingId);
    try {
      await adminApi.updateBookingStatus(bookingId, newStatus);
      onUpdate(); // Обновляем список
    } catch (error) {
      console.error("Ошибка обновления статуса:", error);
      alert("Не удалось обновить статус записи");
    } finally {
      setUpdatingId(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <Card>
        <p className="text-center text-slate-400 py-8">Записи не найдены</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Информация о клиенте */}
            <div className="lg:col-span-3">
              <p className="font-semibold">{booking.name}</p>
              <p className="text-sm text-slate-400">{booking.phone}</p>
              <p className="text-sm text-slate-400">{booking.email}</p>
            </div>

            {/* Услуга */}
            <div className="lg:col-span-3">
              <p className="font-semibold text-brand">{booking.service.name}</p>
              <p className="text-sm text-slate-400">
                {formatPrice(booking.service.priceFrom)}
              </p>
              <p className="text-sm text-slate-400">
                {booking.service.duration} мин
              </p>
            </div>

            {/* Дата и время */}
            <div className="lg:col-span-2">
              <p className="text-sm text-slate-400">Дата:</p>
              <p className="font-medium">
                {new Date(booking.date).toLocaleDateString("ru-RU")}
              </p>
              <p className="font-medium">{booking.time}</p>
            </div>

            {/* Статус */}
            <div className="lg:col-span-2">
              <p className="text-sm text-slate-400 mb-2">Статус:</p>
              <StatusBadge status={booking.status} />
            </div>

            {/* Действия */}
            <div className="lg:col-span-2 flex flex-col gap-2">
              {booking.status === "PENDING" && (
                <>
                  <Button
                    size="sm"
                    onClick={() =>
                      handleStatusChange(booking.id, "CONFIRMED")
                    }
                    disabled={updatingId === booking.id}
                  >
                    {updatingId === booking.id ? "..." : "Подтвердить"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleStatusChange(booking.id, "CANCELLED")
                    }
                    disabled={updatingId === booking.id}
                  >
                    Отменить
                  </Button>
                </>
              )}
              {booking.status === "CONFIRMED" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusChange(booking.id, "COMPLETED")}
                  disabled={updatingId === booking.id}
                >
                  {updatingId === booking.id ? "..." : "Выполнена"}
                </Button>
              )}
              {booking.status === "COMPLETED" && (
                <p className="text-sm text-green-400">✓ Завершена</p>
              )}
              {booking.status === "CANCELLED" && (
                <p className="text-sm text-red-400">✗ Отменена</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
