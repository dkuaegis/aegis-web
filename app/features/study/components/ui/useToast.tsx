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
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 9999,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              background: "#222",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: 8,
              marginBottom: 8,
              minWidth: 200,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              fontSize: 15,
            }}
          >
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
