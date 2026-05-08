interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px 20px",
        color: "rgba(255,255,255,0.4)",
      }}
    >
      <div
        style={{
          fontSize: 40,
          marginBottom: 12,
          opacity: 0.6,
          filter: "grayscale(0.3)",
        }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", maxWidth: 280, margin: "0 auto", lineHeight: 1.5 }}>
        {description}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            marginTop: 16,
            padding: "8px 20px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.06)",
            color: "var(--accent-color)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            minHeight: 40,
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
