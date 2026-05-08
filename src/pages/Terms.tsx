import { Link } from "react-router-dom";

export default function Terms() {
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
        <h1 className="text-gradient" style={{ fontSize: 40, marginBottom: 16 }}>Termini e Condizioni di Servizio</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 40 }}>Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}</p>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>1. Premessa e Accettazione</h2>
          <p>
            I presenti Termini e Condizioni (di seguito, i "Termini") disciplinano l'utilizzo dell'applicazione web "Creator Life OS" e dei relativi servizi (il "Servizio") offerti da Prodigi Digitali. 
            Registrandosi, accedendo o utilizzando il Servizio, l'Utente accetta incondizionatamente di essere vincolato ai presenti Termini. Qualora l'Utente non accetti i Termini, è pregato di non utilizzare il Servizio.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>2. Descrizione del Servizio (SaaS)</h2>
          <p>
            Creator Life OS è una piattaforma Software as a Service (SaaS) progettata per supportare i Content Creator nella gestione delle proprie attività, inclusi ma non limitati a: simulazione visiva dei contenuti, tracciamento finanziario, pianificazione tramite Intelligenza Artificiale (AI) e gestione di accordi con i brand.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>3. Abbonamenti e Fatturazione</h2>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 10 }}><strong>Modello di Pagamento:</strong> L'accesso alle funzionalità "Pro" del Servizio è soggetto al pagamento di un abbonamento mensile o annuale (attualmente proposto a €6,99/mese).</li>
            <li style={{ marginBottom: 10 }}><strong>Rinnovo Automatico:</strong> Salvo disdetta, l'abbonamento si rinnova automaticamente al termine del periodo di fatturazione. L'Utente può annullare l'abbonamento in qualsiasi momento tramite le impostazioni dell'account.</li>
            <li style={{ marginBottom: 10 }}><strong>Metodi di Pagamento:</strong> Utilizziamo gateway di pagamento sicuri (es. Stripe) conformi agli standard PCI-DSS. Prodigi Digitali non memorizza direttamente i dati completi della carta di credito.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>4. Proprietà Intellettuale</h2>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 10 }}><strong>Licenza d'Uso:</strong> Prodigi Digitali concede all'Utente una licenza limitata, non esclusiva e non trasferibile per accedere e utilizzare il Servizio per scopi personali o commerciali legati alla propria attività di creator.</li>
            <li style={{ marginBottom: 10 }}><strong>Dati dell'Utente:</strong> L'Utente mantiene tutti i diritti, titoli e interessi sui contenuti (testi, immagini, video, metriche finanziarie) inseriti nel Servizio ("User Generated Content").</li>
            <li style={{ marginBottom: 10 }}><strong>Proprietà del Software:</strong> Codice, design, algoritmi, e architettura di Creator Life OS rimangentodi proprietà esclusiva di Prodigi Digitali.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>5. Funzionalità di Intelligenza Artificiale (AI)</h2>
          <p>
            Il Servizio integra funzionalità di Intelligenza Artificiale generativa. L'Utente riconosce che:
          </p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 10 }}>I risultati generati dall'AI (script, idee, email) sono forniti "così come sono" e potrebbero richiedere revisione umana prima dell'utilizzo.</li>
            <li style={{ marginBottom: 10 }}>Prodigi Digitali non garantisce metriche di successo (es. viralità, chiusura di contratti con brand) derivanti dall'utilizzo degli output generati dall'AI.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>6. Limitazione di Responsabilità</h2>
          <p>
            Nella misura massima consentita dalla legge applicabile, Prodigi Digitali non sarà responsabile per danni diretti, indiretti, incidentali, speciali o consequenziali (inclusa la perdita di profitti, dati o opportunità di business) derivanti dall'uso o dall'impossibilità di usare il Servizio.
            Il servizio viene fornito "AS IS" (così com'è) senza garanzie implicite o esplicite di continuità assoluta, esente da bug.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>7. Legge Applicabile e Foro Competente</h2>
          <p>
            I presenti Termini sono regolati dalla Legge Italiana. Qualsiasi controversia inerente all'interpretazione, validità, esecuzione o risoluzione dei presenti Termini sarà devoluta alla competenza esclusiva del Foro italiano.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>8. Modifiche ai Termini</h2>
          <p>
            Prodigi Digitali si riserva il diritto di modificare questi Termini in qualsiasi momento. Le modifiche sostanziali verranno comunicate all'Utente via email o tramite avviso sulla piattaforma con almeno 15 giorni di preavviso prima dell'entrata in vigore.
          </p>
        </section>

        <div style={{ marginTop: 60, padding: 20, background: "rgba(255,255,255,0.05)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
          Per qualsiasi domanda relativa ai presenti Termini, puoi contattarci all'indirizzo: <a href="mailto:liveprodigi@gmail.com" style={{ color: "var(--accent-color)" }}>liveprodigi@gmail.com</a>.
        </div>
      </main>

      <footer style={{ padding: "40px 20px", textAlign: "center", borderTop: "1px solid var(--glass-border)", color: "var(--text-secondary)", fontSize: 14 }}>
        Creator Life OS © {new Date().getFullYear()}. Tutti i diritti riservati.
      </footer>
    </div>
  );
}
