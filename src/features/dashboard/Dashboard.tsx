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

  const exportBtnStyle = {
    padding: "5px 10px",
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    cursor: "pointer" as const,
    fontFamily: "inherit",
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>
          Buongiorno, Creator 👋
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 13,
            margin: "4px 0 0",
          }}
        >
          Settimana del 7 — 13 Aprile 2026
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
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
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: 18,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.7)",
            marginBottom: 14,
          }}
        >
          🎯 Obiettivi Q2 2026
        </div>
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
                >
                  {g.progress}%
                </span>
              </div>
              <ProgressBar value={g.progress} />
              <input
                type="range"
                min={0}
                max={100}
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
              />
            </div>
          ))}
        </div>
      </div>

      {/* Azioni */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: 18,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.7)",
            marginBottom: 12,
          }}
        >
          ⚡ Prossime Azioni
        </div>
        {INITIAL_ACTIONS.map((action, i) => {
          const checked = checkedActions.has(i);
          return (
            <div
              key={i}
              onClick={() => toggleAction(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 0",
                borderBottom:
                  i < INITIAL_ACTIONS.length - 1
                    ? "1px solid rgba(255,255,255,0.05)"
                    : "none",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  border: checked
                    ? "2px solid #f97316"
                    : "2px solid rgba(255,255,255,0.2)",
                  background: checked ? "#f9731622" : "transparent",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
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

      {/* Reminder */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: 18,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
            🔔 Reminder
          </div>
          <button
            onClick={() => setShowReminders(!showReminders)}
            style={exportBtnStyle}
          >
            {showReminders ? "Chiudi" : "+ Nuovo"}
          </button>
        </div>

        {showReminders && (
          <div
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
                setNewReminder({ ...newReminder, text: e.target.value })
              }
              placeholder="Es. Pubblica reel"
              onKeyDown={(e) => e.key === "Enter" && addReminder()}
            />
            <div style={{ minWidth: 80 }}>
              <label
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.45)",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 4,
                  display: "block",
                }}
              >
                Ora
              </label>
              <input
                type="time"
                value={newReminder.time}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, time: e.target.value })
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#fff",
                  fontSize: 13,
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                onClick={addReminder}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: "#f97316",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Aggiungi
              </button>
            </div>
          </div>
        )}

        {(state.reminders ?? []).map((r) => (
          <div
            key={r.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 0",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <div
              onClick={() => toggleReminder(r.id)}
              style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                border: r.enabled
                  ? "2px solid #10b981"
                  : "2px solid rgba(255,255,255,0.15)",
                background: r.enabled ? "#10b98122" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
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
                fontSize: 12,
                color: r.enabled
                  ? "rgba(255,255,255,0.6)"
                  : "rgba(255,255,255,0.25)",
                flex: 1,
              }}
            >
              {r.text}
            </span>
            <button
              onClick={() => deleteReminder(r.id)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.2)",
                cursor: "pointer",
                fontSize: 14,
                padding: "2px 4px",
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Export */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: 18,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.7)",
            marginBottom: 12,
          }}
        >
          📤 Esporta Dati
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => exportAllPDF(state)} style={exportBtnStyle}>
            📄 Report PDF
          </button>
          <button onClick={() => exportContentCSV(state)} style={exportBtnStyle}>
            📊 Contenuti CSV
          </button>
          <button onClick={() => exportMoneyCSV(state)} style={exportBtnStyle}>
            💰 Finanze CSV
          </button>
          <button onClick={() => exportBrandsCSV(state)} style={exportBtnStyle}>
            🤝 Brand CSV
          </button>
        </div>
      </div>
    </div>
  );
}
