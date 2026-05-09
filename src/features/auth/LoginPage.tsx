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
      setError("Il database non è collegato. Controlla le chiavi su Vercel.");
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
      setError("Errore di connessione. Verifica la tua rete o l'URL di Supabase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#050505", color: "#fff", fontFamily: "sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: 40, background: "#111", borderRadius: 12, border: "1px solid #333", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
            <span style={{ fontSize: 24, fontWeight: "bold", background: "linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Creator Life OS</span>
        </div>
        
        <h2 style={{ textAlign: "center", marginBottom: 10, fontSize: 20 }}>{isSignUp ? "Nuova Registrazione" : "Accesso Area Riservata"}</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 5 }}>EMAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: 12, background: "#000", border: "1px solid #444", borderRadius: 6, color: "#fff", outline: "none" }} required />
          </div>
          <div style={{ marginBottom: 25 }}>
            <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 5 }}>PASSWORD</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: 12, background: "#000", border: "1px solid #444", borderRadius: 6, color: "#fff", outline: "none" }} required />
          </div>
          
          {error && <div style={{ color: "#ff4444", fontSize: 13, marginBottom: 15, padding: 10, background: "rgba(255,68,68,0.1)", borderRadius: 6, border: "1px solid rgba(255,68,68,0.2)" }}>{error}</div>}
          {success && <div style={{ color: "#00ff44", fontSize: 13, marginBottom: 15, padding: 10, background: "rgba(0,255,68,0.1)", borderRadius: 6, border: "1px solid rgba(0,255,68,0.2)" }}>{success}</div>}
          
          <button type="submit" disabled={loading} style={{ width: "100%", padding: 14, background: "linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)", border: "none", borderRadius: 6, color: "#000", fontWeight: "bold", cursor: "pointer", fontSize: 15 }}>
            {loading ? "ATTENDI..." : isSignUp ? "REGISTRATI" : "ACCEDI ORA"}
          </button>
        </form>
        
        <div style={{ marginTop: 20, textAlign: "center", fontSize: 14 }}>
          <button onClick={() => setIsSignUp(!isSignUp)} style={{ background: "none", border: "none", color: "#00f0ff", cursor: "pointer", textDecoration: "underline" }}>
            {isSignUp ? "Hai già un account? Accedi" : "Non hai un account? Registrati"}
          </button>
        </div>
        
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Link to="/" style={{ color: "#666", fontSize: 12 }}>Torna alla Home</Link>
        </div>
      </div>
    </div>
  );
}
