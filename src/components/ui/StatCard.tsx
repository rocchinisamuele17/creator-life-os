interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}

export function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div
      className="glass-card animate-float"
      style={{
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%"
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "rgba(255,255,255,0.6)",
          textTransform: "uppercase",
          letterSpacing: 1.2,
          fontWeight: 600
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "clamp(24px, 5vw, 32px)",
          fontWeight: 800,
          color: accent || "#fff",
          lineHeight: 1.1,
          textShadow: accent ? `0 0 10px ${accent}40` : "none"
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
