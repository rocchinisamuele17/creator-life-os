import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const colors = { success: "#10b981", error: "#ef4444", info: "#6366f1" };

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              background: "rgba(0,0,0,0.9)",
              border: `1px solid ${colors[t.type]}`,
              borderLeft: `4px solid ${colors[t.type]}`,
              color: "#fff",
              padding: "12px 20px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              backdropFilter: "blur(12px)",
              animation: "slideIn 0.3s ease",
              maxWidth: 320,
              boxShadow: `0 4px 20px ${colors[t.type]}33`,
            }}
          >
            {t.type === "success" && "✅ "}
            {t.type === "error" && "❌ "}
            {t.type === "info" && "ℹ️ "}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
