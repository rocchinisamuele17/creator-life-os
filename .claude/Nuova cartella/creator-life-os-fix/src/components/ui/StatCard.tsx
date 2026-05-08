interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}

export function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div
      className="glass-card"
      style={{
        padding: "16px 18px",
        flex: 1,
        minWidth: 140,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.6)",
          textTransform: "uppercase",
          letterSpacing: 1.5,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        className="stat-value"
        style={{
          color: accent || "#fff",
          textShadow: accent ? `0 0 10px ${accent}40` : "none",
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}
