"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@shared/api/authApi";
import { usersApi } from "@shared/api/usersApi";
import type { AuthContextType, User } from "../types";

// Создаём контекст
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider для контекста авторизации
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Проверка авторизации при загрузке приложения
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверяем, есть ли токен в localStorage
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Проверяем валидность токена, запросив данные пользователя
          try {
            const response = await usersApi.getMe();
            if (response.status === "success" && response.data) {
              setUser(response.data);
              localStorage.setItem("user", JSON.stringify(response.data));
            }
          } catch (error) {
            // Токен невалиден, очищаем
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Ошибка при проверке авторизации:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Регистрация нового пользователя
   */
  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string
  ) => {
    try {
      const response = await authApi.register({ email, password, name, phone });

      if (response.status === "success" && response.data) {
        const { token: newToken, user: newUser } = response.data;

        // Сохраняем в state
        setToken(newToken);
        setUser(newUser);

        // Сохраняем в localStorage
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
      } else {
        throw new Error(response.message || "Ошибка регистрации");
      }
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      throw error;
    }
  };

  /**
   * Вход в систему
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });

      if (response.status === "success" && response.data) {
        const { token: newToken, user: newUser } = response.data;

        // Сохраняем в state
        setToken(newToken);
        setUser(newUser);

        // Сохраняем в localStorage
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
      } else {
        throw new Error(response.message || "Ошибка входа");
      }
    } catch (error) {
      console.error("Ошибка при входе:", error);
      throw error;
    }
  };

  /**
   * Выход из системы
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook для использования контекста авторизации
 */
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }

  return context;
};
