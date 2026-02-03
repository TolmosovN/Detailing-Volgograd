import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

/**
 * Компонент поля ввода для форм.
 * Поддерживает label и отображение ошибок валидации.
 */
export const Input = ({
  label,
  error,
  className,
  id,
  ...props
}: InputProps) => {
  const inputId = id || `input-${props.name || "field"}`;
  const labelId = label ? `${inputId}-label` : undefined;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          id={labelId}
          className="block text-xs font-medium text-slate-300"
        >
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          "w-full rounded-lg border bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent",
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-slate-700 hover:border-slate-600",
          className
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          className="text-xs text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};
