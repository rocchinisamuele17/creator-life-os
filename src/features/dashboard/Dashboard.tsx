import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StatCard } from "../../components/ui/StatCard";
import { ProgressBar } from "../../components/ui/ProgressBar";

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
                onChange={(e) => updateGoalProgress(i, parseInt(e.target.value))}
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
    </div>
  );
}
