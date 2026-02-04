"use client";

import { useState } from "react";
import { Card } from "@shared/ui/Card";
import { Button } from "@shared/ui/Button";
import { formatPrice } from "@shared/lib";
import { StatusBadge } from "./StatusBadge";
import { adminApi, type AdminBooking } from "@shared/api/adminApi";
import { Modal } from "@shared/ui/Modal";
import toast from "react-hot-toast";

type BookingsTableProps = {
  bookings: AdminBooking[];
  onUpdate: () => void;
};

/**
 * Таблица всех записей для админа
 */
export const BookingsTable = ({ bookings, onUpdate }: BookingsTableProps) => {
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    bookingId: number | null;
    action: string | null;
    bookingName: string;
  }>({
    isOpen: false,
    bookingId: null,
    action: null,
    bookingName: "",
  });

  const openModal = (bookingId: number, action: string, bookingName: string) => {
    setModalState({
      isOpen: true,
      bookingId,
      action,
      bookingName,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      bookingId: null,
      action: null,
      bookingName: "",
    });
  };

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    setUpdatingId(bookingId);
    try {
      await adminApi.updateBookingStatus(bookingId, newStatus);
      
      // Успешный toast в зависимости от действия
      if (newStatus === "CONFIRMED") {
        toast.success("✅ Запись подтверждена!");
      } else if (newStatus === "CANCELLED") {
        toast.success("🚫 Запись отменена");
      } else if (newStatus === "COMPLETED") {
        toast.success("🎉 Запись завершена!");
      }
      
      onUpdate(); // Обновляем список
      closeModal(); // Закрываем модалку
    } catch (error) {
      console.error("Ошибка обновления статуса:", error);
      toast.error("Не удалось обновить статус записи");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmAction = () => {
    if (modalState.bookingId && modalState.action) {
      handleStatusChange(modalState.bookingId, modalState.action);
    }
  };

  if (bookings.length === 0) {
    return (
      <Card>
        <p className="text-center text-slate-400 py-8">Записи не найдены</p>
      </Card>
    );
  }

  // Получаем текст для модалки в зависимости от действия
  const getModalContent = () => {
    switch (modalState.action) {
      case "CONFIRMED":
        return {
          title: "⚠️ Подтвердить запись?",
          message: `Вы уверены, что хотите подтвердить запись клиента "${modalState.bookingName}"? Клиент получит email-уведомление.`,
          confirmText: "Подтвердить",
          variant: "default" as const,
        };
      case "CANCELLED":
        return {
          title: "🚫 Отменить запись?",
          message: `Вы уверены, что хотите отменить запись клиента "${modalState.bookingName}"? Это действие нельзя будет отменить. Клиент получит уведомление об отмене.`,
          confirmText: "Отменить запись",
          variant: "danger" as const,
        };
      case "COMPLETED":
        return {
          title: "✅ Завершить запись?",
          message: `Отметить запись клиента "${modalState.bookingName}" как завершённую?`,
          confirmText: "Завершить",
          variant: "default" as const,
        };
      default:
        return {
          title: "Подтверждение",
          message: "Вы уверены?",
          confirmText: "Подтвердить",
          variant: "default" as const,
        };
    }
  };

  const modalContent = getModalContent();

  return (
    <>
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
                        openModal(booking.id, "CONFIRMED", booking.name)
                      }
                      disabled={updatingId === booking.id}
                    >
                      {updatingId === booking.id ? "..." : "Подтвердить"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        openModal(booking.id, "CANCELLED", booking.name)
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
                    onClick={() =>
                      openModal(booking.id, "COMPLETED", booking.name)
                    }
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

      {/* Модальное окно подтверждения */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalContent.title}
        onConfirm={handleConfirmAction}
        confirmText={modalContent.confirmText}
        cancelText="Отмена"
        confirmVariant={modalContent.variant}
        isLoading={updatingId !== null}
      >
        <p>{modalContent.message}</p>
      </Modal>
    </>
  );
};
