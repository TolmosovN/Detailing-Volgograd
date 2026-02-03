import type { PropsWithChildren } from "react";
import clsx from "clsx";

type ContainerProps = PropsWithChildren<{
  className?: string;
}>;

/**
 * Контейнер для выравнивания контента по центру
 * и задания максимальной ширины.
 */
export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={clsx("mx-auto w-full max-w-5xl px-4 sm:px-6", className)}>
      {children}
    </div>
  );
};

