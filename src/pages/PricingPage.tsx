import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import styles from './PricingPage.module.css';

/* ────────────────────────────────────────────
   TYPES
   ──────────────────────────────────────────── */
interface Feature {
  text: string;
  included: boolean;
  note?: string;
  highlight?: boolean;
}

interface Plan {
  name: string;
  tagline: string;
  price: { monthly: number; yearly: number };
  cta: string;
  badge?: string;
  features: Feature[];
}

/* ────────────────────────────────────────────
   DATI PIANI
   ──────────────────────────────────────────── */
const PLANS: Record<string, Plan> = {
  free: {
    name: 'Free',
    tagline: 'Per chi inizia',
    price: { monthly: 0, yearly: 0 },
    cta: 'Inizia gratis',
    features: [
      { text: 'Dashboard panoramica', included: true },
      { text: 'Calendario integrato', included: true },
      { text: 'Habit tracker', included: true, note: 'max 3 abitudini' },
      { text: 'Content pipeline', included: true, note: 'max 10 contenuti' },
      { text: 'Money tracker base', included: true, note: 'entrate/uscite' },
      { text: 'Brand deals', included: true, note: 'max 2 attivi' },
      { text: 'Journal', included: true, note: 'ultimi 30 giorni' },
      { text: 'AI Copilot', included: false },
      { text: 'AI Proposal Generator', included: false },
      { text: 'Growth Simulator', included: false },
      { text: 'Export report PDF', included: false },
      { text: 'Analytics avanzate', included: false },
      { text: 'Temi e personalizzazione', included: false },
    ],
  },
  pro: {
    name: 'Pro',
    tagline: 'Per chi fa sul serio',
    price: { monthly: 7, yearly: 59 },
    cta: 'Passa a Pro',
    badge: 'Consigliato',
    features: [
      { text: 'Dashboard panoramica', included: true },
      { text: 'Calendario integrato', included: true },
      { text: 'Abitudini illimitate + streak', included: true },
      { text: 'Pipeline contenuti illimitata', included: true },
      { text: 'Money tracker completo', included: true },
      { text: 'Brand deals illimitati', included: true },
      { text: 'Journal storico completo', included: true },
      { text: 'AI Copilot', included: true, note: 'caption, hook, script', highlight: true },
      { text: 'AI Proposal Generator', included: true, note: 'proposte brand', highlight: true },
      { text: 'Growth Simulator', included: true, note: 'proiezioni 6 mesi', highlight: true },
      { text: 'Export report PDF', included: true, highlight: true },
      { text: 'Analytics avanzate', included: true, note: 'trend e confronti', highlight: true },
      { text: 'Temi e personalizzazione', included: true, highlight: true },
    ],
  },
};

const FAQ_ITEMS = [
  {
    q: 'Posso usare Prodigi gratis per sempre?',
    a: 'Assolutamente sì. Il piano Free non ha scadenza. Puoi usare dashboard, calendario, habit tracker (3), pipeline (10 contenuti), money tracker e 2 brand deal senza mai pagare.',
  },
  {
    q: 'Posso cambiare piano in qualsiasi momento?',
    a: 'Sì, puoi passare da Free a Pro o tornare indietro quando vuoi. Se passi a Pro, il periodo inizia subito. Se torni al Free, mantieni accesso al Pro fino a fine periodo pagato.',
  },
  {
    q: 'Come funziona la prova gratuita del Pro?',
    a: 'Alla registrazione ricevi 7 giorni di Pro gratis, senza carta di credito. Dopo 7 giorni torni automaticamente al piano Free — nessun addebito.',
  },
  {
    q: 'Che metodi di pagamento accettate?',
    a: 'Carta di credito/debito (Visa, Mastercard, Amex) e PayPal. Tutti i pagamenti sono gestiti in modo sicuro tramite Stripe.',
  },
  {
    q: 'I miei dati sono al sicuro?',
    a: 'I tuoi dati sono ospitati su Supabase (infrastruttura PostgreSQL), con crittografia end-to-end. Non vendiamo né condividiamo i tuoi dati con terze parti. Mai.',
  },
];

