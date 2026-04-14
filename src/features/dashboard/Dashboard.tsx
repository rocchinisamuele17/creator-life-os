import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StatCard } from "../../components/ui/StatCard";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Card, sectionTitle, pageTitle } from "../../components/ui/Card";
import { FormField } from "../../components/ui/FormField";
import {
  exportContentCSV,
  exportMoneyCSV,
  exportBrandsCSV,
  exportAllPDF,
} from "../../lib/export";

const INITIAL_ACTIONS = [
  "Finire script: 'Come ho perso 3 clienti'",
  "Registrare Reel metodo 3-3-3",
  "Rispondere a Skillshare (proposta)",
  "Aggiornare Follow-up Machine v2",
  "Review settimanale — Domenica ore 18:00",
];

export function Dashboard() {
  const { state, setState } = useApp();
  const [checkedActions, setCheckedActions] = useState<Set<number>>(new Set());
  const [showReminders, setShowReminders] = useState(false);
  const [newReminder, setNewReminder] = useState({ text: "", time: "09:00" });

  const totalEntrate = state.entrate.reduce((s, e) => s + e.amount, 0);
  const totalSpese = state.spese.reduce((s, e) => s + e.amount, 0);
  const contentReady = state.content.filter(
    (c) => c.status === "Pronto" || c.status === "Pubblicato"
  ).length;
  const habitsToday = state.habits.reduce((s, h) => s + (h.days[4] ? 1 : 0), 0);
  const activeBrands = state.brands.filter((b) => b.status === "Attivo").length;

  const toggleAction = (idx: number) => {
    setCheckedActions((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const updateGoalProgress = (idx: number, progress: number) => {
    setState((s) => ({
      ...s,
      goals: s.goals.map((g, i) => (i === idx ? { ...g, progress } : g)),
    }));
  };

  const addReminder = () => {
    if (!newReminder.text.trim()) return;
    setState((s) => ({
      ...s,
      reminders: [
        ...(s.reminders ?? []),
        { id: Date.now(), text: newReminder.text.trim(), time: newReminder.time, enabled: true },
      ],
    }));
    setNewReminder({ text: "", time: "09:00" });
  };

  const toggleReminder = (id: number) => {
    setState((s) => ({
      ...s,
      reminders: (s.reminders ?? []).map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      ),
    }));
  };

  const deleteReminder = (id: number) => {
    setState((s) => ({
      ...s,
      reminders: (s.reminders ?? []).filter((r) => r.id !== id),
    }));
  };

  const pillBtn = (onClick: () => void, label: string) => (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: "var(--radius-full)",
        border: "1px solid var(--border-medium)",
        background: "var(--bg-surface)",
        color: "var(--text-secondary)",
        fontSize: 10,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "var(--font-body)",
        letterSpacing: 0.3,
        transition: "all 0.2s ease",
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="stagger-in">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ ...pageTitle, margin: 0 }}>
          Buongiorno, Creator
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "6px 0 0", fontWeight: 400 }}>
          Settimana del 7 — 13 Aprile 2026
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Entrate Mese" value={`€${totalEntrate.toLocaleString()}`} sub={`−€${totalSpese} spese`} accent="var(--success)" />
        <StatCard label="Contenuti" value={`${contentReady}/${state.content.length}`} sub="pronti / totali" accent="var(--purple)" />
        <StatCard label="Abitudini Oggi" value={`${habitsToday}/${state.habits.length}`} sub="completate" accent="var(--accent)" />
        <StatCard label="Brand Deal" value={activeBrands} sub="attivi" accent="var(--info)" />
      </div>

      {/* Goals */}
      <Card style={{ marginBottom: 18 }} glow="var(--accent)">
        <div style={sectionTitle}>🎯 Obiettivi Q2 2026</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {state.goals.map((g, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 400 }}>{g.goal}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-display)" }}>{g.progress}%</span>
              </div>
              <ProgressBar value={g.progress} />
              <input type="range" min={0} max={100} value={g.progress}
                onChange={(e) => updateGoalProgress(i, parseInt(e.target.value))}
                style={{ width: "100%", marginTop: 4, height: 3, accentColor: "var(--accent)", cursor: "pointer", opacity: 0.5 }}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <Card style={{ marginBottom: 18 }}>
        <div style={sectionTitle}>⚡ Prossime Azioni</div>
        {INITIAL_ACTIONS.map((action, i) => {
          const checked = checkedActions.has(i);
          return (
            <div key={i} onClick={() => toggleAction(i)}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "9px 0",
                borderBottom: i < INITIAL_ACTIONS.length - 1 ? "1px solid var(--border-subtle)" : "none",
                cursor: "pointer", transition: "opacity 0.2s",
              }}>
              <div style={{
                width: 18, height: 18, borderRadius: 5,
                border: checked ? "2px solid var(--accent)" : "2px solid var(--border-medium)",
                background: checked ? "var(--accent-muted)" : "transparent",
                flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, color: checked ? "var(--accent)" : "transparent",
                transition: "all 0.2s ease",
              }}>✓</div>
              <span style={{
                fontSize: 13, fontWeight: 400,
                color: checked ? "var(--text-muted)" : "var(--text-secondary)",
                textDecoration: checked ? "line-through" : "none",
                transition: "all 0.2s ease",
              }}>{action}</span>
            </div>
          );
        })}
      </Card>

      {/* Reminders */}
      <Card style={{ marginBottom: 18 }} glow="var(--success)">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={sectionTitle}>🔔 Reminder</div>
          {pillBtn(() => setShowReminders(!showReminders), showReminders ? "Chiudi" : "+ Nuovo")}
        </div>

        {showReminders && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            <FormField label="Testo" value={newReminder.text}
              onChange={(e) => setNewReminder({ ...newReminder, text: e.target.value })}
              placeholder="Es. Pubblica reel" onKeyDown={(e) => e.key === "Enter" && addReminder()} />
            <div style={{ minWidth: 80 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 5, display: "block" }}>Ora</label>
              <input type="time" value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-medium)", background: "rgba(255,255,255,0.04)", color: "var(--text-primary)", fontSize: 13, fontFamily: "var(--font-body)", outline: "none" }} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={addReminder}
                style={{ padding: "10px 18px", borderRadius: "var(--radius-sm)", border: "none", background: "var(--accent)", color: "#080b14", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                Aggiungi
              </button>
            </div>
          </div>
        )}

        {(state.reminders ?? []).map((r) => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--border-subtle)" }}>
            <div onClick={() => toggleReminder(r.id)}
              style={{
                width: 16, height: 16, borderRadius: 4,
                border: r.enabled ? "2px solid var(--success)" : "2px solid var(--border-medium)",
                background: r.enabled ? "var(--success-muted)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, color: r.enabled ? "var(--success)" : "transparent", cursor: "pointer", flexShrink: 0,
              }}>✓</div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", minWidth: 42, fontVariantNumeric: "tabular-nums" }}>{r.time}</span>
            <span style={{ fontSize: 12, color: r.enabled ? "var(--text-secondary)" : "var(--text-muted)", flex: 1 }}>{r.text}</span>
            <button onClick={() => deleteReminder(r.id)}
              style={{ background: "none", border: "none", color: "var(--text-ghost)", cursor: "pointer", fontSize: 14, padding: "2px 4px" }}>×</button>
          </div>
        ))}
      </Card>

      {/* Export */}
      <Card>
        <div style={sectionTitle}>📤 Esporta Dati</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {pillBtn(() => exportAllPDF(state), "📄 Report PDF")}
          {pillBtn(() => exportContentCSV(state), "📊 Contenuti CSV")}
          {pillBtn(() => exportMoneyCSV(state), "💰 Finanze CSV")}
          {pillBtn(() => exportBrandsCSV(state), "🤝 Brand CSV")}
        </div>
      </Card>
    </div>
  );
}
