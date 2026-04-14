interface ProgressBarProps {
  value: number;
  color?: string;
}

export function ProgressBar({ value, color = "var(--accent)" }: ProgressBarProps) {
  return (
    <div
      style={{
        width: "100%",
        height: 5,
        borderRadius: "var(--radius-full)",
        background: "rgba(255,255,255,0.05)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          borderRadius: "var(--radius-full)",
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: `0 0 12px ${color}33`,
        }}
      />
    </div>
  );
}
