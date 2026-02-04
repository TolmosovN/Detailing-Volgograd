type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

/**
 * Красивый спиннер загрузки
 */
export const Spinner = ({ size = "md", className = "" }: SpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-brand border-t-transparent rounded-full animate-spin ${className}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Загрузка...</span>
      </div>
    </div>
  );
};
