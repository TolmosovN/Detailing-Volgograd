"use client";

import Link from "next/link";
import { Container } from "@shared/ui/Container";
import { useAuth } from "@features/auth/context/AuthContext";

const NAV_ITEMS = [
  { href: "/", label: "Главная" },
  { href: "/booking", label: "Записаться" },
];

/**
 * Хедер сайта с логотипом и навигацией.
 * Показывает кнопку "Войти" или "Профиль" в зависимости от авторизации.
 */
export const Header = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <Container className="flex h-14 items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold tracking-wide text-brand hover:text-brand-hover transition-colors"
        >
          Detailing Volgograd
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden gap-4 text-xs text-slate-300 sm:flex items-center">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {/* Ссылка на админ-панель (только для админов) */}
            {isAuthenticated && user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="hover:text-white transition-colors text-yellow-400"
              >
                Админ
              </Link>
            )}

            {/* Кнопка авторизации / профиля */}
            {isAuthenticated && user ? (
              <Link
                href="/profile"
                className="px-3 py-1.5 rounded-md bg-brand/10 text-brand hover:bg-brand/20 transition-colors"
              >
                {user.name}
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-md bg-brand/10 text-brand hover:bg-brand/20 transition-colors"
              >
                Войти
              </Link>
            )}
          </nav>

          {/* Мобильное меню (упрощённое) */}
          <div className="sm:hidden flex items-center gap-2">
            {isAuthenticated && user ? (
              <Link
                href="/profile"
                className="text-xs px-3 py-1.5 rounded-md bg-brand/10 text-brand"
              >
                Профиль
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs px-3 py-1.5 rounded-md bg-brand/10 text-brand"
              >
                Войти
              </Link>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

