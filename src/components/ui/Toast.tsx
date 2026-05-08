import { useEffect, useState, useSyncExternalStore } from "react";

// ── Toast Store (singleton) ──────────────────────────────────────
interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

let toasts: ToastItem[] = [];
let listeners: Array<() => void> = [];
let nextId = 1;

function emitChange() {
  listeners.forEach((l) => l());
}

export function toast(message: string, type: ToastItem["type"] = "success") {
  const id = nextId++;
  toasts = [...toasts, { id, message, type }];
  emitChange();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emitChange();
  }, 3000);
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  return toasts;
}

// ── Toast Container Component ───────────────────────────────────────
export function ToastContainer() {
  const items = useSyncExternalStore(subscribe, getSnapshot);

  if (items.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "calc(20px + var(--safe-bottom, 0px))",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
        maxWidth: "90vw",
      }}
    >
      {items.map((t) => (
        <ToastItemUI key={t.id} toast={t} />
      ))}
    </div>
  );
}

const TYPE_STYLES = {
  success: { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.4)", color: "#4ade80", icon: "✓" },
  error: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", color: "#ff6b6b", icon: "✕" },
  info: { bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.4)", color: "#818cf8", icon: "i" },
};

function ToastItemUI({ toast: t }: { toast: ToastItem }) {
  const [visible, setVisible] = useState(false);
  const s = TYPE_STYLES[t.type];

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        padding: "10px 18px",
        borderRadius: 10,
        background: s.bg,
        border: `1px solid ${s.border}`,
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        pointerEvents: "auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: s.color,
          color: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {s.icon}
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{t.message}</span>
    </div>
  );
}
