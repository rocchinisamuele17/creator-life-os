import { useState, useMemo } from "react";

/* ──────────────────────── Types ──────────────────────── */
interface VitaPersonaleProps {
  state: any;
  setState: (fn: (prev: any) => any) => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

type Mood = "great" | "good" | "neutral" | "bad" | "awful";

interface JournalEntry {
  date: string;
  gratitude: string;
  focus: string;
  reflection: string;
  mood?: Mood;
}

interface RoutineItem {
  id: number;
  text: string;
  time: string;
  done?: boolean;
}

const MOODS: { key: Mood; emoji: string; label: string; color: string }[] = [
  { key: "great", emoji: "🤩", label: "Fantastico", color: "#10b981" },
  { key: "good", emoji: "😊", label: "Bene", color: "#34d399" },
  { key: "neutral", emoji: "😐", label: "Nella media", color: "#fbbf24" },
  { key: "bad", emoji: "😔", label: "Non benissimo", color: "#f97316" },
  { key: "awful", emoji: "😣", label: "Pessimo", color: "#ef4444" },
];

const DAY_LABELS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getDayOfWeek(): number {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1; // Mon=0
}

/* ──────────────────────── Component ──────────────────────── */
export function VitaPersonale({ state, setState, showToast }: VitaPersonaleProps) {
  const habits: { name: string; days: boolean[] }[] = state.habits || [];
  const journal: JournalEntry[] = state.journal || [];
  const routine: RoutineItem[] = (state.routine || []).sort(
    (a: RoutineItem, b: RoutineItem) => a.time.localeCompare(b.time),
  );

  const [activeTab, setActiveTab] = useState<"habits" | "journal" | "routine">("habits");
  const [newHabit, setNewHabit] = useState("");
  const [newRoutine, setNewRoutine] = useState({ text: "", time: "09:00" });
  const [journalDate] = useState(todayKey());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const todayIdx = getDayOfWeek();
  const todayEntry = journal.find((j) => j.date === journalDate);
  const [draft, setDraft] = useState<Partial<JournalEntry>>({
    gratitude: todayEntry?.gratitude || "",
    focus: todayEntry?.focus || "",
    reflection: todayEntry?.reflection || "",
    mood: todayEntry?.mood,
  });

  /* ── Stats ── */
  const stats = useMemo(() => {
    const completedToday = habits.filter((h) => h.days[todayIdx]).length;
    const totalToday = habits.length;

    // Streak: consecutive days all habits done (looking backward from today)
    let streak = 0;
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const checkIdx = ((todayIdx - dayOffset) + 7) % 7;
      const allDone = habits.length > 0 && habits.every((h) => h.days[checkIdx]);
      if (allDone) streak++;
      else break;
    }

    // Weekly completion rate
    const totalCells = habits.length * 7;
    const doneCells = habits.reduce((sum, h) => sum + h.days.filter(Boolean).length, 0);
    const weeklyRate = totalCells > 0 ? Math.round((doneCells / totalCells) * 100) : 0;

    // Best habit (most days done)
    let bestHabit = "";
    let bestCount = 0;
    habits.forEach((h) => {
      const c = h.days.filter(Boolean).length;
      if (c > bestCount) { bestCount = c; bestHabit = h.name; }
    });

    // Mood distribution (last 7 journal entries)
    const recentMoods = journal
      .filter((j) => j.mood)
      .slice(-7)
      .map((j) => j.mood!);

    return { completedToday, totalToday, streak, weeklyRate, bestHabit, bestCount, recentMoods };
  }, [habits, journal, todayIdx]);

  /* ── Handlers ── */
  const toggleHabit = (habitIdx: number, dayIdx: number) => {
    setState((prev: any) => {
      const newHabits = [...prev.habits];
      newHabits[habitIdx] = {
        ...newHabits[habitIdx],
        days: newHabits[habitIdx].days.map((v: boolean, i: number) => (i === dayIdx ? !v : v)),
      };
      return { ...prev, habits: newHabits };
    });
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    setState((prev: any) => ({
      ...prev,
      habits: [...prev.habits, { name: newHabit.trim(), days: [false, false, false, false, false, false, false] }],
    }));
    setNewHabit("");
    showToast("Abitudine aggiunta", "success");
  };

