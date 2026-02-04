"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@shared/ui/Container";
import { Button } from "@shared/ui/Button";
import { useAuth } from "@features/auth/context/AuthContext";
import { StatsCards } from "@features/admin/components/StatsCards";
import { BookingsTable } from "@features/admin/components/BookingsTable";
import { adminApi, type AdminStats, type AdminBooking } from "@shared/api/adminApi";
import { TableRowSkeleton } from "@shared/ui/Skeleton";

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [filter, setFilter] = useState("all");

  // Проверка прав доступа
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Загрузка статистики
  useEffect(() => {
    if (user?.role === "ADMIN") {
      loadStats();
    }
  }, [user]);

  // Загрузка записей
  useEffect(() => {
    if (user?.role === "ADMIN") {
      loadBookings();
    }
  }, [user, filter]);

  const loadStats = async () => {
    try {
      const response = await adminApi.getStats();
      if (response.status === "success" && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const loadBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const response = await adminApi.getBookings({
        status: filter === "all" ? undefined : filter,
      });
      if (response.status === "success" && response.data) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error("Ошибка загрузки записей:", error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  // Показываем загрузку, пока проверяются права
  if (authLoading || !user) {
    return (
      <Container className="py-16">
        <div className="text-center text-slate-400">Загрузка...</div>
      </Container>
    );
  }

  // Если не админ, показываем сообщение (хотя редирект должен сработать)
  if (user.role !== "ADMIN") {
    return (
      <Container className="py-16">
        <div className="text-center text-red-400">
          Доступ запрещён. Требуются права администратора.
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="space-y-8">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Админ-панель</h1>
          <Button variant="outline" onClick={() => router.push("/")}>
            На главную
          </Button>
        </div>

        {/* Статистика */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Статистика</h2>
          {stats && <StatsCards stats={stats} isLoading={isLoadingStats} />}
        </div>

        {/* Популярные услуги */}
        {stats && stats.popularServices.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Популярные услуги</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.popularServices.map((service, index) => (
                <div
                  key={service.id}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-brand">#{index + 1}</p>
                      <p className="font-semibold">{service.name}</p>
                      <p className="text-sm text-slate-400">
                        {service.bookingsCount} записей
                      </p>
                    </div>
                    <div className="text-4xl">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Записи */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Записи</h2>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
              >
                Все
              </Button>
              <Button
                size="sm"
                variant={filter === "PENDING" ? "default" : "outline"}
                onClick={() => setFilter("PENDING")}
              >
                Ожидают
              </Button>
              <Button
                size="sm"
                variant={filter === "CONFIRMED" ? "default" : "outline"}
                onClick={() => setFilter("CONFIRMED")}
              >
                Подтверждены
              </Button>
              <Button
                size="sm"
                variant={filter === "COMPLETED" ? "default" : "outline"}
                onClick={() => setFilter("COMPLETED")}
              >
                Выполнены
              </Button>
            </div>
          </div>

          {isLoadingBookings ? (
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Клиент</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Услуга</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Дата/Время</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Статус</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRowSkeleton key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <BookingsTable bookings={bookings} onUpdate={loadBookings} />
          )}
        </div>
      </div>
    </Container>
  );
}
