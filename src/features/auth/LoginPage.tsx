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
      setError("Errore: Il database non risponde. Verifica le chiavi su Vercel.");
      setLoading(false);
      return;
    }

    try {
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
    } catch (err: any) {
      setError("Errore di rete o configurazione. Riprova tra poco.");
    } finally {
      setLoading(false);
    }
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
        position: "relative"
      }}
    >
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
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30, justifyContent: "center" }}>
            <div className="animate-glow" style={{ width: 36, height: 36, borderRadius: 8, background: "var(--accent-gradient)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
            <span className="text-gradient" style={{ fontSize: 20, fontWeight: 800 }}>Creator Life OS</span>
          </div>
        </Link>

        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 8px", textAlign: "center" }}>
          {isSignUp ? "Registrazione" : "Accedi al Sistema"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.3)", color: "#fff" }}
              placeholder="es. creator@gmail.com"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.3)", color: "#fff" }}
              placeholder="******"
            />
          </div>

          {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px", marginBottom: 16, fontSize: 13, color: "#ff6b6b" }}>{error}</div>}
          {success && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "10px", marginBottom: 16, fontSize: 13, color: "#4ade80" }}>{success}</div>}

          <button
            type="submit"
            disabled={loading}
            className="premium-btn"
            style={{ width: "100%", padding: "14px", background: loading ? "var(--glass-bg)" : "var(--accent-gradient)", color: loading ? "var(--text-secondary)" : "#000", fontWeight: 700, border: "none" }}
          >
            {loading ? "Caricamento..." : isSignUp ? "Registrati" : "Accedi"}
          </button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          style={{ background: "none", border: "none", color: "var(--accent-color)", width: "100%", marginTop: 20, cursor: "pointer", fontSize: 14 }}
        >
          {isSignUp ? "Hai già un account? Accedi" : "Nuovo qui? Crea account"}
        </button>
      </div>
    </div>
  );
}
