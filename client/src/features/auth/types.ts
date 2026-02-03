/**
 * Типы для системы авторизации
 */

export type User = {
  id: number;
  email: string;
  phone: string;
  name: string;
  role: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone: string) => Promise<void>;
  logout: () => void;
};