/* ────────────────────────────────────────────
   ICONE SVG inline
   ──────────────────────────────────────────── */
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="9" fill="rgba(0,230,118,0.15)" />
    <path d="M5.5 9.5l2 2 5-5" stroke="#00e676" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="9" fill="rgba(255,255,255,0.05)" />
    <rect x="6" y="8" width="6" height="5" rx="1" stroke="#555" strokeWidth="1.2" />
    <path d="M7.5 8V6.5a1.5 1.5 0 013 0V8" stroke="#555" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="9" fill="var(--accent-glow)" />
    <path d="M5.5 9.5l2 2 5-5" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ────────────────────────────────────────────
   FAQ ACCORDION
   ──────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.faqItem}>
      <button className={styles.faqQuestion} onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{q}</span>
        <span className={`${styles.faqArrow} ${open ? styles.faqArrowOpen : ''}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div className={`${styles.faqAnswer} ${open ? styles.faqAnswerOpen : ''}`}>
        <p>{a}</p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   COMPONENTE PRINCIPALE
   ──────────────────────────────────────────── */
export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const navigate = useNavigate();

  const monthlyPrice = yearly
    ? (PLANS.pro.price.yearly / 12).toFixed(1).replace('.', ',')
    : PLANS.pro.price.monthly;

  const savings = yearly
    ? Math.round(100 - (PLANS.pro.price.yearly / (PLANS.pro.price.monthly * 12)) * 100)
    : 0;

  const handleCta = async (plan: string) => {
    if (plan === 'free') {
      navigate('/login');
      return;
    }

    const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey) {
      alert("Configurazione Stripe mancante. Contatta il supporto.");
      return;
    }

    // Per il Pro, avvia Stripe Checkout
    try {
      if (!supabase) throw new Error("Supabase non configurato");
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login?redirect=pricing');
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ billing: yearly ? 'yearly' : 'monthly' }),
        }
      );

      const { url, error } = await res.json();
      if (error) throw new Error(error);
      
      window.location.href = url; // Redirect a Stripe
    } catch (err: any) {
      alert("Errore durante il checkout: " + err.message);
    }
  };

  return (
    <div className={styles.pricing}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo} onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src="/logo.png" 
              alt="Prodigi Logo" 
              style={{ 
                width: 32, 
                height: 32, 
                objectFit: "contain",
                filter: "drop-shadow(0 0 8px var(--accent-color))"
              }} 
            />
            <span className="text-gradient" style={{ fontSize: '1.2rem', fontWeight: 800 }}>Creator Life OS</span>
          </div>
          <button className={styles.navBack} onClick={() => navigate('/')}>
            Torna alla home
          </button>
        </div>
      </nav>

      {/* HEADER */}
      <section className={styles.header}>
        <div className={styles.headerOrb} />
        <p className={styles.headerTag}>Pricing</p>
        <h1 className={styles.headerTitle}>
          Scegli il piano giusto per <span className={styles.highlight}>te</span>
        </h1>
        <p className={styles.headerSub}>
          Inizia gratis, passa a Pro quando sei pronto. Nessun vincolo, nessuna sorpresa.
        </p>

        {/* TOGGLE */}
        <div className={styles.toggleWrap}>
          <span className={!yearly ? styles.toggleActive : styles.toggleInactive}>Mensile</span>
          <button
            className={styles.toggle}
            onClick={() => setYearly(!yearly)}
            aria-label="Cambia tra mensile e annuale"
          >
            <span className={`${styles.toggleKnob} ${yearly ? styles.toggleKnobRight : ''}`} />
          </button>
          <span className={yearly ? styles.toggleActive : styles.toggleInactive}>
            Annuale
            <span className={styles.saveBadge}>-{savings || 25}%</span>
          </span>
        </div>
      </section>

      {/* PLANS */}
      <section className={styles.plansSection}>
        <div className={styles.plansGrid}>
          {/* FREE */}
          <div className={styles.planCard}>
            <div className={styles.planHeader}>
              <p className={styles.planName}>{PLANS.free.name}</p>
              <p className={styles.planTagline}>{PLANS.free.tagline}</p>
              <div className={styles.planPriceRow}>
                <span className={styles.planPrice}>0€</span>
                <span className={styles.planPeriod}>/ per sempre</span>
              </div>
            </div>
            <button className={styles.ctaFree} onClick={() => handleCta('free')}>
              {PLANS.free.cta}
            </button>
            <ul className={styles.featureList}>
              {PLANS.free.features.map((f) => (
                <li key={f.text} className={f.included ? '' : styles.featureDisabled}>
                  {f.included ? <CheckIcon /> : <LockIcon />}
                  <span>
                    {f.text}
                    {f.note && <span className={styles.featureNote}> — {f.note}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* PRO */}
          <div className={`${styles.planCard} ${styles.planCardPro}`}>
            {PLANS.pro.badge && <div className={styles.proBadge}>{PLANS.pro.badge}</div>}
            <div className={styles.proGlow} />
            <div className={styles.planHeader}>
              <p className={styles.planName}>{PLANS.pro.name}</p>
              <p className={styles.planTagline}>{PLANS.pro.tagline}</p>
              <div className={styles.planPriceRow}>
                <span className={styles.planPrice}>
                  {yearly ? `${monthlyPrice}€` : `${PLANS.pro.price.monthly}€`}
                </span>
                <span className={styles.planPeriod}>/ mese</span>
              </div>
              {yearly && (
                <p className={styles.planBilled}>
                  Fatturato {PLANS.pro.price.yearly}€/anno
                </p>
              )}
            </div>
            <button className={styles.ctaPro} onClick={() => handleCta('pro')}>
              {PLANS.pro.cta}
            </button>
            <p className={styles.trialNote}>7 giorni gratis, senza carta</p>
            <ul className={styles.featureList}>
              {PLANS.pro.features.map((f) => (
                <li key={f.text}>
                  {f.highlight ? <StarIcon /> : <CheckIcon />}
                  <span className={f.highlight ? styles.featureHighlight : ''}>
                    {f.text}
                    {f.note && <span className={styles.featureNote}> — {f.note}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* COMPARISON STRIP */}
      <section className={styles.compSection}>
        <div className={styles.container}>
          <p className={styles.compTitle}>Quanto costa rispetto agli altri?</p>
          <div className={styles.compGrid}>
            <div className={styles.compItem}>
              <span className={styles.compName}>Prodigi Pro</span>
              <div className={styles.compBar} style={{ width: '24%' }} />
              <span className={styles.compPrice}>7€</span>
            </div>
            <div className={styles.compItem}>
              <span className={styles.compName}>Linktree Pro</span>
              <div className={styles.compBarGray} style={{ width: '35%' }} />
              <span className={styles.compPrice}>15€</span>
            </div>
            <div className={styles.compItem}>
              <span className={styles.compName}>Stan Store</span>
              <div className={styles.compBarGray} style={{ width: '100%' }} />
              <span className={styles.compPrice}>29€</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <p className={styles.faqTitle}>Domande frequenti</p>
          <div className={styles.faqList}>
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className={styles.bottomCta}>
        <div className={styles.container} style={{ textAlign: 'center' }}>
          <h2 className={styles.bottomTitle}>Pronto a prendere il controllo?</h2>
          <p className={styles.bottomSub}>
            Unisciti ai creator che stanno già usando Prodigi per crescere ogni giorno.
          </p>
          <button className={styles.ctaPro} onClick={() => handleCta('free')} style={{ display: 'inline-block', width: 'auto', padding: '16px 48px' }}>
            Inizia gratis
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={`${styles.logo} ${styles.centered}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <img 
              src="/logo.png" 
              alt="Prodigi Logo" 
              style={{ 
                width: 32, 
                height: 32, 
                objectFit: "contain",
                filter: "drop-shadow(0 0 5px var(--accent-color))"
              }} 
            />
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Creator Life OS</span>
          </div>
          <p>Creator Life OS v1.0 — Prodigi Digitali &copy; 2026</p>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 20, fontSize: '0.8rem' }}>
            <Link to="/termini" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Termini</Link>
            <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy</Link>
            <Link to="/cookie" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Cookie</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
