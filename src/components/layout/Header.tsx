export function Header() {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}
    >
      <img 
        src="/logo.png" 
        alt="Logo" 
        style={{ 
          width: 40, 
          height: 40, 
          objectFit: "contain",
          filter: "drop-shadow(0 0 10px var(--accent-color)) brightness(1.2) hue-rotate(180deg)",
          animation: "pulse-glow 2s infinite ease-in-out"
        }} 
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement!.insertAdjacentHTML('afterbegin', '<div style="width: 36px; height: 36px; border-radius: 8px; background: var(--accent-gradient); display: flex; align-items: center; justify-content: center; font-size: 18px">⚡</div>');
        }}
      />
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
