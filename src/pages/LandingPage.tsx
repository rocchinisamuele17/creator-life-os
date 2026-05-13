import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [annualBilling, setAnnualBilling] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(() => {
    return !localStorage.getItem("creator-life-os:cookies-accepted");
  });

  // Waitlist States
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);

  const acceptCookies = () => {
    localStorage.setItem("creator-life-os:cookies-accepted", "true");
    setShowCookieBanner(false);
  };

  const handleWaitlistSubmit = useCallback(async () => {
    setError(null);
    if (!email || !email.includes('@')) {
      setError('email');
      return;
    }
    if (!selectedRole) {
      setError('role');
      return;
    }

    setSubmitting(true);
    try {
      if (!supabase) throw new Error("Database non configurato");
      const { error: dbError } = await supabase
        .from('waitlist')
        .insert([{ email, role: selectedRole }]);

      if (dbError) {
        if (dbError.code === '23505') {
          setError('duplicate');
          setSubmitting(false);
          return;
        }
        throw dbError;
      }

      const { count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });

      setWaitlistPosition(count || 1);
      setSubmitted(true);
    } catch (err) {
      console.error('Waitlist error:', err);
      setError('generic');
    } finally {
      setSubmitting(false);
    }
  }, [email, selectedRole]);

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", background: "#050505", color: "#fff", width: "100%" }}>
      <a href="#main-content" className="skip-link">Vai al contenuto principale</a>

      {/* Navbar Responsive */}
      <nav className="landing-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img 
              src="/logo.png" 
              alt="Prodigi Logo" 
              style={{ 
                width: 60, 
                height: 60, 
                objectFit: "contain",
                filter: "drop-shadow(0 0 10px var(--accent-color))",
                animation: "pulse-glow 3s infinite ease-in-out"
              }} 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.insertAdjacentHTML('afterbegin', '<div class="animate-glow" style="width: 36px; height: 36px; borderRadius: 8px; background: var(--accent-gradient); display: flex; alignItems: center; justifyContent: center; fontSize: 18px">⚡</div>');
            }}
          />
          <span className="text-gradient" style={{ fontSize: 20, fontWeight: 800 }}>Creator Life OS</span>
        </div>


        <div className="landing-nav-links">
          <a href="#features" className="landing-nav-link">Caratteristiche</a>
          <Link to="/pricing" className="landing-nav-link" style={{ marginRight: 16, textDecoration: "none" }}>Prezzi</Link>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button className="premium-btn primary" style={{ fontSize: 14 }}>Accedi / Registrati</button>
          </Link>
        </div>

        <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <a href="#features" onClick={() => setMenuOpen(false)} className="landing-nav-link">Caratteristiche</a>
        <Link to="/pricing" onClick={() => setMenuOpen(false)} className="landing-nav-link">Prezzi</Link>
        <Link to="/login" onClick={() => setMenuOpen(false)}>
          <button className="premium-btn primary" style={{ width: "100%", marginTop: 8 }}>Accedi / Registrati</button>
        </Link>
      </div>

      <main id="main-content" style={{ flex: 1 }}>
        {/* Hero Section */}
        <section className="hero-section" style={{ padding: "60px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ padding: "6px 16px", borderRadius: 20, border: "1px solid rgba(0,240,255,0.3)", background: "rgba(0,240,255,0.05)", color: "var(--accent-color)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Lancio Ufficiale V1.0</div>
          <h1 className="hero-title" style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)", fontWeight: 800, margin: 0, lineHeight: 1.1, maxWidth: 900 }}>L'unico Sistema Operativo <br /><span className="text-gradient">Potenziato dall'AI</span> per Creator</h1>
          <p className="hero-subtitle" style={{ fontSize: 20, color: "rgba(255,255,255,0.6)", maxWidth: 600, lineHeight: 1.6 }}>L'intelligenza artificiale al servizio della tua creatività. Gestisci video, entrate e accordi con i brand in un unico ecosistema intelligente.</p>

          {/* Hero Video Cinematico */}
          <div className="glass-panel" style={{ width: "100%", maxWidth: 800, marginTop: 20, position: "relative", overflow: "hidden", padding: 0, borderRadius: 20 }}>
            <video src="/hero-video.mp4#t=0,10" autoPlay loop muted playsInline style={{ width: "100%", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.3) 100%)", pointerEvents: "none" }} />
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button className="premium-btn primary animate-float" style={{ padding: "16px 36px", fontSize: 16, fontWeight: 700, borderRadius: 12 }}>Inizia Prova Gratuita 🚀</button>
            </Link>
            <a href="#features" style={{ textDecoration: "none" }}>
              <button className="premium-btn secondary" style={{ padding: "16px 36px", fontSize: 16, borderRadius: 12 }}>Scopri di più</button>
            </a>
          </div>
        </section>

        {/* Features */}
        <section id="features" style={{ padding: "80px 20px", background: "rgba(0,0,0,0.5)" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <h2 className="text-gradient" style={{ textAlign: "center", fontSize: 40, marginBottom: 60 }}>Il Tuo Nuovo Ecosistema Pro</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 30 }}>
              <div className="glass-card" style={{ padding: 30 }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>📱</div>
                <h3 style={{ fontSize: 20, marginBottom: 12 }}>Preview Studio Avanzato</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>Testa i tuoi contenuti visivi in un simulatore interattivo per Instagram, TikTok e YouTube.</p>
              </div>
              <div className="glass-card" style={{ padding: 30 }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>📊</div>
                <h3 style={{ fontSize: 20, marginBottom: 12 }}>Money Tracker & Grafici</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>Statistiche, Simulazione Crescita e Grafici a Torta interattivi. Analizza le tue entrate.</p>
              </div>
              <div className="glass-card" style={{ padding: 30 }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>⏰</div>
                <h3 style={{ fontSize: 20, marginBottom: 12 }}>Routine Personalizzabile</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>Crea i tuoi slot giornalieri con un sistema di gestione del tempo dinamico.</p>
              </div>
              <div className="glass-card" style={{ padding: 30 }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>🗓️</div>
                <h3 style={{ fontSize: 20, marginBottom: 12 }}>Sincronizzazione Calendario</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>Esporta automaticamente scadenze, eventi e routine sul tuo Google o Apple Calendar.</p>
              </div>
              <div className="glass-card" style={{ padding: 30 }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>🔥</div>
                <h3 style={{ fontSize: 20, marginBottom: 12 }}>Gamification & Streak</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>Mantieni alta la motivazione! Completa la tua routine e aumenta il tuo punteggio ogni giorno.</p>
              </div>
              <div className="glass-card" style={{ padding: 30, border: "1px solid rgba(124, 58, 237, 0.4)", background: "rgba(124, 58, 237, 0.05)" }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>✨</div>
                <h3 style={{ fontSize: 20, marginBottom: 12, color: "#a78bfa" }}>AI Copilot & Brainstorming</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>Genera idee virali, scrivi script persuasivi e ottieni proposte per i brand in pochi secondi grazie all'AI integrata.</p>
              </div>
              <div className="glass-card" style={{ padding: 30 }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>👑</div>
                <h3 style={{ fontSize: 20, marginBottom: 12 }}>Admin Dashboard</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>Pannello segreto integrato per gestire iscritti, controllare accessi e raccogliere feedback reali.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" style={{ padding: "100px 20px", background: "rgba(0,0,0,0.3)" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
            <h2 className="text-gradient" style={{ fontSize: "clamp(2rem, 5vw, 40px)", marginBottom: 16 }}>Piani Semplici per Creator Folli</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: 40, fontSize: 18 }}>Tutto il necessario per scalare la tua presenza digitale.</p>

            {/* Why 7 Euro Metrics */}
            <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", marginBottom: 60 }}>
              <div style={{ padding: "16px 24px", background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", minWidth: 160 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent-color)" }}>7€</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>2 caffè al mese</div>
              </div>
              <div style={{ padding: "16px 24px", background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", minWidth: 160 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent-color)" }}>-25%</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Piano Annuale</div>
              </div>
              <div style={{ padding: "16px 24px", background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", minWidth: 160 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent-color)" }}>0%</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Fee transazioni</div>
              </div>
            </div>

            {/* Billing Toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 60 }}>
              <span style={{ fontSize: 14, color: annualBilling ? "var(--text-secondary)" : "#fff", fontWeight: annualBilling ? 500 : 700 }}>Mensile</span>
              <button 
                onClick={() => setAnnualBilling(!annualBilling)}
                style={{
                  width: 50,
                  height: 26,
                  borderRadius: 13,
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                  position: "relative",
                  cursor: "pointer",
                  padding: 0
                }}
              >
                <div style={{
                  position: "absolute",
                  top: 2,
                  left: annualBilling ? 26 : 2,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "var(--accent-gradient)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }} />
              </button>
              <span style={{ fontSize: 14, color: annualBilling ? "#fff" : "var(--text-secondary)", fontWeight: annualBilling ? 700 : 500 }}>
                Annuale <span style={{ color: "var(--accent-color)", fontSize: 11, background: "rgba(0,240,255,0.1)", padding: "2px 8px", borderRadius: 10, marginLeft: 4 }}>-25%</span>
              </span>
            </div>

            <div style={{ display: "flex", gap: 30, flexWrap: "wrap", justifyContent: "center" }}>
              {/* Plan: FREE */}
              <div className="glass-panel" style={{ flex: "1", minWidth: 300, maxWidth: 400, padding: 40, textAlign: "left", display: "flex", flexDirection: "column" }}>
                <div style={{ marginBottom: 30 }}>
                  <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Free</h3>
                  <div style={{ fontSize: 48, fontWeight: 800 }}>€0<span style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 400 }}>/sempre</span></div>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 12 }}>Tutto il necessario per iniziare. Nessuna carta di credito.</p>
                </div>
                
                <ul style={{ padding: 0, listStyle: "none", fontSize: 14, color: "var(--text-secondary)", marginBottom: 40, flex: 1 }}>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span style={{ color: "#10b981" }}>✓</span> Dashboard panoramica</li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span style={{ color: "#10b981" }}>✓</span> Calendario integrato</li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span style={{ color: "#10b981" }}>✓</span> Habit tracker (max 3 abitudini)</li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span style={{ color: "#10b981" }}>✓</span> Content pipeline (max 10 contenuti)</li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span style={{ color: "#10b981" }}>✓</span> Money tracker (base)</li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span style={{ color: "#10b981" }}>✓</span> Brand deals (max 2 attivi)</li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span style={{ color: "#10b981" }}>✓</span> Journal (ultimi 30 giorni)</li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10, opacity: 0.4 }}><span>✕</span> AI Copilot & Brainstorming</li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10, opacity: 0.4 }}><span>✕</span> Growth Simulator</li>
                </ul>

                <button className="premium-btn secondary" style={{ width: "100%", padding: "14px" }}>Inizia Gratis</button>
              </div>

              {/* Plan: PRO */}
              <div className="glass-panel" style={{ 
                flex: "1", 
                minWidth: 300, 
                maxWidth: 400, 
                padding: 40, 
                textAlign: "left", 
                borderColor: "var(--accent-color)", 
                background: "rgba(0,240,255,0.03)",
                display: "flex", 
                flexDirection: "column",
                position: "relative",
                transform: "scale(1.05)",
                zIndex: 2
              }}>
                <div style={{ 
                  position: "absolute", 
                  top: -14, 
                  left: "50%", 
                  transform: "translateX(-50%)", 
                  background: "var(--accent-color)", 
                  color: "#000", 
                  padding: "6px 20px", 
                  borderRadius: 20, 
                  fontSize: 13, 
                  fontWeight: 900,
                  boxShadow: "0 4px 15px rgba(0,240,255,0.4)",
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap"
                }}>CONSIGLIATO</div>
                
                <div style={{ marginBottom: 30 }}>
                  <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "var(--accent-color)" }}>Pro</h3>
                  <div style={{ fontSize: 48, fontWeight: 800 }}>
                    {annualBilling ? "€59" : "€7"}
                    <span style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 400 }}>{annualBilling ? "/anno" : "/mese"}</span>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 12 }}>
                    {annualBilling ? "Circa €4,90 al mese (risparmi il 25%)" : "Tutto illimitato + AI. Per chi fa sul serio."}
                  </p>
                </div>
                
                <ul style={{ padding: 0, listStyle: "none", fontSize: 14, color: "#fff", marginBottom: 40, flex: 1 }}>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span style={{ color: "var(--accent-color)" }}>⚡</span> Tutto del piano Free, senza limiti</li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span style={{ color: "var(--accent-color)" }}>⚡</span> <strong>AI Copilot</strong> (caption, hook, script)</li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span style={{ color: "var(--accent-color)" }}>⚡</span> <strong>AI Proposal Generator</strong></li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span style={{ color: "var(--accent-color)" }}>⚡</span> <strong>Growth Simulator</strong> (6 mesi)</li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span style={{ color: "var(--accent-color)" }}>⚡</span> Export report PDF</li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span style={{ color: "var(--accent-color)" }}>⚡</span> Analytics avanzate & Trend</li>
                  <li style={{ marginBottom: 12, display: "flex", gap: 10 }}><span style={{ color: "var(--accent-color)" }}>⚡</span> Temi e personalizzazione Premium</li>
                </ul>

                <button className="premium-btn primary animate-float" style={{ width: "100%", padding: "16px", fontWeight: 800 }}>Riscatta Prova Gratuita</button>
              </div>
            </div>

            {/* Comparison Table Section */}
            <div style={{ marginTop: 100, maxWidth: 800, margin: "100px auto 0" }}>
              <h3 style={{ fontSize: 24, marginBottom: 40 }}>Perché Prodigi costa meno e offre di più?</h3>
              <div className="glass-panel" style={{ padding: 0, overflow: "hidden", border: "1px solid var(--glass-border)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid var(--glass-border)" }}>
                      <th style={{ padding: "16px 20px" }}>Tool</th>
                      <th style={{ padding: "16px 20px" }}>Piano Free</th>
                      <th style={{ padding: "16px 20px" }}>Piano Pro</th>
                      <th style={{ padding: "16px 20px" }}>Focus</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,240,255,0.05)" }}>
                      <td style={{ padding: "16px 20px", fontWeight: 700, color: "var(--accent-color)" }}>Prodigi.live</td>
                      <td style={{ padding: "16px 20px" }}>€0</td>
                      <td style={{ padding: "16px 20px", fontWeight: 700 }}>€7/mese</td>
                      <td style={{ padding: "16px 20px" }}>All-in-one Creator OS</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "16px 20px" }}>Beacons</td>
                      <td style={{ padding: "16px 20px" }}>€0 (9% fee)</td>
                      <td style={{ padding: "16px 20px" }}>€10/mese</td>
                      <td style={{ padding: "16px 20px" }}>Link in bio + store</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "16px 20px" }}>Linktree</td>
                      <td style={{ padding: "16px 20px" }}>€0</td>
                      <td style={{ padding: "16px 20px" }}>€8-15/mese</td>
                      <td style={{ padding: "16px 20px" }}>Link in bio</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "16px 20px" }}>Stan Store</td>
                      <td style={{ padding: "16px 20px" }}>—</td>
                      <td style={{ padding: "16px 20px" }}>€29/mese</td>
                      <td style={{ padding: "16px 20px" }}>Digital store</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ marginTop: 24, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                <strong>Il vantaggio:</strong> Prodigi costa meno della concorrenza ma offre 10 volte di più. Non è solo un link in bio, è un intero sistema operativo intelligente per la tua carriera.
              </p>
              <div style={{ marginTop: 40 }}>
                <Link to="/pricing" style={{ color: "var(--accent-color)", textDecoration: "none", fontWeight: 600, fontSize: 16, display: "inline-flex", alignItems: "center", gap: 8 }}>
                  Scopri tutti i dettagli e FAQ <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Section (Merged from original) */}
        <section id="waitlist" style={{ padding: "100px 20px", position: "relative" }}>
          <div className="glass-panel" style={{ maxWidth: 700, margin: "0 auto", padding: 50, textAlign: "center", border: "1px solid var(--accent-color)", background: "rgba(0,240,255,0.02)" }}>
            {!submitted ? (
              <>
                <h2 className="text-gradient" style={{ fontSize: 36, marginBottom: 16, fontWeight: 800 }}>Prendi il tuo Posto in Lista</h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: 32, fontSize: 18 }}>L'accesso pubblico aprirà presto. Iscriviti ora per sbloccare i vantaggi Founder.</p>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
                  {["youtuber", "tiktoker", "instagrammer", "multi"].map((role) => (
                    <button 
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`premium-btn ${selectedRole === role ? 'primary' : 'secondary'}`}
                      style={{ textTransform: "capitalize", fontSize: 14 }}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input 
                    type="email" 
                    placeholder="La tua email migliore" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "18px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none", fontSize: 16 }}
                  />
                  {error === 'duplicate' && <p style={{ color: "#ff4d4d", fontSize: 14 }}>Sei già in lista! ✨</p>}
                  <button 
                    className="premium-btn primary" 
                    onClick={handleWaitlistSubmit} 
                    disabled={submitting}
                    style={{ width: "100%", padding: "18px", fontSize: 17, fontWeight: 700 }}
                  >
                    {submitting ? "Salvataggio..." : "Unisciti all'Accesso Anticipato ⚡"}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: "40px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
                <h2 className="text-gradient" style={{ fontSize: 32, marginBottom: 16, fontWeight: 800 }}>Benvenuto a Bordo!</h2>
                <p style={{ fontSize: 18, color: "var(--text-secondary)" }}>Ti abbiamo riservato il posto #{waitlistPosition}. Controlla la tua email, ti invieremo presto le istruzioni per l'accesso.</p>
              </div>
            )}
          </div>
        </section>
      </main>



      <footer style={{ padding: "60px 20px 40px", borderTop: "1px solid var(--glass-border)", color: "var(--text-secondary)", fontSize: 14, background: "rgba(0,0,0,0.8)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 40, paddingBottom: 40 }}>
          
          {/* Colonna 1: Brand & QR */}
          <div style={{ flex: "1 1 300px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <img 
                src="/logo.png" 
                alt="Logo" 
                style={{ width: 40, height: 40, objectFit: "contain", filter: "drop-shadow(0 0 5px var(--accent-color))" }} 
              />
              <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Creator Life OS</span>
            </div>
            <p style={{ lineHeight: 1.6, marginBottom: 24, maxWidth: 300 }}>
              L'ecosistema intelligente per creator che vogliono trasformare la propria passione in un vero business.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ display: "flex", gap: 16 }}>
                <a href="https://instagram.com/pesoinvisible" target="_blank" rel="noreferrer" style={{ fontSize: 24, textDecoration: "none" }}>📱</a>
                <a href="mailto:liveprodigi@gmail.com" style={{ fontSize: 24, textDecoration: "none" }}>✉️</a>
              </div>
              <div style={{ width: 1, height: 30, background: "rgba(255,255,255,0.1)" }} />
              <div style={{ padding: 4, background: "#fff", borderRadius: 8, width: 60, height: 60, position: "relative" }}>
                <img src="/qr-instagram.png" alt="QR" style={{ width: "100%", height: "100%", borderRadius: 4 }} />
                <div style={{ position: "absolute", bottom: -12, left: "50%", transform: "translateX(-50%)", fontSize: 8, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>SCAN ME</div>
              </div>
            </div>
          </div>

          {/* Colonna 2: Link */}
          <div style={{ flex: "1 1 150px" }}>
            <h4 style={{ color: "#fff", marginBottom: 20, fontSize: 16, fontWeight: 700 }}>Piattaforma</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="#features" style={{ color: "inherit", textDecoration: "none" }}>Caratteristiche</a>
              <Link to="/pricing" style={{ color: "inherit", textDecoration: "none" }}>Prezzi</Link>
              <Link to="/login" style={{ color: "inherit", textDecoration: "none" }}>Accedi / Registrati</Link>
            </div>
          </div>

          {/* Colonna 3: Legale */}
          <div style={{ flex: "1 1 150px" }}>
            <h4 style={{ color: "#fff", marginBottom: 20, fontSize: 16, fontWeight: 700 }}>Legale</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Link to="/termini" style={{ color: "inherit", textDecoration: "none" }}>Termini di Servizio</Link>
              <Link to="/privacy" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</Link>
              <Link to="/cookie" style={{ color: "inherit", textDecoration: "none" }}>Cookie Policy</Link>
              <a href="mailto:liveprodigi@gmail.com" style={{ color: "inherit", textDecoration: "none" }}>Gestione Dati</a>
            </div>
          </div>

        </div>
        
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)", gap: 20 }}>
          <div>Creator Life OS © {new Date().getFullYear()}</div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ padding: "4px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 20, fontSize: 12 }}>🇮🇹 Italiano</div>
            <div style={{ padding: "4px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 20, fontSize: 12 }}>€ EUR</div>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      {showCookieBanner && (
        <div style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          right: 20,
          background: "rgba(15, 15, 15, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid var(--glass-border)",
          borderRadius: 16,
          padding: "20px 24px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          zIndex: 1000,
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          maxWidth: 1000,
          margin: "0 auto"
        }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h5 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700 }}>🍪 Rispetto per la tua Privacy</h5>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Utilizziamo i cookie per migliorare la tua esperienza e analizzare il traffico. Continuando a navigare, accetti la nostra <Link to="/cookie" style={{ color: "var(--accent-color)" }}>Cookie Policy</Link>.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link to="/cookie" style={{ textDecoration: "none" }}>
              <button className="premium-btn secondary" style={{ padding: "10px 20px", fontSize: 13 }}>Scopri di più</button>
            </Link>
            <button 
              onClick={acceptCookies}
              className="premium-btn primary" 
              style={{ padding: "10px 24px", fontSize: 13 }}
            >
              Accetto tutto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
