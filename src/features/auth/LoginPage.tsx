import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { supabase } from '../../lib/supabase';

export function LoginPage() {
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
        setSuccess('Account creato! Controlla la tua email per confermare.');
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
      setError(err.message || 'Errore di autenticazione.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.orbTop} />
      <div className={styles.orbBottom} />
      <div className={styles.gridOverlay} />
      <div className={styles.grain} />

      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoDot} />
          prodigi.live
        </Link>
      </nav>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardGlow} />

          <div className={styles.cardHeader}>
            <div className={styles.iconWrap}>
              <img src="/logo.png" alt="Logo" style={{ width: 32, height: 32, filter: "drop-shadow(0 0 5px #00f0ff) hue-rotate(180deg)" }} />
            </div>

            <h1 className={styles.title}>
              {isRegister ? 'Crea Account' : 'Bentornato'}
            </h1>
            <p className={styles.subtitle}>
              {isRegister ? 'Unisciti ai creator' : 'Accedi al tuo ecosistema'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={`${styles.inputGroup} ${focusedField === 'email' ? styles.inputFocused : ''}`}>
              <label className={styles.label}>Email</label>
              <div className={styles.inputWrap}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="tu@esempio.com"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={`${styles.inputGroup} ${focusedField === 'password' ? styles.inputFocused : ''}`}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="La tua password"
                  className={styles.input}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className={styles.eyeBtn}
                >
                  {showPw ? '👁️' : '🔒'}
                </button>
              </div>
            </div>

            {error && <div className={styles.alertError}>{error}</div>}
            {success && <div className={styles.alertSuccess}>{success}</div>}

            <button type="submit" className={styles.cta} disabled={loading}>
              <span className={styles.ctaText}>
                {loading ? 'Attendi...' : isRegister ? 'Registrati' : 'Accedi'}
              </span>
            </button>
          </form>

          <div className={styles.toggle}>
            <span className={styles.toggleText}>{isRegister ? 'Hai un account?' : 'Non hai un account?'}</span>
            <button
              onClick={() => { setIsRegister(!isRegister); setError(null); setSuccess(null); }}
              className={styles.toggleBtn}
            >
              {isRegister ? 'Accedi' : 'Registrati'}
            </button>
          </div>

          <div className={styles.divider}><span>oppure</span></div>
          <Link to="/" className={styles.backLink}>Torna alla home</Link>
        </div>
        <p className={styles.footer}>Prodigi Digitali © 2026</p>
      </main>
    </div>
  );
}

export default LoginPage;
