export function Header() {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #f97316, #ea580c)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
        }}
      >
        ⚡
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>
          Creator Life OS
        </div>
        <div
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            letterSpacing: 1.5,
          }}
        >
          by Prodigi Digitali
        </div>
      </div>
    </div>
  );
}
