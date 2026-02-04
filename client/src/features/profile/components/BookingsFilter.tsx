"use client";

import { useState } from "react";

type BookingStatus = "ALL" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
type SortOrder = "newest" | "oldest";

type BookingsFilterProps = {
  onSearchChange: (search: string) => void;
  onStatusChange: (status: BookingStatus) => void;
  onSortChange: (sort: SortOrder) => void;
  totalCount: number;
  filteredCount: number;
};

/**
 * Компонент поиска и фильтрации записей в профиле
 */
export const BookingsFilter = ({
  onSearchChange,
  onStatusChange,
  onSortChange,
  totalCount,
  filteredCount,
}: BookingsFilterProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [activeStatus, setActiveStatus] = useState<BookingStatus>("ALL");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleStatusChange = (status: BookingStatus) => {
    setActiveStatus(status);
    onStatusChange(status);
  };

  const handleSortChange = (sort: SortOrder) => {
    setSortOrder(sort);
    onSortChange(sort);
  };

  const statusButtons: { value: BookingStatus; label: string }[] = [
    { value: "ALL", label: "Все" },
    { value: "PENDING", label: "Ожидают" },
    { value: "CONFIRMED", label: "Подтверждены" },
    { value: "COMPLETED", label: "Завершены" },
  ];

  return (
    <div className="space-y-4 bg-slate-800/30 border border-slate-700 rounded-lg p-4">
      {/* Поисковая строка */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Поиск по названию услуги..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
        />
        {searchValue && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Фильтры по статусу */}
      <div className="flex flex-wrap gap-2">
        {statusButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => handleStatusChange(btn.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeStatus === btn.value
                ? "bg-brand text-white shadow-lg shadow-brand/30"
                : "bg-slate-900/50 text-slate-300 hover:bg-slate-800 border border-slate-700"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Сортировка и счетчик */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Сортировка:</span>
          <button
            onClick={() => handleSortChange("newest")}
            className={`px-3 py-1 rounded text-xs transition-all ${
              sortOrder === "newest"
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ↓ Новые
          </button>
          <button
            onClick={() => handleSortChange("oldest")}
            className={`px-3 py-1 rounded text-xs transition-all ${
              sortOrder === "oldest"
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ↑ Старые
          </button>
        </div>

        <div className="text-sm">
          <span className="text-slate-400">Найдено: </span>
          <span className="font-semibold text-brand">
            {filteredCount}
          </span>
          {filteredCount !== totalCount && (
            <span className="text-slate-500"> из {totalCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};
