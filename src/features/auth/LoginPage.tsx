import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card } from "../../components/ui/Card";

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

    if (isSignUp) {
      const err = await signUp(email, password);
      if (err) {
        setError(err);
      } else {
        setSuccess("Account creato! Controlla la tua email per confermare.");
      }
    } else {
      const err = await signIn(email, password);
      if (err) setError(err);
    }

    setLoading(false);
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: 10,
    fontWeight: 700,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    display: "block",
    marginBottom: 6,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border-subtle)",
    background: "var(--bg-surface)",
    color: "var(--text-primary)",
    fontSize: 14,
    fontFamily: "var(--font-body)",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, background 0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-deep)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-body)",
        padding: 20,
      }}
    >
      <div
        className="stagger-in"
        style={{ width: "100%", maxWidth: 400 }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: -1,
              background: "linear-gradient(135deg, var(--accent-light), var(--accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "none",
              filter: "drop-shadow(0 0 20px var(--accent-glow))",
            }}
          >
            Creator Life OS
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            PRODIGI DIGITALI
          </div>
        </div>

        <Card glow="var(--accent)" style={{ padding: 32 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 800,
              color: "var(--text-primary)",
              margin: "0 0 4px",
              textAlign: "center",
              letterSpacing: -0.3,
            }}
          >
            {isSignUp ? "Crea Account" : "Bentornato"}
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              textAlign: "center",
              margin: "0 0 28px",
            }}
          >
            {isSignUp
              ? "Registrati per sincronizzare i tuoi dati"
              : "I tuoi dati ti aspettano"}
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="tu@email.com"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.background = "var(--bg-surface-hover)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-subtle)";
                  e.currentTarget.style.background = "var(--bg-surface)";
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                placeholder="Min. 6 caratteri"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.background = "var(--bg-surface-hover)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-subtle)";
                  e.currentTarget.style.background = "var(--bg-surface)";
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  background: "var(--danger-muted)",
                  border: "1px solid rgba(244, 63, 94, 0.25)",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 14px",
                  marginBottom: 16,
                  fontSize: 12,
                  color: "var(--danger)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                style={{
                  background: "var(--success-muted)",
                  border: "1px solid rgba(52, 211, 153, 0.25)",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 14px",
                  marginBottom: 16,
                  fontSize: 12,
                  color: "var(--success)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: "var(--radius-sm)",
                border: "1px solid transparent",
                background: loading
                  ? "var(--accent-muted)"
                  : "linear-gradient(135deg, var(--accent-light), var(--accent))",
                color: loading ? "var(--text-muted)" : "var(--bg-deep)",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                letterSpacing: 0.5,
                cursor: loading ? "default" : "pointer",
                transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                boxShadow: loading
                  ? "none"
                  : "0 0 20px rgba(229, 166, 59, 0.2)",
              }}
            >
              {loading
                ? "Caricamento..."
                : isSignUp
                  ? "Crea Account"
                  : "Accedi"}
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            {isSignUp ? "Hai già un account?" : "Non hai un account?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent)",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                textDecoration: "none",
                borderBottom: "1px solid var(--accent-muted)",
                paddingBottom: 1,
              }}
            >
              {isSignUp ? "Accedi" : "Registrati"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
