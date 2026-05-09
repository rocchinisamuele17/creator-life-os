import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

export function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!supabase) {
      const missing = [];
      if (!import.meta.env.VITE_SUPABASE_URL) missing.push("URL");
      if (!import.meta.env.VITE_SUPABASE_ANON_KEY) missing.push("Anon Key");
      setError(`Configurazione incompleta: manca ${missing.join(" e ")}. Controlla Vercel!`);
      setLoading(false);
      return;
    }

    if (isSignUp) {
      const err = await signUp(email, password);
      if (err) {
        setError(err);
      } else {
        setSuccess("Account creato! Ora puoi accedere.");
        setIsSignUp(false);
      }
    } else {
      const err = await signIn(email, password);
      if (err) setError(err);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#050505",
        backgroundImage: "url('/bg-dark-neon.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative"
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 0 }} />
      <div
        className="glass-panel animate-float"
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 40,
          zIndex: 1,
          background: "rgba(10,10,10,0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0, 240, 255, 0.2)"
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 30,
              justifyContent: "center",
            }}
          >
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
              }}
            >
              ⚡
            </div>
            <div>
              <div className="text-gradient" style={{ fontSize: 20, fontWeight: 800 }}>
                Creator Life OS
              </div>
            </div>
          </div>
        </Link>

        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#fff",
            margin: "0 0 8px",
            textAlign: "center",
          }}
        >
          {isSignUp ? "Registrazione Piattaforma" : "Non è mai stato così semplice gestire la tua crescita personale"}
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            textAlign: "center",
            margin: "0 0 30px",
            lineHeight: 1.5,
          }}
        >
          {isSignUp
            ? "Crea il tuo account per configurare il tuo ecosistema digitale."
            : "Inserisci le tue credenziali per gestire le tue attività."}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: 1,
                display: "block",
                marginBottom: 8,
                fontWeight: 600
              }}
            >
              Indirizzo Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid var(--glass-border)",
                background: "rgba(0,0,0,0.3)",
                color: "#fff",
                fontSize: 14,
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
                transition: "all 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent-color)"}
              onBlur={(e) => e.target.style.borderColor = "var(--glass-border)"}
              placeholder="es. creator@gmail.com"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: 1,
                display: "block",
                marginBottom: 8,
                fontWeight: 600
              }}
            >
              Password (Sicura)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid var(--glass-border)",
                background: "rgba(0,0,0,0.3)",
                color: "#fff",
                fontSize: 14,
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
                transition: "all 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent-color)"}
              onBlur={(e) => e.target.style.borderColor = "var(--glass-border)"}
              placeholder="Min. 6 caratteri"
            />
          </div>

          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 16,
                fontSize: 13,
                color: "#ff6b6b",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.3)",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 16,
                fontSize: 13,
                color: "#4ade80",
              }}
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="premium-btn"
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "var(--glass-bg)" : "var(--accent-gradient)",
              color: loading ? "var(--text-secondary)" : "#000",
              fontSize: 15,
              fontWeight: 700,
              border: "none",
            }}
          >
            {loading
              ? "Elaborazione in corso..."
              : isSignUp
                ? "Conferma Iscrizione"
                : "Accedi al Sistema"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 24,
            fontSize: 14,
            color: "var(--text-secondary)",
          }}
        >
          <span>{isSignUp ? "Sei già registrato?" : "Prima volta?"}</span>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setSuccess(null);
            }}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "var(--accent-color)",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "inherit",
              textDecoration: "underline",
              textUnderlineOffset: 4
            }}
          >
            {isSignUp ? "Accedi" : "Registrati e Inizia"}
          </button>
        </div>
      </div>
    </div>
  );
}
