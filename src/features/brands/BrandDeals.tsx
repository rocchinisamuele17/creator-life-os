import { useState, useMemo } from "react";
import { supabase } from "../../lib/supabase";

/* ──────────────────────── Types ──────────────────────── */
interface BrandDealsProps {
  state: any;
  setState: (fn: (prev: any) => any) => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

type DealStatus = "Proposta" | "Negoziazione" | "Attivo" | "Completato";

interface BrandDeal {
  brand: string;
  status: DealStatus;
  value: number;
  deadline: string;
  deliverables: string;
  paid: boolean;
  notes?: string;
  contact?: string;
}

const STATUSES: { key: DealStatus; color: string; emoji: string }[] = [
  { key: "Proposta", color: "#6366f1", emoji: "📨" },
  { key: "Negoziazione", color: "#f59e0b", emoji: "🤝" },
  { key: "Attivo", color: "#10b981", emoji: "✅" },
  { key: "Completato", color: "rgba(255,255,255,0.35)", emoji: "🏁" },
];

const PROPOSAL_TEMPLATE = `Ciao [Nome Brand],

Mi chiamo [Il tuo nome] e sono un content creator specializzato in [nicchia]. Il mio profilo raggiunge [X]K follower su [piattaforma] con un engagement rate del [X]%.

Ho notato che [Brand] si allinea perfettamente con i valori del mio pubblico e mi piacerebbe proporre una collaborazione.

📦 Cosa propongo:
• [N] Reel/Video dedicati al prodotto
• [N] Story con swipe-up/link
• Menzione nella bio per [X] giorni
• Diritti di utilizzo del contenuto per [X] mesi

💰 Investimento: €[importo]

📊 Cosa otterrete:
• Reach stimato: [X]K impressioni
• Engagement rate medio: [X]%
• Contenuto autentico e di qualità
• Target audience in linea con il vostro brand

Sono disponibile per una call per discutere i dettagli.

Grazie per il tempo,
[Il tuo nome]
[Link portfolio/media kit]`;

/* ──────────────────────── Component ──────────────────────── */
export function BrandDeals({ state, setState, showToast }: BrandDealsProps) {
  const brands: BrandDeal[] = state.brands || [];
  const [filter, setFilter] = useState<DealStatus | "Tutti">("Tutti");
  const [showForm, setShowForm] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [editingNotes, setEditingNotes] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiProposal, setAiProposal] = useState("");
  const [newDeal, setNewDeal] = useState({
    brand: "",
    status: "Proposta" as DealStatus,
    value: "",
    deadline: "",
    deliverables: "",
    contact: "",
  });

  /* ── Stats ── */
  const stats = useMemo(() => {
    const totalValue = brands.reduce((s, b) => s + b.value, 0);
    const paidValue = brands.filter((b) => b.paid).reduce((s, b) => s + b.value, 0);
    const unpaidValue = totalValue - paidValue;
    const activeCount = brands.filter((b) => b.status === "Attivo" || b.status === "Negoziazione").length;
    const conversionRate = brands.length > 0
      ? Math.round((brands.filter((b) => b.status === "Attivo" || b.status === "Completato").length / brands.length) * 100)
      : 0;
    return { totalValue, paidValue, unpaidValue, activeCount, conversionRate };
  }, [brands]);

  const filtered = filter === "Tutti" ? brands : brands.filter((b) => b.status === filter);

  /* ── Handlers ── */
  const addDeal = () => {
    if (!newDeal.brand.trim()) return;
    setState((prev: any) => ({
      ...prev,
      brands: [
        ...prev.brands,
        {
          brand: newDeal.brand.trim(),
          status: newDeal.status,
          value: Number(newDeal.value) || 0,
          deadline: newDeal.deadline || "—",
          deliverables: newDeal.deliverables || "—",
          paid: false,
          notes: "",
          contact: newDeal.contact,
        },
      ],
    }));
    setNewDeal({ brand: "", status: "Proposta", value: "", deadline: "", deliverables: "", contact: "" });
    setShowForm(false);
    showToast(`Brand deal "${newDeal.brand}" aggiunto`, "success");
  };

  const togglePaid = (idx: number) => {
    setState((prev: any) => {
      const newBrands = [...prev.brands];
      newBrands[idx] = { ...newBrands[idx], paid: !newBrands[idx].paid };
      return { ...prev, brands: newBrands };
    });
    showToast(brands[idx].paid ? "Segnato come non pagato" : "Segnato come pagato ✅", "success");
  };

