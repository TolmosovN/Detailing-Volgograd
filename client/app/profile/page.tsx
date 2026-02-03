"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@shared/ui/Container";
import { Card } from "@shared/ui/Card";
import { Button } from "@shared/ui/Button";
import { useAuth } from "@features/auth/context/AuthContext";
import { usersApi, type UserBooking } from "@shared/api/usersApi";
import { formatPrice } from "@shared/lib";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Перенаправляем на login если не авторизован
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Загружаем записи пользователя
  useEffect(() => {
    const loadBookings = async () => {
      if (!user) return;

      try {
        const response = await usersApi.getMyBookings();
        if (response.status === "success" && response.data) {
          setBookings(response.data);
        }
      } catch (error) {
        console.error("Ошибка при загрузке записей:", error);
      } finally {
        setLoadingBookings(false);
      }
    };

    loadBookings();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <Container className="py-16">
        <div className="text-center text-slate-400">Загрузка...</div>
      </Container>
    );
  }

  if (!user) {
    return null; // Перенаправление произойдёт через useEffect
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      PENDING: { label: "Ожидает подтверждения", color: "text-yellow-400" },
      CONFIRMED: { label: "Подтверждена", color: "text-green-400" },
      COMPLETED: { label: "Выполнена", color: "text-blue-400" },
      CANCELLED: { label: "Отменена", color: "text-red-400" },
    };
    return statusMap[status] || { label: status, color: "text-slate-400" };
  };

  return (
    <Container className="py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Профиль пользователя */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Личный кабинет</h1>
            <Button onClick={handleLogout} variant="outline">
              Выйти
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm text-slate-400">Имя:</span>
              <p className="text-lg">{user.name}</p>
            </div>
            <div>
              <span className="text-sm text-slate-400">Email:</span>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <span className="text-sm text-slate-400">Телефон:</span>
              <p className="text-lg">{user.phone}</p>
            </div>
          </div>
        </Card>

        {/* Записи пользователя */}
        <div>
          <h2 className="text-xl font-bold mb-4">Мои записи</h2>

          {loadingBookings ? (
            <div className="text-center text-slate-400 py-8">
              Загрузка записей...
            </div>
          ) : bookings.length === 0 ? (
            <Card>
              <p className="text-center text-slate-400 py-8">
                У вас пока нет записей
              </p>
              <div className="text-center mt-4">
                <Button onClick={() => router.push("/booking")}>
                  Записаться на мойку
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const statusInfo = getStatusLabel(booking.status);
                return (
                  <Card key={booking.id}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          {booking.service.name}
                        </h3>
                        <p className="text-sm text-slate-400 mb-3">
                          {booking.service.description}
                        </p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-slate-400">Дата:</span>
                            <p>
                              {new Date(booking.date).toLocaleDateString(
                                "ru-RU"
                              )}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-400">Время:</span>
                            <p>{booking.time}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Стоимость:</span>
                            <p>{formatPrice(booking.service.priceFrom)}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">
                              Длительность:
                            </span>
                            <p>{booking.service.duration} мин</p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span
                          className={`text-sm font-medium ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
