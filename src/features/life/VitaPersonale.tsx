import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Card, sectionTitle, pageTitle } from "../../components/ui/Card";
import { FormField, AddButton } from "../../components/ui/FormField";
import type { JournalEntry } from "../../types";

const DAY_LABELS = ["L", "M", "M", "G", "V", "S", "D"];

const ROUTINE = [
  { time: "06:30", task: "Sveglia + Meditazione" },
  { time: "07:00", task: "Journaling + Caffè" },
  { time: "08:00", task: "Deep Work — Creazione contenuti" },
  { time: "10:30", task: "Pausa + Palestra" },
  { time: "12:00", task: "Pranzo + Social check (max 15 min)" },
  { time: "13:00", task: "Admin — Email, fatture, DM" },
  { time: "15:00", task: "Montaggio / Editing" },
  { time: "17:00", task: "Pubblicazione + Community" },
  { time: "18:30", task: "Stacco — Tempo libero" },
  { time: "21:30", task: "Riflessione serale + Lettura" },
];

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function VitaPersonale() {
  const { state, setState } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState("");

  const todayKey = getTodayKey();
  const todayJournal = state.journal.find((j) => j.date === todayKey) || { date: todayKey, gratitude: "", focus: "", reflection: "" };

  const updateJournal = (field: keyof JournalEntry, value: string) => {
    setState((s) => {
      const exists = s.journal.some((j) => j.date === todayKey);
      const updated: JournalEntry = { ...todayJournal, [field]: value };
      return { ...s, journal: exists ? s.journal.map((j) => (j.date === todayKey ? updated : j)) : [...s.journal, updated] };
    });
  };

  const toggleHabit = (habitIdx: number, dayIdx: number) => {
    setState((s) => ({ ...s, habits: s.habits.map((h, i) => i === habitIdx ? { ...h, days: h.days.map((d, j) => (j === dayIdx ? !d : d)) } : h) }));
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    setState((s) => ({ ...s, habits: [...s.habits, { name: newHabit.trim(), days: [false, false, false, false, false, false, false] }] }));
    setNewHabit("");
    setShowAdd(false);
  };

  const deleteHabit = (idx: number) => {
    setState((s) => ({ ...s, habits: s.habits.filter((_, i) => i !== idx) }));
  };

  const textareaStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid var(--border-medium)",
    borderRadius: "var(--radius-sm)",
    padding: "12px 14px",
    fontSize: 13,
    color: "var(--text-primary)",
    minHeight: 56,
    resize: "vertical" as const,
    fontFamily: "var(--font-body)",
    outline: "none",
    boxSizing: "border-box" as const,
    lineHeight: 1.5,
    transition: "border-color 0.2s ease",
  };

  return (
    <div className="stagger-in">
      <h2 style={pageTitle}>Vita Personale</h2>

      {/* Habit Tracker */}
      <Card style={{ marginBottom: 18 }} glow="var(--accent)">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={sectionTitle}>Habit Tracker — Settimana</div>
          <AddButton onClick={() => setShowAdd(!showAdd)} label="Abitudine" />
        </div>

        {showAdd && (
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            <FormField label="Nuova Abitudine" value={newHabit} onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Es. Stretching 5min" onKeyDown={(e) => e.key === "Enter" && addHabit()} />
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={addHabit}
                style={{ padding: "10px 18px", borderRadius: "var(--radius-sm)", border: "none", background: "var(--accent)", color: "#080b14", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                Aggiungi
              </button>
            </div>
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "6px 8px", fontSize: 10, color: "var(--text-muted)", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>Abitudine</th>
                {DAY_LABELS.map((d, i) => (
                  <th key={i} style={{ padding: "6px 6px", fontSize: 10, color: "var(--text-muted)", fontWeight: 600, textAlign: "center", minWidth: 30 }}>{d}</th>
                ))}
                <th style={{ width: 24 }} />
              </tr>
            </thead>
            <tbody>
              {state.habits.map((h, i) => (
                <tr key={i}>
                  <td style={{ padding: "9px 8px", fontSize: 12, color: "var(--text-secondary)", fontWeight: 400 }}>{h.name}</td>
                  {h.days.map((done, j) => (
                    <td key={j} style={{ textAlign: "center", padding: "8px 4px" }}>
                      <div onClick={() => toggleHabit(i, j)}
                        style={{
                          width: 24, height: 24, borderRadius: 6, margin: "0 auto",
                          background: done ? "var(--accent-muted)" : "var(--bg-surface)",
                          border: done ? "1.5px solid var(--accent)" : "1.5px solid var(--border-medium)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, color: done ? "var(--accent)" : "transparent",
                          cursor: "pointer", transition: "all 0.15s ease",
                        }}>✓</div>
                    </td>
                  ))}
                  <td style={{ textAlign: "center" }}>
                    <button onClick={() => deleteHabit(i)}
                      style={{ background: "none", border: "none", color: "var(--text-ghost)", cursor: "pointer", fontSize: 14, padding: "2px" }}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Journal */}
      <Card style={{ marginBottom: 18 }} glow="var(--info)">
        <div style={sectionTitle}>
          📓 Journal — {new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { key: "gratitude" as const, label: "🙏 Gratitudine", ph: "3 cose per cui sono grato oggi..." },
            { key: "focus" as const, label: "🎯 Focus del Giorno", ph: "La cosa più importante da fare oggi è..." },
            { key: "reflection" as const, label: "🌙 Riflessione Serale", ph: "Cosa ho imparato oggi..." },
          ].map((j) => (
            <div key={j.key}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 5, fontWeight: 500 }}>{j.label}</div>
              <textarea value={todayJournal[j.key]} onChange={(e) => updateJournal(j.key, e.target.value)}
                placeholder={j.ph} style={textareaStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-medium)"; }}
              />
            </div>
          ))}
        </div>

        {state.journal.length > 1 && (
          <div style={{ marginTop: 16, borderTop: "1px solid var(--border-subtle)", paddingTop: 14 }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
              Journal Precedenti
            </div>
            {state.journal.filter((j) => j.date !== todayKey).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map((j) => (
              <div key={j.date} style={{ padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", marginBottom: 4, fontFamily: "var(--font-display)" }}>
                  {new Date(j.date).toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" })}
                </div>
                {j.gratitude && <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>🙏 {j.gratitude}</div>}
                {j.focus && <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>🎯 {j.focus}</div>}
                {j.reflection && <div style={{ fontSize: 11, color: "var(--text-muted)" }}>🌙 {j.reflection}</div>}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Routine */}
      <Card>
        <div style={sectionTitle}>⏰ Routine Giornaliera</div>
        {ROUTINE.map((r, i) => (
          <div key={i} style={{
            display: "flex", gap: 14, padding: "8px 0",
            borderBottom: i < ROUTINE.length - 1 ? "1px solid var(--border-subtle)" : "none",
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", minWidth: 44, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-display)" }}>{r.time}</span>
            <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 400 }}>{r.task}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