  const deleteHabit = (name: string) => {
    setState((prev: any) => ({
      ...prev,
      habits: prev.habits.filter((h: any) => h.name !== name),
    }));
    setDeleteConfirm(null);
    showToast("Abitudine rimossa", "info");
  };

  const saveJournal = () => {
    setState((prev: any) => {
      const existing = prev.journal.findIndex((j: JournalEntry) => j.date === journalDate);
      const entry: JournalEntry = { date: journalDate, ...draft } as JournalEntry;
      const newJournal = [...prev.journal];
      if (existing >= 0) newJournal[existing] = entry;
      else newJournal.push(entry);
      return { ...prev, journal: newJournal };
    });
    showToast("Diario salvato", "success");
  };

  const toggleRoutineDone = (id: number) => {
    setState((prev: any) => ({
      ...prev,
      routine: prev.routine.map((r: RoutineItem) => (r.id === id ? { ...r, done: !r.done } : r)),
    }));
  };

  const addRoutineItem = () => {
    if (!newRoutine.text.trim()) return;
    setState((prev: any) => ({
      ...prev,
      routine: [...(prev.routine || []), { id: Date.now(), text: newRoutine.text.trim(), time: newRoutine.time, done: false }],
    }));
    setNewRoutine({ text: "", time: "09:00" });
    showToast("Routine aggiunta", "success");
  };

  const deleteRoutineItem = (id: number) => {
    setState((prev: any) => ({
      ...prev,
      routine: (prev.routine || []).filter((r: RoutineItem) => r.id !== id),
    }));
    showToast("Routine rimossa", "info");
  };

  /* ──────────────────────── Render ──────────────────────── */
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>🧘 Vita Personale</h2>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
        Abitudini, diario e routine quotidiana
      </p>

