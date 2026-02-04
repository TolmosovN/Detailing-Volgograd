import { ReactNode } from "react";

type AlertVariant = "info" | "success" | "warning" | "error";

type AlertProps = {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Информационный блок Alert
 */
export const Alert = ({ variant = "info", title, children, className = "" }: AlertProps) => {
  const variantStyles = {
    info: {
      container: "bg-blue-500/10 border-blue-500/30 text-blue-200",
      icon: "ℹ️",
    },
    success: {
      container: "bg-green-500/10 border-green-500/30 text-green-200",
      icon: "✅",
    },
    warning: {
      container: "bg-yellow-500/10 border-yellow-500/30 text-yellow-200",
      icon: "⚠️",
    },
    error: {
      container: "bg-red-500/10 border-red-500/30 text-red-200",
      icon: "❌",
    },
  };

  const style = variantStyles[variant];

  return (
    <div className={`border rounded-lg p-4 ${style.container} ${className}`} role="alert">
      <div className="flex gap-3">
        <span className="text-xl flex-shrink-0">{style.icon}</span>
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};
