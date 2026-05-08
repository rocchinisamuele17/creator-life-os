import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { supabase } from "../../lib/supabase";
import type { ContentItem, ContentStatus } from "../../types";
import { FormField, SelectField } from "../../components/ui/FormField";
import { EmptyState } from "../../components/ui/EmptyState";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { toast } from "../../components/ui/Toast";

const STATUS_COLORS: Record<ContentStatus, string> = {
  Idea: "#6366f1",
  Script: "#f59e0b",
  Pronto: "#10b981",
  Pubblicato: "#3b82f6",
  Analisi: "#8b5cf6",
};

const PLATFORMS = [
  "Instagram Reel",
  "Instagram Carousel",
  "TikTok",
  "YouTube Short",
  "YouTube Video",
];

const STATUSES: ContentStatus[] = ["Idea", "Script", "Pronto", "Pubblicato", "Analisi"];

const HOOK_BANK = [
  "Nessuno te lo dirà mai",
  "Il problema non è...",
  "Ho smesso di fare X e...",
  "3 cose che ho imparato",
  "La verità scomoda su...",
  "Questo cambierà tutto",
  "Non fare questo errore",
  "Il segreto che nessuno condivide",
  "Perché il 90% fallisce",
  "Se fai questo, stai sbagliando",
];

const HASHTAG_BANK = [
  "#contentcreator", "#creatorlife", "#socialmediamarketing",
  "#instagramgrowth", "#tiktokitalia", "#reelsinstagram",
  "#digitalmarketing", "#freelanceitalia", "#growthhacking",
  "#personalbranding",
];

type Filter = "Tutti" | ContentStatus;
const FILTERS: Filter[] = ["Tutti", "Idea", "Script", "Pronto", "Pubblicato", "Analisi"];

const emptyForm = {
  title: "",
  platform: PLATFORMS[0],
  status: "Idea" as ContentStatus,
  hook: "",
};

