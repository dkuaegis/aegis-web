import * as React from "react";

type Toast = {
  id: string;
  description: string;
};

type ToastContextType = {
  toasts: Toast[];
  toast: (options: { description: string }) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = ({ description }: { description: string }) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, description }]);
    const timeoutId = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);

    return () => clearTimeout(timeoutId);
  };

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
      <div className="study-notice-region" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="study-notice">
            {t.description}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx.toast;
};
