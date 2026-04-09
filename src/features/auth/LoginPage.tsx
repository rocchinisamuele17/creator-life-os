import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', -apple-system, sans-serif",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 28,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            ⚡
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
              Creator Life OS
            </div>
          </div>
        </div>

        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 6px",
            textAlign: "center",
          }}
        >
          {isSignUp ? "Crea Account" : "Accedi"}
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.4)",
            textAlign: "center",
            margin: "0 0 24px",
          }}
        >
          {isSignUp
            ? "Registrati per sincronizzare i tuoi dati"
            : "I tuoi dati ti aspettano"}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                display: "block",
                marginBottom: 4,
              }}
            >
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                fontSize: 14,
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
              }}
              placeholder="tu@email.com"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                display: "block",
                marginBottom: 4,
              }}
            >
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                fontSize: 14,
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
              }}
              placeholder="Min. 6 caratteri"
            />
          </div>

          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 8,
                padding: "8px 12px",
                marginBottom: 14,
                fontSize: 12,
                color: "#ef4444",
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
                padding: "8px 12px",
                marginBottom: 14,
                fontSize: 12,
                color: "#10b981",
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
              padding: "12px",
              borderRadius: 8,
              border: "none",
              background: loading
                ? "rgba(249,115,22,0.5)"
                : "linear-gradient(135deg, #f97316, #ea580c)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              fontFamily: "inherit",
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
            marginTop: 16,
            fontSize: 13,
            color: "rgba(255,255,255,0.4)",
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
              color: "#f97316",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "inherit",
              textDecoration: "underline",
            }}
          >
            {isSignUp ? "Accedi" : "Registrati"}
          </button>
        </div>
      </div>
    </div>
  );
}
