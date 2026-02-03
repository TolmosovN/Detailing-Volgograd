type StatusBadgeProps = {
  status: string;
};

/**
 * Бейдж статуса записи
 */
export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig: Record<
    string,
    { label: string; className: string }
  > = {
    PENDING: {
      label: "Ожидает",
      className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/50",
    },
    CONFIRMED: {
      label: "Подтверждена",
      className: "bg-green-500/10 text-green-400 border-green-500/50",
    },
    COMPLETED: {
      label: "Выполнена",
      className: "bg-blue-500/10 text-blue-400 border-blue-500/50",
    },
    CANCELLED: {
      label: "Отменена",
      className: "bg-red-500/10 text-red-400 border-red-500/50",
    },
  };

  const config = statusConfig[status] || {
    label: status,
    className: "bg-slate-500/10 text-slate-400 border-slate-500/50",
  };

  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
};
