import { Link } from "react-router-dom";

export default function Cookies() {
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", background: "#050505", color: "#fff", width: "100%" }}>
      <nav className="landing-nav" style={{ borderBottom: "1px solid var(--glass-border)" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "#fff" }}>
          <div className="animate-glow" style={{ width: 36, height: 36, borderRadius: 8, background: "var(--accent-gradient)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
          <span className="text-gradient" style={{ fontSize: 20, fontWeight: 800 }}>Creator Life OS</span>
        </Link>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <button className="premium-btn primary" style={{ fontSize: 14 }}>Accedi</button>
        </Link>
      </nav>

      <main style={{ flex: 1, padding: "80px 20px", maxWidth: 800, margin: "0 auto", width: "100%", lineHeight: 1.8 }}>
        <h1 className="text-gradient" style={{ fontSize: 40, marginBottom: 16 }}>Cookie Policy</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 40 }}>Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}</p>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>1. Cosa sono i Cookie</h2>
          <p>
            I cookie sono piccoli file di testo che i siti visitati dall'utente inviano al suo terminale (solitamente al browser), dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla successiva visita del medesimo utente. Nel corso della navigazione su un sito, l'utente può ricevere sul suo terminale anche cookie di siti o di web server diversi (c.d. cookie di "terze parti").
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>2. Tipologie di Cookie utilizzati</h2>
          <p>Creator Life OS utilizza le seguenti categorie di cookie:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 10 }}><strong>Cookie Tecnici (Strettamente necessari):</strong> Questi cookie sono essenziali per il corretto funzionamento dell'applicazione. Includono, ad esempio, i cookie che permettono di accedere ad aree protette dell'app (autenticazione tramite Supabase) o di mantenere le preferenze di visualizzazione (es. Dark Mode). Senza questi cookie, il servizio non potrebbe essere fornito.</li>
            <li style={{ marginBottom: 10 }}><strong>Cookie di Funzionalità:</strong> Permettono all'app di ricordare le scelte effettuate dall'utente (come il nome utente, la lingua o la regione) e forniscono funzionalità avanzate e personalizzate.</li>
            <li style={{ marginBottom: 10 }}><strong>Cookie Analitici:</strong> Utilizziamo questi cookie per raccogliere informazioni in forma anonima e aggregata sull'utilizzo della piattaforma, al fine di produrre statistiche sulle pagine più visitate e sull'efficacia delle nostre funzionalità AI.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>3. Cookie di Terze Parti</h2>
          <p>
            L'utilizzo del Servizio può comportare l'installazione di cookie da parte di terzi. Tra questi:
          </p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 10 }}><strong>Supabase / Google / Meta:</strong> Per i sistemi di autenticazione e sicurezza.</li>
            <li style={{ marginBottom: 10 }}><strong>Stripe:</strong> Per la prevenzione delle frodi e la gestione dei pagamenti sicuri.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>4. Gestione dei Cookie</h2>
          <p>
            L'utente può decidere se accettare o meno i cookie utilizzando le impostazioni del proprio browser. La disabilitazione dei cookie "tecnici" può compromettere l'utilizzo delle funzionalità dell'applicazione. 
          </p>
          <p>Puoi trovare informazioni su come gestire i Cookie nei browser più diffusi ai seguenti indirizzi:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li>Google Chrome</li>
            <li>Mozilla Firefox</li>
            <li>Apple Safari</li>
            <li>Microsoft Edge</li>
          </ul>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>5. Consenso</h2>
          <p>
            Utilizzando il nostro sito, acconsenti all'uso dei cookie in conformità con la presente Cookie Policy. Alla tua prima visita, ti verrà presentato un banner informativo per la gestione dei consensi.
          </p>
        </section>

        <div style={{ marginTop: 60, padding: 20, background: "rgba(255,255,255,0.05)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
          Per ulteriori dettagli sulla protezione dei dati, consulta la nostra <Link to="/privacy" style={{ color: "var(--accent-color)" }}>Privacy Policy</Link>.
        </div>
      </main>

      <footer style={{ padding: "40px 20px", textAlign: "center", borderTop: "1px solid var(--glass-border)", color: "var(--text-secondary)", fontSize: 14 }}>
        Creator Life OS © {new Date().getFullYear()}. Tutti i diritti riservati.
      </footer>
    </div>
  );
}
