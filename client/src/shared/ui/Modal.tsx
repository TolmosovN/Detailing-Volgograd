"use client";

import { useEffect } from "react";
import { Button } from "./Button";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "danger";
  isLoading?: boolean;
};

/**
 * Модальное окно с затемнением фона
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  confirmVariant = "default",
  isLoading = false,
}: ModalProps) => {
  // Блокируем скролл когда модалка открыта
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Затемненный фон */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Модальное окно */}
      <div
        className="relative bg-slate-800 rounded-xl border border-slate-700 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-white"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Закрыть"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Контент */}
        <div className="p-6">
          <div className="text-slate-300 text-sm leading-relaxed">
            {children}
          </div>
        </div>

        {/* Кнопки действий */}
        {onConfirm && (
          <div className="flex gap-3 p-6 border-t border-slate-700 bg-slate-900/50">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 ${
                confirmVariant === "danger"
                  ? "bg-red-600 hover:bg-red-700"
                  : ""
              }`}
            >
              {isLoading ? "Загрузка..." : confirmText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Хук для управления состоянием модалки
 */
export const useModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

// Для хука нужен React
import React from "react";
