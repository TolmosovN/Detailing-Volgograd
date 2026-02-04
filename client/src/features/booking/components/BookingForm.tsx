"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@shared/ui/Button";
import { Input } from "@shared/ui/Input";
import { Card } from "@shared/ui/Card";
import { formatPrice } from "@shared/lib";
import { isValidPhone, isValidEmail } from "@shared/lib";
import { servicesApi } from "@shared/api/servicesApi";
import { bookingApi } from "@shared/api/bookingApi";
import { useAuth } from "@features/auth/context/AuthContext";
import type { Service } from "@features/services/types";
import type { CreateBookingPayload } from "@shared/api/bookingApi";

/**
 * Тип данных формы записи.
 */
type BookingFormData = {
  serviceId: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
};

/**
 * Ошибки валидации формы.
 */
type FormErrors = Partial<Record<keyof BookingFormData, string>>;

/**
 * Компонент формы записи на мойку.
 * Поддерживает автозаполнение для авторизованных пользователей.
 */
export const BookingForm = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: "",
    date: "",
    time: "",
    name: "",
    phone: "",
    email: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  // Автозаполнение для авторизованных пользователей
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        phone: user.phone,
        email: user.email,
      }));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      try {
        const data = await servicesApi.getServices();
        if (isMounted) {
          setServices(data);
        }
      } catch {
        if (isMounted) {
          setServicesError("Не удалось загрузить список услуг");
        }
      } finally {
        if (isMounted) {
          setIsLoadingServices(false);
        }
      }
    };

    loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  // Получаем минимальную дату (сегодня)
  const today = new Date().toISOString().split("T")[0];

  // Генерируем доступные временные слоты (с 9:00 до 21:00, каждый час)
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  /**
   * Обработчик изменения полей формы.
   */
  const handleChange = (
    field: keyof BookingFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Очищаем ошибку для поля при изменении
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Сбрасываем статус отправки при изменении данных
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  /**
   * Валидация формы.
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.serviceId) {
      newErrors.serviceId = "Выберите услугу";
    }

    if (!formData.date) {
      newErrors.date = "Выберите дату";
    } else {
      const selectedDate = new Date(formData.date);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      if (selectedDate < todayDate) {
        newErrors.date = "Дата не может быть в прошлом";
      }
    }

    if (!formData.time) {
      newErrors.time = "Выберите время";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Введите ваше имя";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Введите номер телефона";
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = "Введите корректный номер телефона (+7XXXXXXXXXX)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Введите email";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Введите корректный email адрес";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Обработчик отправки формы.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const payload: CreateBookingPayload = {
        serviceId: Number(formData.serviceId),
        date: formData.date,
        time: formData.time,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim()
      };

      const result = await bookingApi.createBooking(payload);

      if (result.status === "success") {
        setSubmitStatus("success");
        
        // Показываем успешное уведомление
        toast.success("✅ Запись создана! Переход к оплате...");

        // Получаем ID записи из ответа
        const bookingId = result.data?.booking?.id;

        // Редиректим на страницу оплаты через 1.5 секунды
        setTimeout(() => {
          if (bookingId) {
            router.push(`/payment/${bookingId}`);
          } else {
            // Если по какой-то причине нет ID, перенаправляем в профиль
            router.push("/profile");
          }
        }, 1500);
        
        // Очищаем форму (для следующего использования)
        setTimeout(() => {
          setFormData({
            serviceId: "",
            date: "",
            time: "",
            name: "",
            phone: "",
            email: ""
          });
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitStatus("error");
        toast.error("Не удалось создать запись");
      }
    } catch (error: any) {
      setSubmitStatus("error");
      toast.error(error.message || "Не удалось создать запись");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedService = services.find(
    (s) => s.id === Number(formData.serviceId)
  );

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Запись на мойку</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Выбор услуги */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">
            Услуга <span className="text-red-400 ml-1">*</span>
          </label>
          <select
            value={formData.serviceId}
            onChange={(e) => handleChange("serviceId", e.target.value)}
            className={`w-full rounded-lg border bg-slate-900/60 px-4 py-2.5 text-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${
              errors.serviceId
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-700 hover:border-slate-600"
            }`}
            aria-invalid={errors.serviceId ? "true" : "false"}
            aria-describedby={errors.serviceId ? "serviceId-error" : undefined}
            disabled={isLoadingServices || Boolean(servicesError)}
          >
            <option value="">
              {isLoadingServices ? "Загрузка услуг..." : "Выберите услугу"}
            </option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} — от {formatPrice(service.priceFrom)}
              </option>
            ))}
          </select>
          {servicesError && (
            <p className="text-xs text-red-400" role="alert">
              {servicesError}
            </p>
          )}
          {errors.serviceId && (
            <p id="serviceId-error" className="text-xs text-red-400" role="alert">
              {errors.serviceId}
            </p>
          )}
          {selectedService && (
            <p className="text-xs text-slate-400 mt-1">
              {selectedService.description}
            </p>
          )}
        </div>

        {/* Дата и время */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Дата"
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            min={today}
            required
            error={errors.date}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Время <span className="text-red-400 ml-1">*</span>
            </label>
            <select
              value={formData.time}
              onChange={(e) => handleChange("time", e.target.value)}
              className={`w-full rounded-lg border bg-slate-900/60 px-4 py-2.5 text-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${
                errors.time
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-700 hover:border-slate-600"
              }`}
              aria-invalid={errors.time ? "true" : "false"}
              aria-describedby={errors.time ? "time-error" : undefined}
            >
              <option value="">Выберите время</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.time && (
              <p id="time-error" className="text-xs text-red-400" role="alert">
                {errors.time}
              </p>
            )}
          </div>
        </div>

        {/* Контактные данные */}
        <Input
          label="Ваше имя"
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Иван Иванов"
          required
          error={errors.name}
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
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="example@mail.ru"
          required
          error={errors.email}
        />

        {/* Сообщение об успехе/ошибке */}
        {submitStatus === "success" && (
          <div
            className="rounded-lg bg-green-500/10 border border-green-500/50 p-4 text-sm text-green-400"
            role="alert"
          >
            <p className="font-medium">Запись успешно создана!</p>
            <p className="text-xs mt-1 text-green-300">
              Мы свяжемся с вами в ближайшее время для подтверждения.
            </p>
          </div>
        )}

        {submitStatus === "error" && (
          <div
            className="rounded-lg bg-red-500/10 border border-red-500/50 p-4 text-sm text-red-400"
            role="alert"
          >
            <p className="font-medium">Ошибка при создании записи</p>
            <p className="text-xs mt-1 text-red-300">
              Пожалуйста, попробуйте еще раз позже.
            </p>
          </div>
        )}

        {/* Кнопка отправки */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Отправка..." : "Записаться"}
        </Button>
      </form>
    </Card>
  );
};
