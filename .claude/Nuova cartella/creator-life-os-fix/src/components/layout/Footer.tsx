export function Footer() {
  return (
    <footer
      style={{
        padding: "20px 20px",
        paddingBottom: "calc(20px + var(--safe-bottom, 0px))",
        textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        marginTop: 40,
      }}
    >
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
        Creator Life OS v1.0 — Prodigi Digitali © {new Date().getFullYear()}
      </div>
    </footer>
  );
}