  const updateStatus = (idx: number, status: DealStatus) => {
    setState((prev: any) => {
      const newBrands = [...prev.brands];
      newBrands[idx] = { ...newBrands[idx], status };
      return { ...prev, brands: newBrands };
    });
    showToast(`Status aggiornato: ${status}`, "info");
  };

  const updateNotes = (idx: number, notes: string) => {
    setState((prev: any) => {
      const newBrands = [...prev.brands];
      newBrands[idx] = { ...newBrands[idx], notes };
      return { ...prev, brands: newBrands };
    });
  };

  const deleteDeal = (idx: number) => {
    const name = brands[idx].brand;
    setState((prev: any) => ({
      ...prev,
      brands: prev.brands.filter((_: any, i: number) => i !== idx),
    }));
    setDeleteConfirm(null);
    showToast(`"${name}" rimosso`, "info");
  };

  const copyTemplate = () => {
    navigator.clipboard.writeText(aiProposal || PROPOSAL_TEMPLATE).then(() => {
      showToast("Template copiato negli appunti", "success");
    }).catch(() => {
      showToast("Errore nella copia", "error");
    });
  };

  const generateAIProposal = async (brandName: string) => {
    if (!brandName.trim()) {
      showToast("Inserisci prima il nome del brand", "error");
      return;
    }
    setIsGenerating(true);
    try {
      const { data: { session } } = await supabase!.auth.getSession();
      
      if (!session) {
        showToast("Sessione scaduta. Esci e rientra.", "error");
        setIsGenerating(false);
        return;
      }

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          prompt: `Scrivimi una proposta di collaborazione professionale e persuasiva per il brand "${brandName}". Sono un content creator. La proposta deve essere breve, diretta e focalizzata sul valore che porto al brand. Usa un tono professionale e convincente.`,
          context: { brand: brandName }
        })
      });
      const data = await response.json();
      if (data.content) {
        setAiProposal(data.content);
        setShowTemplate(true);
        showToast("✨ Proposta AI generata!", "success");
      } else {
        showToast(data.error || "Errore generazione AI", "error");
      }
    } catch {
      showToast("Errore di connessione all'AI", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>🤝 Brand Deals</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Pipeline collaborazioni e sponsorizzazioni</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowTemplate(!showTemplate)} style={headerBtnStyle}>
            📋 Template
          </button>
          <button onClick={() => setShowForm(!showForm)} style={{ ...headerBtnStyle, background: "var(--accent-gradient)", border: "none" }}>
            + Nuovo Deal
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 20 }}>
        <StatCard label="Valore Totale" value={`€${stats.totalValue.toLocaleString()}`} accent="var(--accent-color)" />
        <StatCard label="Incassato" value={`€${stats.paidValue.toLocaleString()}`} accent="#10b981" />
        <StatCard label="Da Incassare" value={`€${stats.unpaidValue.toLocaleString()}`} accent={stats.unpaidValue > 0 ? "#f97316" : "rgba(255,255,255,0.4)"} />
        <StatCard label="Deal Attivi" value={String(stats.activeCount)} accent="var(--accent-color)" />
        <StatCard label="Conversione" value={`${stats.conversionRate}%`} accent={stats.conversionRate >= 50 ? "#10b981" : "#fbbf24"} />
      </div>

      {/* Template panel */}
      {showTemplate && (
        <div className="glass-panel" style={{ padding: 20, borderRadius: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>📋 Template Proposta</h3>
            <button onClick={copyTemplate} style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "none",
              background: "var(--accent-gradient)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}>
              📋 Copia Template
            </button>
          </div>
          <pre style={{
            whiteSpace: "pre-wrap",
            fontSize: 12,
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.6)",
            background: "rgba(255,255,255,0.03)",
            padding: 16,
            borderRadius: 10,
            border: `1px solid ${aiProposal ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)"}`,
            maxHeight: 300,
            overflow: "auto",
            fontFamily: "inherit",
          }}>
            {aiProposal || PROPOSAL_TEMPLATE}
          </pre>
          {aiProposal ? (
            <button onClick={() => setAiProposal("")} style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer" }}>
              Ripristina template standard
            </button>
          ) : (
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>
              Sostituisci i campi tra [parentesi] con i tuoi dati
            </p>
          )}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="glass-panel" style={{ padding: 20, borderRadius: 16, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Nuovo Brand Deal</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                value={newDeal.brand}
                onChange={(e) => setNewDeal({ ...newDeal, brand: e.target.value })}
                placeholder="Nome brand"
                style={{ ...inputStyle, flex: 2, minWidth: 160 }}
                autoFocus
              />
              <input
                value={newDeal.contact}
                onChange={(e) => setNewDeal({ ...newDeal, contact: e.target.value })}
                placeholder="Contatto (email/nome)"
                style={{ ...inputStyle, flex: 2, minWidth: 160 }}
              />
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <select
                value={newDeal.status}
                onChange={(e) => setNewDeal({ ...newDeal, status: e.target.value as DealStatus })}
                style={{ ...inputStyle, flex: 1, minWidth: 130, cursor: "pointer" }}
              >
                {STATUSES.map((s) => (
                  <option key={s.key} value={s.key} style={{ background: "#1a1a1a" }}>
                    {s.emoji} {s.key}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={newDeal.value}
                onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                placeholder="Valore €"
                style={{ ...inputStyle, flex: 1, minWidth: 100 }}
              />
              <input
                value={newDeal.deadline}
                onChange={(e) => setNewDeal({ ...newDeal, deadline: e.target.value })}
                placeholder="Deadline (es. 30 Apr)"
                style={{ ...inputStyle, flex: 1, minWidth: 120 }}
              />
            </div>
            <input
              value={newDeal.deliverables}
              onChange={(e) => setNewDeal({ ...newDeal, deliverables: e.target.value })}
              placeholder="Deliverables (es. 2 Reel + 1 Story)"
              style={inputStyle}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button
                onClick={() => generateAIProposal(newDeal.brand)}
                disabled={isGenerating || !newDeal.brand.trim()}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid rgba(124, 58, 237, 0.4)",
                  background: "rgba(124, 58, 237, 0.1)",
                  color: "#a78bfa",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: isGenerating || !newDeal.brand.trim() ? "default" : "pointer",
                  fontFamily: "inherit",
                  opacity: !newDeal.brand.trim() ? 0.5 : 1,
                }}
              >
                {isGenerating ? "✨ Generando..." : "✨ Proposta AI"}
              </button>
              <button onClick={() => setShowForm(false)} style={cancelBtnStyle}>Annulla</button>
              <button
                onClick={addDeal}
                disabled={!newDeal.brand.trim()}
                style={{
                  padding: "8px 20px",
                  borderRadius: 8,
                  border: "none",
                  background: newDeal.brand.trim() ? "var(--accent-gradient)" : "rgba(255,255,255,0.06)",
                  color: newDeal.brand.trim() ? "#fff" : "rgba(255,255,255,0.3)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: newDeal.brand.trim() ? "pointer" : "default",
                  fontFamily: "inherit",
                }}
              >
                Aggiungi Deal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        <FilterBtn label="Tutti" count={brands.length} active={filter === "Tutti"} onClick={() => setFilter("Tutti")} />
        {STATUSES.map((s) => {
          const count = brands.filter((b) => b.status === s.key).length;
          return (
            <FilterBtn
              key={s.key}
              label={`${s.emoji} ${s.key}`}
              count={count}
              active={filter === s.key}
              onClick={() => setFilter(s.key)}
            />
          );
        })}
      </div>

      {/* Deal cards */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "rgba(255,255,255,0.3)" }}>
          <div style={{ fontSize: 36, marginBottom: 8, opacity: 0.5 }}>🤝</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            {filter === "Tutti" ? "Nessun brand deal" : `Nessun deal "${filter}"`}
          </div>
          <div style={{ fontSize: 12, marginTop: 4 }}>
            {filter === "Tutti" ? "Aggiungi il tuo primo deal con il bottone sopra" : "Prova a cambiare filtro"}
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((deal, _idx) => {
          const realIdx = brands.indexOf(deal);
          const statusInfo = STATUSES.find((s) => s.key === deal.status)!;
          return (
            <div
              key={`${deal.brand}-${realIdx}`}
              className="glass-card"
              style={{ padding: 18, borderRadius: 14, borderLeft: `4px solid ${statusInfo.color}` }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{deal.brand}</div>
                  {deal.contact && (
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                      👤 {deal.contact}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {/* Status selector */}
                  <select
                    value={deal.status}
                    onChange={(e) => updateStatus(realIdx, e.target.value as DealStatus)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: `1px solid ${statusInfo.color}40`,
                      background: `${statusInfo.color}15`,
                      color: statusInfo.color,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.key} value={s.key} style={{ background: "#1a1a1a", color: "#fff" }}>
                        {s.emoji} {s.key}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Details */}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 10, fontSize: 13 }}>
                <div>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>Valore: </span>
                  <strong style={{ color: "var(--accent-color)" }}>€{deal.value.toLocaleString()}</strong>
                </div>
                <div>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>Deadline: </span>
                  <span style={{ color: "#fff" }}>{deal.deadline}</span>
                </div>
                <div>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>Deliverables: </span>
                  <span style={{ color: "#fff" }}>{deal.deliverables}</span>
                </div>
              </div>

              {/* Notes */}
              {editingNotes === realIdx ? (
                <div style={{ marginBottom: 10 }}>
                  <textarea
                    value={deal.notes || ""}
                    onChange={(e) => updateNotes(realIdx, e.target.value)}
                    placeholder="Aggiungi note sul deal..."
                    rows={3}
                    autoFocus
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#fff",
                      fontSize: 12,
                      fontFamily: "inherit",
                      outline: "none",
                      resize: "vertical",
                      lineHeight: 1.5,
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    onClick={() => { setEditingNotes(null); showToast("Note salvate", "success"); }}
                    style={{ marginTop: 6, padding: "4px 12px", borderRadius: 6, border: "none", background: "var(--accent-gradient)", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Salva Note
                  </button>
                </div>
              ) : deal.notes ? (
                <div
                  onClick={() => setEditingNotes(realIdx)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: 10,
                    cursor: "pointer",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  📝 {deal.notes}
                </div>
              ) : null}

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={() => togglePaid(realIdx)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: deal.paid ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.1)",
                    background: deal.paid ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)",
                    color: deal.paid ? "#10b981" : "rgba(255,255,255,0.5)",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {deal.paid ? "💰 Pagato" : "💳 Segna pagato"}
                </button>
                {!deal.notes && editingNotes !== realIdx && (
                  <button
                    onClick={() => setEditingNotes(realIdx)}
                    style={actionBtnStyle}
                  >
                    📝 Note
                  </button>
                )}
                <button
                  onClick={() => {
                    if (deleteConfirm === realIdx) deleteDeal(realIdx);
                    else setDeleteConfirm(realIdx);
                  }}
                  style={{
                    ...actionBtnStyle,
                    marginLeft: "auto",
                    color: deleteConfirm === realIdx ? "#ef4444" : "rgba(255,255,255,0.3)",
                    borderColor: deleteConfirm === realIdx ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.06)",
                  }}
                >
                  {deleteConfirm === realIdx ? "Conferma elimina" : "Elimina"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline summary */}
      {brands.length > 0 && (
        <div className="glass-panel" style={{ padding: 16, borderRadius: 14, marginTop: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Pipeline Overview</div>
          <div style={{ display: "flex", gap: 4, height: 8, borderRadius: 4, overflow: "hidden" }}>
            {STATUSES.map((s) => {
              const count = brands.filter((b) => b.status === s.key).length;
              const pct = (count / brands.length) * 100;
              if (pct === 0) return null;
              return (
                <div
                  key={s.key}
                  style={{ width: `${pct}%`, background: s.color, height: "100%", transition: "width 0.4s" }}
                  title={`${s.key}: ${count}`}
                />
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
            {STATUSES.map((s) => {
              const count = brands.filter((b) => b.status === s.key).length;
              if (count === 0) return null;
              return (
                <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                  {s.key}: {count}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────── Sub-components ──────────────────────── */
function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="glass-card" style={{ padding: "14px 16px" }}>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", fontWeight: 600, letterSpacing: 1, marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 800, color: accent }}>{value}</div>
    </div>
  );
}

function FilterBtn({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: 8,
        border: active ? "1px solid var(--glass-border)" : "1px solid transparent",
        background: active ? "var(--glass-bg)" : "transparent",
        color: active ? "var(--accent-color)" : "rgba(255,255,255,0.45)",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {label}
      <span style={{
        fontSize: 10,
        background: active ? "var(--accent-color)" : "rgba(255,255,255,0.08)",
        color: active ? "#000" : "rgba(255,255,255,0.4)",
        borderRadius: 10,
        padding: "1px 6px",
        fontWeight: 700,
      }}>
        {count}
      </span>
    </button>
  );
}

/* ──────────────────────── Styles ──────────────────────── */
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

const headerBtnStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
  color: "#fff",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
  whiteSpace: "nowrap",
};

const cancelBtnStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "transparent",
  color: "rgba(255,255,255,0.5)",
  fontSize: 13,
  cursor: "pointer",
  fontFamily: "inherit",
};

const actionBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  color: "rgba(255,255,255,0.5)",
  fontSize: 11,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
};
