"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@shared/ui/Button";
import { Input } from "@shared/ui/Input";
import { Card } from "@shared/ui/Card";
import { useAuth } from "../context/AuthContext";
import { isValidEmail } from "@shared/lib";

type LoginFormData = {
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof LoginFormData, string>>;

/**
 * Форма входа в систему
 */
export const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (field: keyof LoginFormData, value: string) => {
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

    if (!formData.password) {
      newErrors.password = "Введите пароль";
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
      await login(formData.email, formData.password);
      // Перенаправляем на профиль после успешного входа
      router.push("/profile");
    } catch (error: any) {
      console.error("Ошибка входа:", error);
      setSubmitError(
        error.message || "Неверный email или пароль. Попробуйте снова."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Вход в систему</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          label="Пароль"
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder="Введите пароль"
          required
          error={errors.password}
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
          {isSubmitting ? "Вход..." : "Войти"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Нет аккаунта?{" "}
        <a
          href="/register"
          className="text-brand hover:text-brand-hover transition-colors"
        >
          Зарегистрироваться
        </a>
      </p>
    </Card>
  );
};
