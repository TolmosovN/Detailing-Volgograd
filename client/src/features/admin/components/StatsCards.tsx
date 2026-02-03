import { Card } from "@shared/ui/Card";
import { formatPrice } from "@shared/lib";
import type { AdminStats } from "@shared/api/adminApi";

type StatsCardsProps = {
  stats: AdminStats;
  isLoading?: boolean;
};

/**
 * Карточки со статистикой для админ-панели
 */
export const StatsCards = ({ stats, isLoading }: StatsCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-16 bg-slate-700 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Всего записей */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Всего записей</p>
            <p className="text-3xl font-bold mt-1">{stats.totalBookings}</p>
          </div>
          <div className="text-4xl">🎫</div>
        </div>
      </Card>

      {/* Новые записи */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Новых (24ч)</p>
            <p className="text-3xl font-bold mt-1 text-brand">
              {stats.newBookings}
            </p>
          </div>
          <div className="text-4xl">⏳</div>
        </div>
      </Card>

      {/* Ожидают подтверждения */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Ожидают</p>
            <p className="text-3xl font-bold mt-1 text-yellow-400">
              {stats.pendingBookings}
            </p>
          </div>
          <div className="text-4xl">⏰</div>
        </div>
      </Card>

      {/* Общий доход */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Общий доход</p>
            <p className="text-3xl font-bold mt-1 text-green-400">
              {formatPrice(stats.totalRevenue)}
            </p>
          </div>
          <div className="text-4xl">💰</div>
        </div>
      </Card>
    </div>
  );
};
