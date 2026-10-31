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

  // Effects list `toast` as a dependency, so it must keep its identity across
  // renders; otherwise showing a toast re-runs the effect that showed it.
  const toast = React.useCallback(
    ({ description }: { description: string }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      setToasts((prev) => [...prev, { id, description }]);
      const timeoutId = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2500);

      return () => clearTimeout(timeoutId);
    },
    []
  );
  const value = React.useMemo(() => ({ toasts, toast }), [toasts, toast]);

  return (
    <ToastContext.Provider value={value}>
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
