"use client";

import { ReactNode } from "react";
import { Button } from "./Button";
import { FadeIn } from "./AnimatedList";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
};

/**
 * Красивая заглушка для пустых состояний
 */
export const EmptyState = ({ icon = "📭", title, description, action, children }: EmptyStateProps) => {
  return (
    <FadeIn className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-6xl mb-4 opacity-60">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-slate-400 text-sm max-w-md mb-6">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
      {children}
    </FadeIn>
  );
};
