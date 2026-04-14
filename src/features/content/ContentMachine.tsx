import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Card, sectionTitle, pageTitle } from "../../components/ui/Card";
import { FormField, SelectField, AddButton } from "../../components/ui/FormField";
import type { ContentItem, ContentStatus } from "../../types";

const STATUS_COLORS: Record<ContentStatus, string> = {
  Idea: "var(--purple)",
  Script: "var(--amber)",
  Pronto: "var(--success)",
  Pubblicato: "var(--info)",
  Analisi: "#c084fc",
};

const PLATFORMS = ["Instagram Reel", "Instagram Carousel", "TikTok", "YouTube Short", "YouTube Video"];
const STATUSES: ContentStatus[] = ["Idea", "Script", "Pronto", "Pubblicato", "Analisi"];
const HOOK_BANK = ["Nessuno te lo dirà mai", "Il problema non è...", "Ho smesso di fare X e...", "3 cose che ho imparato", "La verità scomoda su..."];

type Filter = "Tutti" | ContentStatus;
const FILTERS: Filter[] = ["Tutti", "Idea", "Script", "Pronto", "Pubblicato"];

const emptyForm = { title: "", platform: PLATFORMS[0], status: "Idea" as ContentStatus, hook: "" };

export function ContentMachine() {
  const { state, setState } = useApp();
  const [filter, setFilter] = useState<Filter>("Tutti");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = filter === "Tutti" ? state.content : state.content.filter((c) => c.status === filter);

  const addContent = () => {
    if (!form.title.trim()) return;
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, "0")} ${["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"][now.getMonth()]}`;
    const newItem: ContentItem = { id: Date.now(), title: form.title.trim(), platform: form.platform, status: form.status, hook: form.hook.trim() || "—", date: dateStr, views: "—", engagement: "—" };
    setState((s) => ({ ...s, content: [...s.content, newItem] }));
    setForm(emptyForm);
    setShowForm(false);
  };

  const updateStatus = (id: number, status: ContentStatus) => {
    setState((s) => ({ ...s, content: s.content.map((c) => (c.id === id ? { ...c, status } : c)) }));
  };

  const deleteContent = (id: number) => {
    setState((s) => ({ ...s, content: s.content.filter((c) => c.id !== id) }));
  };

  return (
    <div className="stagger-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <h2 style={pageTitle}>Content Machine</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {FILTERS.map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                style={{
                  padding: "5px 14px", borderRadius: "var(--radius-full)", border: "none",
                  background: filter === s ? "var(--accent-muted)" : "var(--bg-surface)",
                  color: filter === s ? "var(--accent-light)" : "var(--text-muted)",
                  fontSize: 11, cursor: "pointer", fontWeight: filter === s ? 600 : 400,
                  fontFamily: "var(--font-body)", transition: "all 0.2s ease",
                  borderWidth: 1, borderStyle: "solid",
                  borderColor: filter === s ? "var(--accent)" : "transparent",
                }}>
                {s}
              </button>
            ))}
          </div>
          <AddButton onClick={() => setShowForm(!showForm)} label="Nuovo" />
        </div>
      </div>

      {showForm && (
        <Card style={{ marginBottom: 18, borderColor: "rgba(229, 166, 59, 0.2)" }} glow="var(--accent)">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            <FormField label="Titolo" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Il mio prossimo contenuto..." />
            <SelectField label="Piattaforma" value={form.platform} onChange={(v) => setForm({ ...form, platform: v })} options={PLATFORMS} />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            <SelectField label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v as ContentStatus })} options={STATUSES} />
            <FormField label="Hook" value={form.hook} onChange={(e) => setForm({ ...form, hook: e.target.value })} placeholder="La frase che cattura..." />
          </div>
          <button onClick={addContent}
            style={{ padding: "10px 22px", borderRadius: "var(--radius-sm)", border: "none", background: "var(--accent)", color: "#080b14", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
            Aggiungi Contenuto
          </button>
        </Card>
      )}

      {/* Status counters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {(Object.entries(STATUS_COLORS) as [ContentStatus, string][]).map(([status, color]) => {
          const count = state.content.filter((c) => c.status === status).length;
          return (
            <div key={status} style={{
              background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-full)", padding: "6px 14px",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}55` }} />
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 400 }}>{status}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color, fontFamily: "var(--font-display)" }}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* Content items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((c) => (
          <Card key={c.id} style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 3, fontFamily: "var(--font-display)" }}>{c.title}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 400 }}>{c.platform} · {c.date}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <select value={c.status} onChange={(e) => updateStatus(c.id, e.target.value as ContentStatus)}
                  style={{
                    padding: "3px 10px", borderRadius: "var(--radius-full)", fontSize: 10, fontWeight: 600,
                    background: `color-mix(in srgb, ${STATUS_COLORS[c.status]} 15%, transparent)`,
                    color: STATUS_COLORS[c.status], border: "none", cursor: "pointer", fontFamily: "var(--font-body)", appearance: "none",
                  }}>
                  {STATUSES.map((s) => <option key={s} value={s} style={{ background: "#0e1220", color: "#fff" }}>{s}</option>)}
                </select>
                <button onClick={() => deleteContent(c.id)}
                  style={{ background: "none", border: "none", color: "var(--text-ghost)", cursor: "pointer", fontSize: 14, padding: "2px 4px" }}>×</button>
              </div>
            </div>
            {c.hook !== "—" && (
              <div style={{
                background: "var(--accent-glow)", borderLeft: "2px solid var(--accent)",
                padding: "6px 12px", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", marginBottom: 8,
              }}>
                <span style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1 }}>Hook </span>
                <span style={{ fontSize: 12, color: "var(--accent-light)", fontStyle: "italic", fontWeight: 400 }}>{c.hook}</span>
              </div>
            )}
            {c.views !== "—" && (
              <div style={{ display: "flex", gap: 16 }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>👁 {c.views}</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>❤️ {c.engagement}</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Hook Bank */}
      <Card style={{ marginTop: 20 }} glow="var(--purple)">
        <div style={{ ...sectionTitle, color: "var(--purple)" }}>🏦 Banca Hook & Hashtag</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {HOOK_BANK.map((h, i) => (
            <span key={i} style={{
              padding: "5px 12px", borderRadius: "var(--radius-full)", fontSize: 11,
              background: "var(--purple-muted)", color: "var(--purple)", fontWeight: 400,
              border: "1px solid rgba(167, 139, 250, 0.15)",
            }}>{h}</span>
          ))}
        </div>
      </Card>
    </div>
  );
}
