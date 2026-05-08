export function Header() {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}
    >
      <div
        className="animate-glow animate-float"
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: "var(--accent-gradient)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          boxShadow: "0 0 15px rgba(0, 240, 255, 0.4)"
        }}
      >
        ⚡
      </div>
      <div>
        <div 
          className="text-gradient"
          style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}
        >
          Creator Life OS
        </div>
        <div
          style={{
            fontSize: 10,
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: 2,
            fontWeight: 600,
            marginTop: 2
          }}
        >
          by Prodigi Digitali
        </div>
      </div>
    </div>
  );
}
