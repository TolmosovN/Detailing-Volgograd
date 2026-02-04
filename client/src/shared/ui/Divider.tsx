type DividerProps = {
  text?: string;
  className?: string;
};

/**
 * Разделитель с опциональным текстом
 */
export const Divider = ({ text, className = "" }: DividerProps) => {
  if (text) {
    return (
      <div className={`relative flex items-center py-4 ${className}`}>
        <div className="flex-grow border-t border-slate-700"></div>
        <span className="flex-shrink mx-4 text-sm text-slate-400">{text}</span>
        <div className="flex-grow border-t border-slate-700"></div>
      </div>
    );
  }

  return <hr className={`border-slate-700 ${className}`} />;
};