      {/* ── Stats row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginBottom: 24 }}>
        <StatMini label="Oggi" value={`${stats.completedToday}/${stats.totalToday}`} accent="var(--accent-color)" />
        <StatMini label="Streak" value={stats.streak > 0 ? `${stats.streak}🔥` : "0"} accent={stats.streak >= 3 ? "#f97316" : "rgba(255,255,255,0.6)"} />
        <StatMini label="Settimana" value={`${stats.weeklyRate}%`} accent={stats.weeklyRate >= 70 ? "#10b981" : "#fbbf24"} />
        <StatMini label="Mood Recente" value={stats.recentMoods.length > 0
          ? MOODS.find((m) => m.key === stats.recentMoods[stats.recentMoods.length - 1])?.emoji || "—"
          : "—"
        } accent="rgba(255,255,255,0.6)" />
      </div>

      {/* Tab nav */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[
          { key: "habits", label: "✅ Abitudini" },
          { key: "journal", label: "📝 Diario" },
          { key: "routine", label: "☀️ Routine" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: activeTab === t.key ? "1px solid var(--glass-border)" : "1px solid transparent",
              background: activeTab === t.key ? "var(--glass-bg)" : "transparent",
              color: activeTab === t.key ? "var(--accent-color)" : "rgba(255,255,255,0.5)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ════════ HABITS ════════ */}
      {activeTab === "habits" && (
        <div className="glass-panel" style={{ padding: 20, borderRadius: 16 }}>
          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr repeat(7, 36px) 36px", gap: 4, alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>ABITUDINE</div>
            {DAY_LABELS.map((d, i) => (
              <div key={d} style={{
                textAlign: "center",
                fontSize: 10,
                fontWeight: i === todayIdx ? 700 : 500,
                color: i === todayIdx ? "var(--accent-color)" : "rgba(255,255,255,0.35)",
              }}>
                {d}
              </div>
            ))}
            <div />
          </div>

          {habits.length === 0 && (
            <div style={{ textAlign: "center", padding: "30px 0", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
              Nessuna abitudine. Aggiungine una qui sotto.
            </div>
          )}

          {habits.map((habit, hIdx) => {
            const doneCount = habit.days.filter(Boolean).length;
            return (
              <div
                key={habit.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr repeat(7, 36px) 36px",
                  gap: 4,
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{habit.name}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{doneCount}/7</div>
                </div>
                {habit.days.map((done, dIdx) => (
                  <button
                    key={dIdx}
                    onClick={() => toggleHabit(hIdx, dIdx)}
                    aria-label={`${habit.name} ${DAY_LABELS[dIdx]}`}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: dIdx === todayIdx ? "2px solid var(--accent-color)" : "1px solid rgba(255,255,255,0.08)",
                      background: done ? "var(--accent-gradient)" : "rgba(255,255,255,0.03)",
                      color: done ? "#fff" : "rgba(255,255,255,0.15)",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    {done ? "✓" : ""}
                  </button>
                ))}
                <button
                  onClick={() => deleteConfirm === habit.name ? deleteHabit(habit.name) : setDeleteConfirm(habit.name)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: "none",
                    background: deleteConfirm === habit.name ? "rgba(239,68,68,0.2)" : "transparent",
                    color: deleteConfirm === habit.name ? "#ef4444" : "rgba(255,255,255,0.2)",
                    fontSize: 14,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title={deleteConfirm === habit.name ? "Conferma eliminazione" : "Elimina"}
                >
                  {deleteConfirm === habit.name ? "✓" : "×"}
                </button>
              </div>
            );
          })}

          {/* Add habit */}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <input
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHabit()}
              placeholder="Nuova abitudine..."
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              onClick={addHabit}
              disabled={!newHabit.trim()}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                background: newHabit.trim() ? "var(--accent-gradient)" : "rgba(255,255,255,0.06)",
                color: newHabit.trim() ? "#fff" : "rgba(255,255,255,0.3)",
                fontSize: 12,
                fontWeight: 600,
                cursor: newHabit.trim() ? "pointer" : "default",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              + Aggiungi
            </button>
          </div>

          {/* Best habit callout */}
          {stats.bestHabit && (
            <div style={{
              marginTop: 16,
              padding: "10px 14px",
              borderRadius: 10,
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.15)",
              fontSize: 12,
              color: "rgba(255,255,255,0.6)",
            }}>
              🏆 Abitudine migliore: <strong style={{ color: "#10b981" }}>{stats.bestHabit}</strong> — {stats.bestCount}/7 giorni
            </div>
          )}
        </div>
      )}

      {/* ════════ JOURNAL ════════ */}
      {activeTab === "journal" && (
        <div className="glass-panel" style={{ padding: 20, borderRadius: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>
              📝 Diario — {new Date(journalDate + "T12:00:00").toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
            </h3>
          </div>

          {/* Mood picker */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 8 }}>
              Come ti senti oggi?
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {MOODS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setDraft({ ...draft, mood: m.key })}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: draft.mood === m.key ? `2px solid ${m.color}` : "2px solid rgba(255,255,255,0.06)",
                    background: draft.mood === m.key ? `${m.color}15` : "rgba(255,255,255,0.03)",
                    cursor: "pointer",
                    textAlign: "center",
                    minWidth: 52,
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 22 }}>{m.emoji}</div>
                  <div style={{ fontSize: 9, color: draft.mood === m.key ? m.color : "rgba(255,255,255,0.3)", marginTop: 2 }}>
                    {m.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Journal fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <JournalField
              label="🙏 Gratitudine"
              placeholder="Per cosa sei grato oggi?"
              value={draft.gratitude || ""}
              onChange={(v) => setDraft({ ...draft, gratitude: v })}
            />
            <JournalField
              label="🎯 Focus"
              placeholder="Qual è il tuo obiettivo principale di oggi?"
              value={draft.focus || ""}
              onChange={(v) => setDraft({ ...draft, focus: v })}
            />
            <JournalField
              label="💭 Riflessione"
              placeholder="Come è andata la giornata? Cosa hai imparato?"
              value={draft.reflection || ""}
              onChange={(v) => setDraft({ ...draft, reflection: v })}
            />
          </div>

          <button
            onClick={saveJournal}
            style={{
              marginTop: 16,
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background: "var(--accent-gradient)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              width: "100%",
            }}
          >
            {todayEntry ? "Aggiorna Diario" : "Salva Diario"}
          </button>

          {/* Mood history */}
          {journal.filter((j) => j.mood).length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>
                Storico Mood (ultimi 7 giorni)
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {journal
                  .filter((j) => j.mood)
                  .slice(-7)
                  .map((j) => {
                    const m = MOODS.find((mo) => mo.key === j.mood);
                    return (
                      <div
                        key={j.date}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 8,
                          background: `${m?.color || "#666"}12`,
                          border: `1px solid ${m?.color || "#666"}25`,
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontSize: 18 }}>{m?.emoji}</div>
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                          {new Date(j.date + "T12:00:00").toLocaleDateString("it-IT", { day: "numeric", month: "short" })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════ ROUTINE ════════ */}
      {activeTab === "routine" && (
        <div className="glass-panel" style={{ padding: 20, borderRadius: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>☀️ Routine Giornaliera</h3>

          {routine.length === 0 && (
            <div style={{ textAlign: "center", padding: "30px 0", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
              Nessuna routine impostata. Crea la tua giornata ideale.
            </div>
          )}

          {routine.map((item: RoutineItem) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 10,
                background: item.done ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${item.done ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)"}`,
                marginBottom: 6,
                transition: "all 0.2s",
              }}
            >
              <button
                onClick={() => toggleRoutineDone(item.id)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: item.done ? "2px solid #10b981" : "2px solid rgba(255,255,255,0.15)",
                  background: item.done ? "#10b981" : "transparent",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {item.done ? "✓" : ""}
              </button>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--accent-color)",
                minWidth: 42,
              }}>
                {item.time}
              </div>
              <div style={{
                flex: 1,
                fontSize: 14,
                fontWeight: 500,
                color: item.done ? "rgba(255,255,255,0.35)" : "#fff",
                textDecoration: item.done ? "line-through" : "none",
              }}>
                {item.text}
              </div>
              <button
                onClick={() => deleteRoutineItem(item.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  fontSize: 16,
                  padding: "2px 6px",
                }}
              >
                ×
              </button>
            </div>
          ))}

          {/* Add routine */}
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <input
              type="time"
              value={newRoutine.time}
              onChange={(e) => setNewRoutine({ ...newRoutine, time: e.target.value })}
              style={{ ...inputStyle, width: 100, flex: "none" }}
            />
            <input
              value={newRoutine.text}
              onChange={(e) => setNewRoutine({ ...newRoutine, text: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && addRoutineItem()}
              placeholder="Es. Meditazione, Revisione script..."
              style={{ ...inputStyle, flex: 1, minWidth: 160 }}
            />
            <button
              onClick={addRoutineItem}
              disabled={!newRoutine.text.trim()}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                background: newRoutine.text.trim() ? "var(--accent-gradient)" : "rgba(255,255,255,0.06)",
                color: newRoutine.text.trim() ? "#fff" : "rgba(255,255,255,0.3)",
                fontSize: 12,
                fontWeight: 600,
                cursor: newRoutine.text.trim() ? "pointer" : "default",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              + Aggiungi
            </button>
          </div>

          {/* Routine progress */}
          {routine.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>
                <span>Progresso giornaliero</span>
                <span>{routine.filter((r: RoutineItem) => r.done).length}/{routine.length}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)" }}>
                <div
                  style={{
                    height: "100%",
                    borderRadius: 3,
                    background: "var(--accent-gradient)",
                    width: `${(routine.filter((r: RoutineItem) => r.done).length / routine.length) * 100}%`,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────── Sub-components ──────────────────────── */
function StatMini({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="glass-card" style={{ padding: "12px 14px", textAlign: "center" }}>
      <div style={{ fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 800, color: accent }}>{value}</div>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

function JournalField({ label, placeholder, value, onChange }: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, display: "block", marginBottom: 4 }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.04)",
          color: "#fff",
          fontSize: 13,
          fontFamily: "inherit",
          outline: "none",
          resize: "vertical",
          lineHeight: 1.5,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
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
