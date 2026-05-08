import { Link } from "react-router-dom";

export default function Privacy() {
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
        <h1 className="text-gradient" style={{ fontSize: 40, marginBottom: 16 }}>Privacy Policy (GDPR)</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 40 }}>Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}</p>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>1. Titolare del Trattamento</h2>
          <p>
            Ai sensi dell'art. 13 del Regolamento (UE) 2016/679 (GDPR), ti informiamo che il Titolare del trattamento dei dati raccolti tramite l'applicazione Creator Life OS è <strong>Prodigi Digitali</strong>. Per qualsiasi comunicazione in materia di privacy, è possibile contattare il Titolare all'indirizzo email: <a href="mailto:liveprodigi@gmail.com" style={{ color: "var(--accent-color)" }}>liveprodigi@gmail.com</a>.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>2. Dati Raccolti e Finalità del Trattamento</h2>
          <p>Raccogliamo e trattiamo i seguenti dati personali:</p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 10 }}><strong>Dati di Registrazione:</strong> Indirizzo email e password (crittografata) per consentire la creazione e l'accesso all'account.</li>
            <li style={{ marginBottom: 10 }}><strong>Dati Generati dall'Utente:</strong> Note, bozze video, script, dati finanziari inseriti manualmente o generati tramite AI. Tali dati vengono salvati esclusivamente per erogare il servizio (funzionalità base della piattaforma).</li>
            <li style={{ marginBottom: 10 }}><strong>Dati di Transazione:</strong> In caso di abbonamento al piano Pro, i dettagli di pagamento vengono elaborati dai nostri partner sicuri (es. Stripe). Noi non abbiamo accesso ai numeri completi delle carte di credito.</li>
            <li style={{ marginBottom: 10 }}><strong>Dati di Navigazione e Cookie:</strong> Dati tecnici per garantire la corretta visualizzazione della PWA e analizzare in forma aggregata l'utilizzo dell'app al fine di migliorarne le performance.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>3. Base Giuridica del Trattamento</h2>
          <p>
            Il trattamento dei dati è giustificato dalle seguenti basi giuridiche:
          </p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 10 }}><strong>Esecuzione di un contratto:</strong> per fornire all'Utente le funzionalità dell'applicativo richieste (Art. 6, par. 1, lett. b GDPR).</li>
            <li style={{ marginBottom: 10 }}><strong>Consenso dell'interessato:</strong> per l'eventuale invio di newsletter promozionali o l'utilizzo di cookie non strettamente tecnici (Art. 6, par. 1, lett. a GDPR).</li>
            <li style={{ marginBottom: 10 }}><strong>Legittimo interesse:</strong> per garantire la sicurezza del sistema e prevenire frodi (Art. 6, par. 1, lett. f GDPR).</li>
          </ul>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>4. Condivisione dei Dati e Terze Parti</h2>
          <p>
            I tuoi dati non saranno mai venduti a terzi. Per garantire il funzionamento del servizio, i dati potrebbero essere condivisi con responsabili esterni nominati, tra cui:
          </p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 10 }}><strong>Supabase:</strong> Fornitore dell'infrastruttura di database e autenticazione (Hosting europeo ove configurato).</li>
            <li style={{ marginBottom: 10 }}><strong>Provider AI:</strong> Servizi di intelligenza artificiale per l'elaborazione degli script e brainstorming (le richieste inviate all'AI sono anonimizzate ove possibile).</li>
            <li style={{ marginBottom: 10 }}><strong>Stripe:</strong> Per l'elaborazione e fatturazione dei pagamenti sicuri.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>5. Diritti dell'Interessato (Art. 15-22 GDPR)</h2>
          <p>
            In qualità di utente europeo, godi dei seguenti diritti:
          </p>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ marginBottom: 10 }}><strong>Accesso:</strong> Richiedere una copia dei dati personali in nostro possesso.</li>
            <li style={{ marginBottom: 10 }}><strong>Rettifica e Cancellazione ("Diritto all'Oblio"):</strong> Modificare dati inesatti o richiederne l'eliminazione dai nostri server.</li>
            <li style={{ marginBottom: 10 }}><strong>Portabilità:</strong> Ricevere i propri dati in un formato strutturato e leggibile da dispositivo automatico (la funzione di Esportazione Backup è già integrata nell'App).</li>
            <li style={{ marginBottom: 10 }}><strong>Opposizione:</strong> Opporti al trattamento per finalità di marketing diretto.</li>
          </ul>
          <p>Per esercitare i tuoi diritti, puoi contattarci scrivendo a <a href="mailto:liveprodigi@gmail.com" style={{ color: "var(--accent-color)" }}>liveprodigi@gmail.com</a>.</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: "var(--accent-color)" }}>6. Periodo di Conservazione</h2>
          <p>
            Conserviamo i dati dell'account per l'intera durata del rapporto contrattuale. A seguito della richiesta di eliminazione dell'account (o account inattivo per oltre 24 mesi), i dati verranno rimossi in modo sicuro dai nostri sistemi operativi, fatto salvo l'adempimento di specifici obblighi normativi fiscali (conservazione fatture).
          </p>
        </section>
      </main>

      <footer style={{ padding: "40px 20px", textAlign: "center", borderTop: "1px solid var(--glass-border)", color: "var(--text-secondary)", fontSize: 14 }}>
        Creator Life OS © {new Date().getFullYear()}. Tutti i diritti riservati.
      </footer>
    </div>
  );
}
