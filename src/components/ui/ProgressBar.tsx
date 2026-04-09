interface ProgressBarProps {
  value: number;
  color?: string;
}

export function ProgressBar({ value, color = "#f97316" }: ProgressBarProps) {
  return (
    <div
      style={{
        width: "100%",
        height: 6,
        borderRadius: 3,
        background: "rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          borderRadius: 3,
          background: color,
          transition: "width 0.6s ease",
        }}
      />
    </div>
  );
}
