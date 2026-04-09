import { useState } from "react";
import { useApp } from "../../context/AppContext";
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
  const todayJournal = state.journal.find((j) => j.date === todayKey) || {
    date: todayKey,
    gratitude: "",
    focus: "",
    reflection: "",
  };

  const updateJournal = (field: keyof JournalEntry, value: string) => {
    setState((s) => {
      const exists = s.journal.some((j) => j.date === todayKey);
      const updated: JournalEntry = { ...todayJournal, [field]: value };
      return {
        ...s,
        journal: exists
          ? s.journal.map((j) => (j.date === todayKey ? updated : j))
          : [...s.journal, updated],
      };
    });
  };

  const toggleHabit = (habitIdx: number, dayIdx: number) => {
    setState((s) => ({
      ...s,
      habits: s.habits.map((h, i) =>
        i === habitIdx
          ? { ...h, days: h.days.map((d, j) => (j === dayIdx ? !d : d)) }
          : h
      ),
    }));
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    setState((s) => ({
      ...s,
      habits: [
        ...s.habits,
        { name: newHabit.trim(), days: [false, false, false, false, false, false, false] },
      ],
    }));
    setNewHabit("");
    setShowAdd(false);
  };

  const deleteHabit = (idx: number) => {
    setState((s) => ({ ...s, habits: s.habits.filter((_, i) => i !== idx) }));
  };

  const textareaStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 12,
    color: "#fff",
    minHeight: 50,
    resize: "vertical" as const,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 20px" }}>
        🧘 Vita Personale
      </h2>

      {/* Habit Tracker */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: 18,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
            Habit Tracker — Settimana Corrente
          </div>
          <AddButton onClick={() => setShowAdd(!showAdd)} label="Abitudine" />
        </div>

        {showAdd && (
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <FormField
              label="Nuova Abitudine"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Es. Stretching 5min"
              onKeyDown={(e) => e.key === "Enter" && addHabit()}
            />
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                onClick={addHabit}
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

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "6px 8px",
                    fontSize: 11,
                    color: "rgba(255,255,255,0.35)",
                    fontWeight: 500,
                  }}
                >
                  Abitudine
                </th>
                {DAY_LABELS.map((d, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "6px 8px",
                      fontSize: 11,
                      color: "rgba(255,255,255,0.35)",
                      fontWeight: 500,
                      textAlign: "center",
                      minWidth: 28,
                    }}
                  >
                    {d}
                  </th>
                ))}
                <th style={{ width: 28 }} />
              </tr>
            </thead>
            <tbody>
              {state.habits.map((h, i) => (
                <tr key={i}>
                  <td
                    style={{
                      padding: "8px 8px",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {h.name}
                  </td>
                  {h.days.map((done, j) => (
                    <td key={j} style={{ textAlign: "center", padding: "8px 4px" }}>
                      <div
                        onClick={() => toggleHabit(i, j)}
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          margin: "0 auto",
                          background: done ? "#f9731622" : "rgba(255,255,255,0.04)",
                          border: done
                            ? "1.5px solid #f97316"
                            : "1.5px solid rgba(255,255,255,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          color: done ? "#f97316" : "transparent",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        ✓
                      </div>
                    </td>
                  ))}
                  <td style={{ textAlign: "center" }}>
                    <button
                      onClick={() => deleteHabit(i)}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Journal Editabile */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: 18,
          marginBottom: 16,
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
          📓 Journal di Oggi — {new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
              🙏 Gratitudine
            </div>
            <textarea
              value={todayJournal.gratitude}
              onChange={(e) => updateJournal("gratitude", e.target.value)}
              placeholder="3 cose per cui sono grato oggi..."
              style={textareaStyle}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
              🎯 Focus del Giorno
            </div>
            <textarea
              value={todayJournal.focus}
              onChange={(e) => updateJournal("focus", e.target.value)}
              placeholder="La cosa più importante da fare oggi è..."
              style={textareaStyle}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
              🌙 Riflessione Serale
            </div>
            <textarea
              value={todayJournal.reflection}
              onChange={(e) => updateJournal("reflection", e.target.value)}
              placeholder="Cosa ho imparato oggi..."
              style={textareaStyle}
            />
          </div>
        </div>

        {state.journal.length > 1 && (
          <div style={{ marginTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
              JOURNAL PRECEDENTI ({state.journal.length - (state.journal.some((j) => j.date === todayKey) ? 1 : 0)})
            </div>
            {state.journal
              .filter((j) => j.date !== todayKey)
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 5)
              .map((j) => (
                <div
                  key={j.date}
                  style={{
                    padding: "8px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#f97316", marginBottom: 4 }}>
                    {new Date(j.date).toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" })}
                  </div>
                  {j.gratitude && (
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>
                      🙏 {j.gratitude}
                    </div>
                  )}
                  {j.focus && (
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>
                      🎯 {j.focus}
                    </div>
                  )}
                  {j.reflection && (
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                      🌙 {j.reflection}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Routine */}
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
          ⏰ Routine Giornaliera
        </div>
        {ROUTINE.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              padding: "7px 0",
              borderBottom:
                i < ROUTINE.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}
          >
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
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
              {r.task}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
