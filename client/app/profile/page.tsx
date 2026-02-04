"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@shared/ui/Container";
import { Card } from "@shared/ui/Card";
import { Button } from "@shared/ui/Button";
import { useAuth } from "@features/auth/context/AuthContext";
import { usersApi, type UserBooking } from "@shared/api/usersApi";
import { formatPrice } from "@shared/lib";
import { BookingCardSkeleton } from "@shared/ui/Skeleton";
import { Modal } from "@shared/ui/Modal";
import { BookingsFilter } from "@features/profile/components/BookingsFilter";
import { AnimatedListItem } from "@shared/ui/AnimatedList";
import { EmptyState } from "@shared/ui/EmptyState";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  // Состояния для фильтрации и поиска
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED">("ALL");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

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
    setIsLogoutModalOpen(false);
  };

  // Фильтрация и сортировка записей
  const filteredAndSortedBookings = useMemo(() => {
    let result = [...bookings];

    // Поиск по названию услуги
    if (searchQuery) {
      result = result.filter((booking) =>
        booking.service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по статусу
    if (statusFilter !== "ALL") {
      result = result.filter((booking) => booking.status === statusFilter);
    }

    // Сортировка по дате
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [bookings, searchQuery, statusFilter, sortOrder]);

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
            <Button onClick={() => setIsLogoutModalOpen(true)} variant="outline">
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
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <BookingCardSkeleton key={i} />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState
              icon="📅"
              title="У вас пока нет записей"
              description="Запишитесь на услугу автомойки, и все ваши записи будут отображаться здесь."
              action={{
                label: "Записаться на мойку",
                onClick: () => router.push("/booking"),
              }}
            />
          ) : (
            <>
              {/* Фильтры и поиск */}
              <BookingsFilter
                onSearchChange={setSearchQuery}
                onStatusChange={setStatusFilter}
                onSortChange={setSortOrder}
                totalCount={bookings.length}
                filteredCount={filteredAndSortedBookings.length}
              />

              {/* Результаты */}
              {filteredAndSortedBookings.length === 0 ? (
                <div className="mt-4">
                  <EmptyState
                    icon="🔍"
                    title="Ничего не найдено"
                    description="Попробуйте изменить фильтры или очистить поиск."
                  />
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  {filteredAndSortedBookings.map((booking, index) => {
                const statusInfo = getStatusLabel(booking.status);
                return (
                  <AnimatedListItem key={booking.id} index={index}>
                    <Card>
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
                  </AnimatedListItem>
                );
              })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Модальное окно выхода */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="🚪 Выйти из аккаунта?"
        onConfirm={handleLogout}
        confirmText="Выйти"
        cancelText="Отмена"
        confirmVariant="danger"
      >
        <p>Вы уверены, что хотите выйти из личного кабинета?</p>
      </Modal>
    </Container>
  );
}
