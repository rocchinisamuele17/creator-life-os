import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { supabase } from "../../lib/supabase";
import { isAdmin as checkIsAdmin } from "../../lib/admin";


interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      if (!user) return;
      const isAdmin = checkIsAdmin(user.email);

      if (!isAdmin) {
        setLoading(false);
        return;
      }

      try {
        const sessionResponse = await supabase?.auth.getSession();
        const token = sessionResponse?.data?.session?.access_token;
        if (!token) throw new Error("Nessun token di accesso");

        const res = await fetch("/api/admin/users", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Errore nel caricamento degli utenti");
        }

        const data = await res.json();
        
        // Sort users by created_at descending
        const sortedUsers = (data.users || []).sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        setUsers(sortedUsers);
      } catch (err: any) {
        console.error("Admin fetch error:", err);
        showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [user, showToast]);

  const isAdmin = checkIsAdmin(user?.email);


  if (!user || !isAdmin) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2 style={{ color: "#ef4444", fontSize: 24, marginBottom: 12 }}>Accesso Negato</h2>
        <p style={{ color: "var(--text-secondary)" }}>Non hai i permessi per visualizzare questa pagina.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>👑 Cabina di Regia</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Gestione iscritti e statistiche dell'app.</p>

      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>Utenti Totali</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "var(--accent-color)" }}>{loading ? "-" : users.length}</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: 20, overflowX: "auto" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 18 }}>Elenco Iscritti</h3>
        
        {loading ? (
          <div style={{ color: "var(--text-secondary)" }}>Caricamento in corso...</div>
        ) : users.length === 0 ? (
          <div style={{ color: "var(--text-secondary)" }}>Nessun utente trovato.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left", color: "var(--text-secondary)" }}>
                <th style={{ padding: "12px 8px" }}>Email</th>
                <th style={{ padding: "12px 8px" }}>Data Iscrizione</th>
                <th style={{ padding: "12px 8px" }}>Ultimo Accesso</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "12px 8px", color: "#fff", fontWeight: 500 }}>{u.email}</td>
                  <td style={{ padding: "12px 8px", color: "var(--text-secondary)" }}>
                    {new Date(u.created_at).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "12px 8px", color: "var(--text-secondary)" }}>
                    {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString("it-IT", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Mai"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div style={{ 
        marginTop: 24, 
        padding: 16, 
        background: "rgba(255,255,255,0.05)", 
        borderRadius: 12, 
        border: "1px dashed rgba(255,255,255,0.2)",
        fontSize: 12,
        color: "var(--text-secondary)"
      }}>
        <strong>💡 Nota Tecnica:</strong> Per mostrare questa lista, è necessario che la variabile d'ambiente <code>SUPABASE_SERVICE_ROLE_KEY</code> sia configurata su Vercel. Altrimenti riceverai un errore 500.
      </div>
    </div>
  );
}
