import type { PropsWithChildren } from "react";
import clsx from "clsx";

type CardProps = PropsWithChildren<{
  className?: string;
  title?: string;
  onClick?: () => void;
}>;

/**
 * Базовый компонент карточки.
 * Используется для отображения услуг, записей и других блоков контента.
 */
export const Card = ({
  children,
  className,
  title,
  onClick
}: CardProps) => {
  const baseStyles =
    "rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-colors";

  const interactiveStyles = onClick
    ? "cursor-pointer hover:border-slate-700 hover:bg-slate-900/80"
    : "";

  return (
    <article
      className={clsx(baseStyles, interactiveStyles, className)}
      onClick={onClick}
    >
      {title && (
        <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
      )}
      {children}
    </article>
  );
};
