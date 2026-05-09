import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { supabase } from '../../lib/supabase';

/* ────────────────────────────────────────────
   ICONE SVG inline
   ──────────────────────────────────────────── */
const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 6L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

/* ────────────────────────────────────────────
   COMPONENTE LOGIN
   ──────────────────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isRegister) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setSuccess('Account creato! Controlla la tua email per confermare, poi accedi.');
        setIsRegister(false);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate('/');
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      setError(err.message || 'Errore durante l\'autenticazione. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Effetti background */}
      <div className={styles.orbTop} />
      <div className={styles.orbBottom} />
      <div className={styles.gridOverlay} />
      <div className={styles.grain} />

      {/* Nav minima */}
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoDot} />
          prodigi.live
        </Link>
      </nav>

      {/* Card login */}
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardGlow} />

          {/* Header */}
          <div className={styles.cardHeader}>
            <div className={styles.iconWrap}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeLinecap="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h1 className={styles.title}>
              {isRegister ? 'Crea il tuo account' : 'Bentornato, creator'}
            </h1>
            <p className={styles.subtitle}>
              {isRegister
                ? 'Unisciti alla community di creator che crescono ogni giorno'
                : 'Accedi al tuo ecosistema personale'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Email */}
            <div className={`${styles.inputGroup} ${focusedField === 'email' ? styles.inputFocused : ''}`}>
              <label className={styles.label}>Email</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}><MailIcon /></span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="tu@esempio.com"
                  className={styles.input}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className={`${styles.inputGroup} ${focusedField === 'password' ? styles.inputFocused : ''}`}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}><LockIcon /></span>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="La tua password"
                  className={styles.input}
                  required
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className={styles.eyeBtn}
                  tabIndex={-1}
                  aria-label={showPw ? 'Nascondi password' : 'Mostra password'}
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            {/* Messaggi errore/successo */}
            {error && (
              <div className={styles.alertError}>
                <span className={styles.alertIcon}>!</span>
                {error}
              </div>
            )}
            {success && (
              <div className={styles.alertSuccess}>
                <span className={styles.alertIcon}>✓</span>
                {success}
              </div>
            )}

            {/* CTA */}
            <button type="submit" className={styles.cta} disabled={loading}>
              <span className={styles.ctaText}>
                {loading ? 'Attendi...' : isRegister ? 'Crea Account' : 'Accedi'}
              </span>
              {!loading && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
              {loading && <span className={styles.spinner} />}
            </button>
          </form>

          {/* Toggle login/register */}
          <div className={styles.toggle}>
            <span className={styles.toggleText}>
              {isRegister ? 'Hai gia un account?' : 'Non hai un account?'}
            </span>
            <button
              onClick={() => { setIsRegister(!isRegister); setError(null); setSuccess(null); }}
              className={styles.toggleBtn}
            >
              {isRegister ? 'Accedi' : 'Registrati'}
            </button>
          </div>

          {/* Divider */}
          <div className={styles.divider}>
            <span>oppure</span>
          </div>

          {/* Back to home */}
          <Link to="/" className={styles.backLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Torna alla home
          </Link>
        </div>

        {/* Footer */}
        <p className={styles.footer}>
          Prodigi Digitali &copy; {new Date().getFullYear()} &middot; Creator Life OS
        </p>
      </main>
    </div>
  );
}
