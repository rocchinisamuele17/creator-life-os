import { useState } from "react";
import { Link } from "react-router-dom";

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Skip Link — Accessibilità */}
      <a href="#main-content" className="skip-link">
        Vai al contenuto principale
      </a>

      {/* Navbar */}
      <nav className="landing-nav" aria-label="Navigazione principale">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            className="animate-glow"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "var(--accent-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              boxShadow: "0 0 15px rgba(0, 240, 255, 0.4)",
            }}
            aria-hidden="true"
          >
            ⚡
          </div>
          <span className="text-gradient" style={{ fontSize: 20, fontWeight: 800 }}>
            Creator Life OS
          </span>
        </div>

        {/* Desktop links */}
        <div className="landing-nav-links">
          <a href="#features" className="landing-nav-link">Caratteristiche</a>
          <a href="#pricing" className="landing-nav-link" style={{ marginRight: 8 }}>Prezzi</a>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button className="premium-btn primary" style={{ fontSize: 14, padding: "8px 24px" }}>
              Accedi / Registrati
            </button>
          </Link>
        </div>

        {/* Hamburger — solo mobile */}
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        role="navigation"
        aria-label="Menu mobile"
      >
        <a
          href="#features"
          className="landing-nav-link"
          onClick={() => setMenuOpen(false)}
          style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: 16, padding: "12px 0" }}
        >
          Caratteristiche
        </a>
        <a
          href="#pricing"
          className="landing-nav-link"
          onClick={() => setMenuOpen(false)}
          style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: 16, padding: "12px 0" }}
        >
          Prezzi
        </a>
        <Link to="/login" style={{ textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
          <button
            className="premium-btn primary"
            style={{ width: "100%", fontSize: 16, padding: "14px 24px", marginTop: 8 }}
          >
            Accedi / Registrati
          </button>
        </Link>
      </div>

      <main id="main-content" style={{ flex: 1 }}>
        {/* Hero */}
        <section
          className="hero-section"
          style={{
            padding: "80px 20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: 20,
              border: "1px solid rgba(0,240,255,0.3)",
              background: "rgba(0,240,255,0.05)",
              color: "var(--accent-color)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Lancio Ufficiale V1.0
          </div>

          <h1 className="hero-title">
            L'unico Sistema Operativo per{" "}
            <span className="text-gradient">Content Creator</span> Professionisti
          </h1>

          <p className="hero-subtitle">
            Gestisci video, entrate, accordi con i brand e le tue abitudini di vita.
            Tutto in un'unica piattaforma fluida, veloce e sincronizzata nel cloud.
          </p>

          <div className="hero-cta-group">
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button
                className="premium-btn animate-float"
                style={{
                  background: "var(--accent-gradient)",
                  color: "#000",
                  padding: "16px 36px",
                  fontSize: 16,
                  fontWeight: 700,
                  borderRadius: 12,
                  boxShadow: "0 8px 30px rgba(0, 240, 255, 0.4)",
                  border: "none",
                  width: "100%",
                }}
              >
                Inizia Ora Gratis 🚀
              </button>
            </Link>
            <a href="#features" style={{ textDecoration: "none" }}>
              <button
                className="premium-btn secondary"
                style={{ padding: "16px 36px", fontSize: 16, borderRadius: 12, width: "100%" }}
              >
                Scopri di più
              </button>
            </a>
          </div>
        </section>

        {/* Video Demo */}
        <section style={{ padding: "0 16px 60px", display: "flex", justifyContent: "center" }}>
          <div
            className="glass-panel"
            style={{
              width: "100%",
              maxWidth: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              padding: 0,
            }}
          >
            <video
              src="/demo-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              controls
              aria-label="Demo di Creator Life OS"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                position: "relative",
                zIndex: 1,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                background: "#7000ff",
                filter: "blur(100px)",
                opacity: 0.3,
              }}
              aria-hidden="true"
            />
            <div
              style={{
                position: "absolute",
                bottom: -50,
                left: -50,
                width: 200,
                height: 200,
                background: "#00f0ff",
                filter: "blur(100px)",
                opacity: 0.3,
              }}
              aria-hidden="true"
            />
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="features-section"
          style={{ padding: "60px 20px", background: "rgba(0,0,0,0.5)" }}
          aria-labelledby="features-heading"
        >
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <h2
              id="features-heading"
              className="text-gradient"
              style={{ textAlign: "center", fontSize: "clamp(28px, 6vw, 40px)", marginBottom: 48 }}
            >
              Perché scegliere Creator Life OS?
            </h2>
            <div className="features-grid">
              {[
                { icon: "🎬", title: "Content Machine", desc: "Traccia le tue idee, copioni e lo stato di pubblicazione dei tuoi contenuti su tutte le piattaforme." },
                { icon: "💰", title: "Money Tracker", desc: "Monitora ogni centesimo, dalle entrate pubblicitarie alle spese per l'attrezzatura, sempre sotto controllo." },
                { icon: "🤝", title: "Gestione Brand", desc: "Salva i contatti aziendali, tieni d'occhio lo status delle trattative e le scadenze delle fatture." },
                { icon: "☁️", title: "Salvataggio Sicuro", desc: "Il tuo ecosistema si sincronizza immediatamente su cloud. Nessun rischio di perdere i tuoi preziosi dati creativi." },
              ].map((f, i) => (
                <div className="glass-card" style={{ padding: 28 }} key={i}>
                  <div style={{ fontSize: 32, marginBottom: 16 }} aria-hidden="true">{f.icon}</div>
                  <h3 style={{ fontSize: 20, marginBottom: 12 }}>{f.title}</h3>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className="pricing-section"
          style={{ padding: "80px 20px" }}
          aria-labelledby="pricing-heading"
        >
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <h2
              id="pricing-heading"
              className="text-gradient"
              style={{ fontSize: "clamp(28px, 6vw, 40px)", marginBottom: 20 }}
            >
              Piani Semplici per Creator Folli
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "clamp(15px, 3vw, 18px)", marginBottom: 48, maxWidth: 600, margin: "0 auto 48px" }}>
              Inizia a tracciare la tua carriera gratuitamente. Sblocca il sistema operativo completo quando sei pronto a scalare.
            </p>

            <div className="pricing-cards">
              {/* Starter */}
              <div className="glass-panel pricing-card">
                <h3 style={{ fontSize: 24, margin: "0 0 10px" }}>Starter</h3>
                <p style={{ color: "var(--text-secondary)", margin: "0 0 24px" }}>
                  Perfetto per chi sta lanciando i primi video.
                </p>
                <div style={{ fontSize: "clamp(36px, 8vw, 48px)", fontWeight: 800, marginBottom: 30 }}>
                  €0<span style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 500 }}>/mese</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px", flex: 1 }}>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span aria-hidden="true">✅</span> <span>Fino a 30 contenuti</span></li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span aria-hidden="true">✅</span> <span>Tracciamento entrate base</span></li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span aria-hidden="true">✅</span> <span>Cloud Sync limitato</span></li>
                </ul>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <button className="premium-btn secondary" style={{ width: "100%", padding: 16, fontSize: 16, borderRadius: 12 }}>
                    Inizia Gratis
                  </button>
                </Link>
              </div>

              {/* Pro */}
              <div
                className="glass-panel pricing-card"
                style={{ borderColor: "var(--accent-color)", position: "relative" }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    right: 24,
                    background: "var(--accent-gradient)",
                    color: "#000",
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  PIÙ POPOLARE
                </div>
                <h3 style={{ fontSize: 24, margin: "0 0 10px", color: "var(--accent-color)" }}>Pro</h3>
                <p style={{ color: "var(--text-secondary)", margin: "0 0 24px" }}>
                  Per i Creator che fatturano e scalano.
                </p>
                <div style={{ fontSize: "clamp(36px, 8vw, 48px)", fontWeight: 800, marginBottom: 30 }}>
                  €15<span style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 500 }}>/mese</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px", flex: 1 }}>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span aria-hidden="true">⚡</span> <span>Contenuti illimitati</span></li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span aria-hidden="true">⚡</span> <span>Bilancio Entrate/Uscite illimitato</span></li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span aria-hidden="true">⚡</span> <span>Gestione Brand Deals completa</span></li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span aria-hidden="true">⚡</span> <span>Esportazioni PDF/CSV illimitate</span></li>
                </ul>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <button
                    className="premium-btn"
                    style={{
                      width: "100%",
                      padding: 16,
                      fontSize: 16,
                      borderRadius: 12,
                      background: "var(--accent-gradient)",
                      color: "#000",
                      border: "none",
                      fontWeight: 700,
                    }}
                  >
                    Passa a Pro
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: "40px 20px",
          paddingBottom: "calc(40px + var(--safe-bottom, 0px))",
          textAlign: "center",
          borderTop: "1px solid var(--glass-border)",
          color: "var(--text-secondary)",
          fontSize: 14,
        }}
      >
        Creator Life OS © {new Date().getFullYear()}. Realizzato da Prodigi Digitali.
      </footer>
    </div>
  );
}
