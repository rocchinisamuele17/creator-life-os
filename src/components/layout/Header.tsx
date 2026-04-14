export function Header() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 18,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: "linear-gradient(135deg, var(--accent), #d4922f)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          boxShadow: "0 4px 16px rgba(229, 166, 59, 0.25)",
          flexShrink: 0,
        }}
      >
        ⚡
      </div>
      <div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: -0.5,
            color: "var(--text-primary)",
          }}
        >
          Creator Life OS
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 9,
            fontWeight: 600,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: 2.5,
            marginTop: 1,
          }}
        >
          Prodigi Digitali
        </div>
      </div>
    </div>
  );
}
