import { useState, useId } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const emailId = useId();
  const passwordId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

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
        padding: 16,
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: 400,
          padding: "clamp(24px, 5vw, 40px)",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }} aria-label="Torna alla home">
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
              aria-hidden="true"
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

        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#fff",
            margin: "0 0 8px",
            textAlign: "center",
          }}
        >
          {isSignUp ? "Inizia il tuo viaggio" : "Bentornato, Creator"}
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            textAlign: "center",
            margin: "0 0 30px",
          }}
        >
          {isSignUp
            ? "Iscriviti per salvare e sincronizzare tutte le tue attività"
            : "Il tuo sistema operativo ti aspetta"}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor={emailId}
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: 1,
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Indirizzo Email
            </label>
            <input
              id={emailId}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid var(--glass-border)",
                background: "rgba(0,0,0,0.3)",
                color: "#fff",
                fontSize: 16,
                fontFamily: "inherit",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
                minHeight: 48,
              }}
              placeholder="es. creator@gmail.com"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor={passwordId}
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: 1,
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Password (Sicura)
            </label>
            <input
              id={passwordId}
              type="password"
              required
              minLength={6}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid var(--glass-border)",
                background: "rgba(0,0,0,0.3)",
                color: "#fff",
                fontSize: 16,
                fontFamily: "inherit",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
                minHeight: 48,
              }}
              placeholder="Min. 6 caratteri"
            />
          </div>

          {error && (
            <div
              role="alert"
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
              role="status"
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
              minHeight: 48,
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
            textAlign: "center",
            marginTop: 24,
            fontSize: 14,
            color: "var(--text-secondary)",
          }}
        >
          {isSignUp ? "Sei già registrato?" : "Prima volta?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setSuccess(null);
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-color)",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "inherit",
              padding: "8px 4px",
              minHeight: 44,
            }}
          >
            {isSignUp ? "Accedi" : "Registrati e Inizia"}
          </button>
        </div>
      </div>
    </div>
  );
}