export function ContentMachine() {
  const { state, setState } = useApp();
  const [filter, setFilter] = useState<Filter>("Tutti");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [editingMetrics, setEditingMetrics] = useState<number | null>(null);
  const [metricsForm, setMetricsForm] = useState({ views: "", engagement: "" });
  const [copiedHook, setCopiedHook] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const filtered = useMemo(() => {
    let list = filter === "Tutti"
      ? state.content
      : state.content.filter((c) => c.status === filter);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.platform.toLowerCase().includes(q) ||
          c.hook.toLowerCase().includes(q)
      );
    }
    return list;
  }, [state.content, filter, search]);

  const addContent = () => {
    if (!form.title.trim()) return;
    const now = new Date();
    const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
    const dateStr = `${String(now.getDate()).padStart(2, "0")} ${months[now.getMonth()]}`;
    const newItem: ContentItem = {
      id: Date.now(),
      title: form.title.trim(),
      platform: form.platform,
      status: form.status,
      hook: form.hook.trim() || "—",
      date: dateStr,
      views: "—",
      engagement: "—",
    };
    setState((s) => ({ ...s, content: [...s.content, newItem] }));
    setForm(emptyForm);
    setShowForm(false);
    toast("Contenuto aggiunto con successo!", "success");
  };

  const generateAI = async () => {
    setIsGenerating(true);
    try {
      const { data: { session } } = await supabase!.auth.getSession();
      
      if (!session) {
        toast("Sessione scaduta. Esci e rientra.", "error");
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
          prompt: "Generami un'idea virale per un contenuto social. Rispondi in formato JSON: { \"title\": \"...\", \"hook\": \"...\", \"platform\": \"TikTok|Instagram Reel|...\" }",
          context: { currentCount: state.content.length }
        })
      });
      const data = await response.json();
      if (data.content) {
        // Simple regex to extract JSON from markdown if needed
        const jsonStr = data.content.includes('{') ? data.content.substring(data.content.indexOf('{'), data.content.lastIndexOf('}') + 1) : null;
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr);
          setForm({
            title: parsed.title || "Nuova Idea AI",
            platform: parsed.platform || PLATFORMS[0],
            status: "Idea",
            hook: parsed.hook || "",
          });
          setShowForm(true);
          toast("Idea AI generata!", "success");
        } else {
          toast("Errore nel formato AI", "error");
        }
      }
    } catch (e) {
      toast("Errore durante la generazione AI", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateStatus = (id: number, status: ContentStatus) => {
    setState((s) => ({
      ...s,
      content: s.content.map((c) => (c.id === id ? { ...c, status } : c)),
    }));
    toast(`Status aggiornato → ${status}`, "info");
  };

  const confirmDelete = () => {
    if (deleteTarget === null) return;
    const item = state.content.find((c) => c.id === deleteTarget);
    setState((s) => ({
      ...s,
      content: s.content.filter((c) => c.id !== deleteTarget),
    }));
    toast(`"${item?.title}" eliminato`, "info");
    setDeleteTarget(null);
  };

  const saveMetrics = (id: number) => {
    setState((s) => ({
      ...s,
      content: s.content.map((c) =>
        c.id === id
          ? {
              ...c,
              views: metricsForm.views.trim() || c.views,
              engagement: metricsForm.engagement.trim() || c.engagement,
            }
          : c
      ),
    }));
    setEditingMetrics(null);
    toast("Metriche aggiornate!", "success");
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedHook(idx);
      toast("Copiato negli appunti!", "success");
      setTimeout(() => setCopiedHook(null), 1500);
    });
  };

  const useHookInForm = (hook: string) => {
    setForm({ ...form, hook });
    setShowForm(true);
    toast("Hook inserito nel form!", "info");
  };

  return (
    <div>
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eliminare contenuto?"
        message="Il contenuto verrà rimosso definitivamente dalla pipeline."
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>
          🎬 Content Machine
        </h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button 
            onClick={generateAI} 
            className="premium-btn secondary"
            disabled={isGenerating}
            style={{ 
              background: "rgba(124, 58, 237, 0.1)", 
              borderColor: "rgba(124, 58, 237, 0.3)",
              color: "#a78bfa"
            }}
          >
            {isGenerating ? "..." : "✨ AI Idea"}
          </button>
          <button onClick={() => { setForm(emptyForm); setShowForm(true); }} className="premium-btn primary">
            + Nuovo Contenuto
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: 14 }}>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Cerca per titolo, piattaforma o hook..."
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            color: "#fff",
            fontSize: 13,
            fontFamily: "inherit",
            minHeight: 44,
          }}
        />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {FILTERS.map((s) => {
          const count = s === "Tutti"
            ? state.content.length
            : state.content.filter((c) => c.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "none",
                background:
                  filter === s
                    ? s === "Tutti" ? "rgba(255,255,255,0.15)" : `${STATUS_COLORS[s as ContentStatus]}33`
                    : "rgba(255,255,255,0.06)",
                color:
                  filter === s
                    ? s === "Tutti" ? "#fff" : STATUS_COLORS[s as ContentStatus]
                    : "rgba(255,255,255,0.5)",
                fontSize: 12,
                cursor: "pointer",
                fontWeight: filter === s ? 600 : 500,
                transition: "all 0.15s ease",
                minHeight: 32,
              }}
            >
              {s} ({count})
            </button>
          );
        })}
      </div>

      {showForm && (
        <div
          style={{
            background: "rgba(249,115,22,0.06)",
            border: "1px solid rgba(249,115,22,0.2)",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            <FormField
              label="Titolo"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Il mio prossimo contenuto..."
            />
            <SelectField
              label="Piattaforma"
              value={form.platform}
              onChange={(v) => setForm({ ...form, platform: v })}
              options={PLATFORMS}
            />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
            <SelectField
              label="Status"
              value={form.status}
              onChange={(v) => setForm({ ...form, status: v as ContentStatus })}
              options={STATUSES}
            />
            <div style={{ flex: 1, minWidth: 120 }}>
              <FormField
                label={`Hook ${form.hook.length > 0 ? `(${form.hook.length} car.)` : ""}`}
                value={form.hook}
                onChange={(e) => setForm({ ...form, hook: e.target.value })}
                placeholder="La frase che cattura..."
              />
            </div>
          </div>
          <button
            onClick={addContent}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: "#f97316",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              minHeight: 40,
            }}
          >
            Aggiungi Contenuto
          </button>
        </div>
      )}

      {/* Status counters */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        {(Object.entries(STATUS_COLORS) as [ContentStatus, string][]).map(
          ([status, color]) => {
            const count = state.content.filter(
              (c) => c.status === status
            ).length;
            return (
              <div
                key={status}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: color,
                  }}
                />
                <span
                  style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}
                >
                  {status}
                </span>
                <span style={{ fontSize: 16, fontWeight: 700, color }}>
                  {count}
                </span>
              </div>
            );
          }
        )}
      </div>

      {/* Content list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon="🎬"
            title={search ? "Nessun risultato" : "Nessun contenuto"}
            description={
              search
                ? `Nessun contenuto corrisponde a "${search}". Prova con un'altra ricerca.`
                : "La tua pipeline è vuota. Aggiungi il primo contenuto per iniziare!"
            }
            action={!search ? { label: "+ Nuovo Contenuto", onClick: () => setShowForm(true) } : undefined}
          />
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                padding: "14px 16px",
                transition: "border-color 0.15s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 8,
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#fff",
                      marginBottom: 3,
                    }}
                  >
                    {c.title}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                    {c.platform} · {c.date}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <select
                    value={c.status}
                    onChange={(e) => updateStatus(c.id, e.target.value as ContentStatus)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 600,
                      background: `${STATUS_COLORS[c.status]}22`,
                      color: STATUS_COLORS[c.status],
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      minHeight: 32,
                    }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} style={{ background: "#1a1a1b" }}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setDeleteTarget(c.id)}
                    className="delete-btn"
                    aria-label={`Elimina: ${c.title}`}
                  >
                    ×
                  </button>
                </div>
              </div>
              {c.hook !== "—" && (
                <div
                  style={{
                    background: "rgba(249,115,22,0.08)",
                    borderLeft: "3px solid #f97316",
                    padding: "6px 12px",
                    borderRadius: "0 6px 6px 0",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}
                  >
                    HOOK:{" "}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "#f97316",
                      fontStyle: "italic",
                    }}
                  >
                    {c.hook}
                  </span>
                </div>
              )}

              {/* Metriche editabili */}
              {editingMetrics === c.id ? (
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <input
                    type="text"
                    value={metricsForm.views}
                    onChange={(e) => setMetricsForm({ ...metricsForm, views: e.target.value })}
                    placeholder="Views (es. 12.4K)"
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "rgba(255,255,255,0.06)",
                      color: "#fff",
                      fontSize: 12,
                      width: 120,
                      fontFamily: "inherit",
                    }}
                  />
                  <input
                    type="text"
                    value={metricsForm.engagement}
                    onChange={(e) => setMetricsForm({ ...metricsForm, engagement: e.target.value })}
                    placeholder="Eng. (es. 8.2%)"
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "rgba(255,255,255,0.06)",
                      color: "#fff",
                      fontSize: 12,
                      width: 120,
                      fontFamily: "inherit",
                    }}
                  />
                  <button
                    onClick={() => saveMetrics(c.id)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 6,
                      border: "none",
                      background: "#10b981",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Salva
                  </button>
                  <button
                    onClick={() => setEditingMetrics(null)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 6,
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 11,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Annulla
                  </button>
                </div>
              ) : (
                <div
                  style={{ display: "flex", gap: 16, alignItems: "center", cursor: "pointer" }}
                  onClick={() => {
                    setEditingMetrics(c.id);
                    setMetricsForm({
                      views: c.views === "—" ? "" : c.views,
                      engagement: c.engagement === "—" ? "" : c.engagement,
                    });
                  }}
                  title="Clicca per modificare le metriche"
                >
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                    👁 {c.views}
                  </span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                    ❤️ {c.engagement}
                  </span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
                    (clicca per modificare)
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Hook Bank Interattiva */}
      <div
        style={{
          marginTop: 20,
          background: "rgba(99,102,241,0.08)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: 10,
          padding: 16,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#6366f1",
            marginBottom: 4,
          }}
        >
          🏦 Banca Hook
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>
          Clicca per copiare · Doppio click per inserire nel form
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {HOOK_BANK.map((h, i) => (
            <button
              key={i}
              onClick={() => copyToClipboard(h, i)}
              onDoubleClick={() => useHookInForm(h)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 11,
                background: copiedHook === i ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)",
                color: copiedHook === i ? "#10b981" : "rgba(255,255,255,0.5)",
                border: copiedHook === i ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s ease",
                minHeight: 32,
              }}
            >
              {copiedHook === i ? "✓ Copiato!" : h}
            </button>
          ))}
        </div>
      </div>

      {/* Hashtag Bank */}
      <div
        style={{
          marginTop: 12,
          background: "rgba(59,130,246,0.08)",
          border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: 10,
          padding: 16,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#3b82f6",
            marginBottom: 4,
          }}
        >
          # Hashtag Consigliati
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>
          Clicca per copiare
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {HASHTAG_BANK.map((h, i) => (
            <button
              key={i}
              onClick={() => {
                navigator.clipboard.writeText(h);
                toast(`${h} copiato!`, "success");
              }}
              style={{
                padding: "5px 10px",
                borderRadius: 6,
                fontSize: 11,
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.5)",
                border: "1px solid transparent",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s ease",
                minHeight: 28,
              }}
            >
              {h}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
