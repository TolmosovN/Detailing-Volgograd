"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@shared/ui/Button";
import { Input } from "@shared/ui/Input";
import { Card } from "@shared/ui/Card";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, isValidPhone } from "@shared/lib";

type RegisterFormData = {
  email: string;
  phone: string;
  name: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof RegisterFormData, string>>;

/**
 * Форма регистрации
 */
export const RegisterForm = () => {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    phone: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Введите email";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Введите номер телефона";
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = "Введите корректный номер телефона (+7XXXXXXXXXX)";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Введите ваше имя";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа";
    }

    if (!formData.password) {
      newErrors.password = "Введите пароль";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Подтвердите пароль";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await register(
        formData.email,
        formData.password,
        formData.name,
        formData.phone
      );
      // Перенаправляем на профиль после успешной регистрации
      router.push("/profile");
    } catch (error: any) {
      console.error("Ошибка регистрации:", error);
      setSubmitError(
        error.message ||
          "Не удалось зарегистрироваться. Возможно, пользователь с таким email или телефоном уже существует."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Имя"
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Иван Иванов"
          required
          error={errors.name}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="example@mail.ru"
          required
          error={errors.email}
        />

        <Input
          label="Телефон"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="+7 (999) 123-45-67"
          required
          error={errors.phone}
        />

        <Input
          label="Пароль"
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder="Минимум 6 символов"
          required
          error={errors.password}
        />

        <Input
          label="Подтвердите пароль"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          placeholder="Повторите пароль"
          required
          error={errors.confirmPassword}
        />

        {submitError && (
          <div
            className="rounded-lg bg-red-500/10 border border-red-500/50 p-3 text-sm text-red-400"
            role="alert"
          >
            {submitError}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Уже есть аккаунт?{" "}
        <a
          href="/login"
          className="text-brand hover:text-brand-hover transition-colors"
        >
          Войти
        </a>
      </p>
    </Card>
  );
};
