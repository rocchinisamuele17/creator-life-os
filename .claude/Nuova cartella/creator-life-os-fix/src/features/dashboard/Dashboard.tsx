import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StatCard } from "../../components/ui/StatCard";
import { ProgressBar } from "../../components/ui/ProgressBar";
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
  const habitsToday = state.habits.reduce(
    (s, h) => s + (h.days[4] ? 1 : 0),
    0
  );
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

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2
          className="text-gradient"
          style={{ fontSize: "clamp(24px, 6vw, 32px)", fontWeight: 800, margin: 0, paddingBottom: 4 }}
        >
          Buongiorno, Creator 👋
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 13,
            margin: "4px 0 0",
          }}
        >
          Settimana del 7 — 13 Aprile 2026
        </p>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        <StatCard
          label="Entrate Mese"
          value={`€${totalEntrate.toLocaleString()}`}
          sub={`−€${totalSpese} spese`}
          accent="#10b981"
        />
        <StatCard
          label="Contenuti"
          value={`${contentReady}/${state.content.length}`}
          sub="pronti / totali"
          accent="#6366f1"
        />
        <StatCard
          label="Abitudini Oggi"
          value={`${habitsToday}/${state.habits.length}`}
          sub="completate"
          accent="#f97316"
        />
        <StatCard
          label="Brand Deal"
          value={activeBrands}
          sub="attivi"
          accent="#3b82f6"
        />
      </div>

      {/* Obiettivi */}
      <div className="glass-panel" style={{ padding: 20, marginBottom: 20 }}>
        <h3
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.7)",
            marginBottom: 14,
            margin: "0 0 14px",
          }}
        >
          🎯 Obiettivi Q2 2026
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {state.goals.map((g, i) => (
            <div key={i}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                  {g.goal}
                </span>
                <span
                  style={{ fontSize: 12, fontWeight: 600, color: "#f97316" }}
                  aria-live="polite"
                >
                  {g.progress}%
                </span>
              </div>
              <ProgressBar value={g.progress} />
              <label className="sr-only" htmlFor={`goal-${i}`}>
                Progresso: {g.goal}
              </label>
              <input
                id={`goal-${i}`}
                type="range"
                min={0}
                max={100}
                step={1}
                value={g.progress}
                onChange={(e) =>
                  updateGoalProgress(i, parseInt(e.target.value))
                }
                style={{
                  width: "100%",
                  marginTop: 4,
                  height: 4,
                  accentColor: "#f97316",
                  cursor: "pointer",
                  opacity: 0.6,
                }}
                aria-label={`${g.goal}: ${g.progress}%`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Azioni */}
      <div className="glass-panel" style={{ padding: 20, marginBottom: 20 }}>
        <h3
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.7)",
            margin: "0 0 12px",
          }}
        >
          ⚡ Prossime Azioni
        </h3>
        <div role="group" aria-label="Lista azioni">
          {INITIAL_ACTIONS.map((action, i) => {
            const checked = checkedActions.has(i);
            return (
              <div
                key={i}
                role="checkbox"
                aria-checked={checked}
                tabIndex={0}
                onClick={() => toggleAction(i)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    toggleAction(i);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom:
                    i < INITIAL_ACTIONS.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                  cursor: "pointer",
                  minHeight: 44,
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: checked
                      ? "2px solid #f97316"
                      : "2px solid rgba(255,255,255,0.2)",
                    background: checked ? "#f9731622" : "transparent",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: checked ? "#f97316" : "transparent",
                    transition: "all 0.15s ease",
                  }}
                >
                  ✓
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: checked
                      ? "rgba(255,255,255,0.3)"
                      : "rgba(255,255,255,0.7)",
                    textDecoration: checked ? "line-through" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {action}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reminder */}
      <div className="glass-panel" style={{ padding: 20, marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", margin: 0 }}>
            🔔 Reminder
          </h3>
          <button
            onClick={() => setShowReminders(!showReminders)}
            className="premium-btn secondary"
            aria-expanded={showReminders}
            aria-controls="reminder-form"
          >
            {showReminders ? "Chiudi" : "+ Nuovo"}
          </button>
        </div>

        {showReminders && (
          <div
            id="reminder-form"
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            <FormField
              label="Testo"
              value={newReminder.text}
              onChange={(e) =>
                setNewReminder({ ...newReminder, text: (e.target as HTMLInputElement).value })
              }
              placeholder="Es. Pubblica reel"
              onKeyDown={(e) => e.key === "Enter" && addReminder()}
            />
            <div style={{ minWidth: 80 }}>
              <label
                htmlFor="reminder-time"
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.55)",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 4,
                  display: "block",
                  fontWeight: 600,
                }}
              >
                Ora
              </label>
              <input
                id="reminder-time"
                type="time"
                value={newReminder.time}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, time: e.target.value })
                }
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#fff",
                  fontSize: 14,
                  fontFamily: "inherit",
                  minHeight: 44,
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                onClick={addReminder}
                style={{
                  padding: "10px 18px",
                  borderRadius: 8,
                  border: "none",
                  background: "#f97316",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  minHeight: 44,
                }}
              >
                Aggiungi
              </button>
            </div>
          </div>
        )}

        <div role="list" aria-label="Lista promemoria">
          {(state.reminders ?? []).map((r) => (
            <div
              key={r.id}
              role="listitem"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                minHeight: 44,
              }}
            >
              <div
                role="checkbox"
                aria-checked={r.enabled}
                aria-label={`${r.enabled ? "Disattiva" : "Attiva"} promemoria: ${r.text}`}
                tabIndex={0}
                onClick={() => toggleReminder(r.id)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    toggleReminder(r.id);
                  }
                }}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: r.enabled
                    ? "2px solid #10b981"
                    : "2px solid rgba(255,255,255,0.15)",
                  background: r.enabled ? "#10b98122" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  color: r.enabled ? "#10b981" : "transparent",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#f97316",
                  minWidth: 42,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {r.time}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: r.enabled
                    ? "rgba(255,255,255,0.6)"
                    : "rgba(255,255,255,0.3)",
                  flex: 1,
                }}
              >
                {r.text}
              </span>
              <button
                onClick={() => deleteReminder(r.id)}
                className="delete-btn"
                aria-label={`Elimina promemoria: ${r.text}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="glass-panel" style={{ padding: 20 }}>
        <h3
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.7)",
            margin: "0 0 12px",
          }}
        >
          📤 Esporta Dati
        </h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => exportAllPDF(state)} className="premium-btn secondary">
            📄 Report PDF
          </button>
          <button onClick={() => exportContentCSV(state)} className="premium-btn secondary">
            📊 Contenuti CSV
          </button>
          <button onClick={() => exportMoneyCSV(state)} className="premium-btn secondary">
            💰 Finanze CSV
          </button>
          <button onClick={() => exportBrandsCSV(state)} className="premium-btn secondary">
            🤝 Brand CSV
          </button>
        </div>
      </div>
    </div>
  );
}
