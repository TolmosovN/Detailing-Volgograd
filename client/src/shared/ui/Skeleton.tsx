import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Базовый Skeleton компонент с настройками темы
 */
export { Skeleton };

/**
 * Скелетон для карточки услуги
 */
export const ServiceCardSkeleton = () => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <Skeleton 
        height={24} 
        width="60%" 
        baseColor="#1e293b" 
        highlightColor="#334155"
        className="mb-3"
      />
      <Skeleton 
        count={2} 
        height={16} 
        baseColor="#1e293b" 
        highlightColor="#334155"
        className="mb-4"
      />
      <div className="flex justify-between items-center">
        <Skeleton 
          width={100} 
          height={20} 
          baseColor="#1e293b" 
          highlightColor="#334155"
        />
        <Skeleton 
          width={120} 
          height={40} 
          baseColor="#1e293b" 
          highlightColor="#334155"
          borderRadius={6}
        />
      </div>
    </div>
  );
};

/**
 * Скелетон для записи в профиле
 */
export const BookingCardSkeleton = () => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <Skeleton 
          width={150} 
          height={20} 
          baseColor="#1e293b" 
          highlightColor="#334155"
        />
        <Skeleton 
          width={80} 
          height={24} 
          baseColor="#1e293b" 
          highlightColor="#334155"
          borderRadius={12}
        />
      </div>
      <Skeleton 
        count={3} 
        height={14} 
        baseColor="#1e293b" 
        highlightColor="#334155"
        className="mb-2"
      />
      <div className="flex gap-2 mt-4">
        <Skeleton 
          width={100} 
          height={36} 
          baseColor="#1e293b" 
          highlightColor="#334155"
          borderRadius={6}
        />
        <Skeleton 
          width={100} 
          height={36} 
          baseColor="#1e293b" 
          highlightColor="#334155"
          borderRadius={6}
        />
      </div>
    </div>
  );
};

/**
 * Скелетон для статистики (админ)
 */
export const StatsCardSkeleton = () => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <Skeleton 
        width="50%" 
        height={16} 
        baseColor="#1e293b" 
        highlightColor="#334155"
        className="mb-3"
      />
      <Skeleton 
        width="70%" 
        height={32} 
        baseColor="#1e293b" 
        highlightColor="#334155"
      />
    </div>
  );
};

/**
 * Скелетон для строки таблицы (админ)
 */
export const TableRowSkeleton = () => {
  return (
    <tr className="border-b border-slate-700">
      <td className="px-4 py-4">
        <Skeleton width={60} height={16} baseColor="#1e293b" highlightColor="#334155" />
      </td>
      <td className="px-4 py-4">
        <Skeleton width={120} height={16} baseColor="#1e293b" highlightColor="#334155" />
      </td>
      <td className="px-4 py-4">
        <Skeleton width={150} height={16} baseColor="#1e293b" highlightColor="#334155" />
      </td>
      <td className="px-4 py-4">
        <Skeleton width={100} height={16} baseColor="#1e293b" highlightColor="#334155" />
      </td>
      <td className="px-4 py-4">
        <Skeleton width={80} height={24} baseColor="#1e293b" highlightColor="#334155" borderRadius={12} />
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-2">
          <Skeleton width={90} height={32} baseColor="#1e293b" highlightColor="#334155" borderRadius={6} />
          <Skeleton width={90} height={32} baseColor="#1e293b" highlightColor="#334155" borderRadius={6} />
        </div>
      </td>
    </tr>
  );
};

/**
 * Скелетон для деталей платежа
 */
export const PaymentDetailsSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton 
        height={32} 
        width="60%" 
        baseColor="#1e293b" 
        highlightColor="#334155"
        className="mb-6"
      />
      
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between items-center border-b border-slate-700 pb-3 last:border-0 last:pb-0">
            <Skeleton width={100} height={16} baseColor="#1e293b" highlightColor="#334155" />
            <Skeleton width={150} height={16} baseColor="#1e293b" highlightColor="#334155" />
          </div>
        ))}
      </div>

      <Skeleton 
        width="100%" 
        height={48} 
        baseColor="#1e293b" 
        highlightColor="#334155"
        borderRadius={6}
        className="mt-6"
      />
    </div>
  );
};
