import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import clsx from "clsx";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary";
  }
>;

/**
 * Базовая кнопка проекта.
 * Используем для всех основных CTA.
 */
export const Button = ({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand";

  const variants: Record<typeof variant, string> = {
    primary:
      "bg-brand text-white hover:bg-brand-dark disabled:bg-slate-600 disabled:cursor-not-allowed",
    secondary:
      "border border-slate-600 text-slate-50 hover:bg-slate-800 disabled:border-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

