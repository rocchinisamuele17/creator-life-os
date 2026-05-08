import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { StatCard } from "../../components/ui/StatCard";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { toast } from "../../components/ui/Toast";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "Buonanotte, Creator";
  if (h < 12) return "Buongiorno, Creator";
  if (h < 18) return "Buon pomeriggio, Creator";
  return "Buonasera, Creator";
}

function getWeekRange(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
  const mStart = months[monday.getMonth()];
  const mEnd = months[sunday.getMonth()];
  const yearStr = monday.getFullYear();

  if (mStart === mEnd) {
    return `Settimana del ${monday.getDate()} — ${sunday.getDate()} ${mStart} ${yearStr}`;
  }
  return `Settimana del ${monday.getDate()} ${mStart} — ${sunday.getDate()} ${mEnd} ${yearStr}`;
}

export function Dashboard() {
  const { state, setState } = useApp();
  const [checkedActions, setCheckedActions] = useState<Set<number>>(new Set());
  const [showReminders, setShowReminders] = useState(false);
  const [newReminder, setNewReminder] = useState({ text: "", time: "09:00" });
  const [deleteTarget, setDeleteTarget] = useState<{ id: number } | null>(null);

  const totalEntrate = state.entrate.reduce((s, e) => s + e.amount, 0);
  const totalSpese = state.spese.reduce((s, e) => s + e.amount, 0);
  const net = totalEntrate - totalSpese;
  const contentReady = state.content.filter(
    (c) => c.status === "Pronto" || c.status === "Pubblicato"
  ).length;
  const habitsToday = state.habits.reduce(
    (s, h) => s + (h.days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] ? 1 : 0),
    0
  );
  const activeBrands = state.brands.filter((b) => b.status === "Attivo").length;

  // ── Azioni dinamiche derivate dallo state ─────────────────────────
  const smartActions = useMemo(() => {
    const actions: { id: string | number, text: string, isCustom: boolean }[] = [];
    let idCounter = 0;

    // Contenuti in lavorazione (Script → vanno finiti)
    state.content
      .filter((c) => c.status === "Script")
      .slice(0, 2)
      .forEach((c) => actions.push({ id: `script-${idCounter++}`, text: `Finire script: "${c.title}"`, isCustom: false }));

    // Contenuti pronti da pubblicare
    state.content
      .filter((c) => c.status === "Pronto")
      .slice(0, 1)
      .forEach((c) => actions.push({ id: `publish-${idCounter++}`, text: `Pubblicare: "${c.title}"`, isCustom: false }));

    // Brand deal in negoziazione
    state.brands
      .filter((b) => b.status === "Negoziazione")
      .slice(0, 1)
      .forEach((b) => actions.push({ id: `brand-${idCounter++}`, text: `Follow-up con ${b.brand} (${b.deliverables})`, isCustom: false }));

    // Brand deal attivi non pagati
    state.brands
      .filter((b) => b.status === "Attivo" && !b.paid)
      .slice(0, 1)
      .forEach((b) => actions.push({ id: `payment-${idCounter++}`, text: `Richiedere pagamento a ${b.brand} (€${b.value})`, isCustom: false }));

    // Brand deal con scadenza vicina
    state.brands
      .filter((b) => b.status === "Attivo" && b.deadline !== "—")
      .slice(0, 1)
      .forEach((b) => actions.push({ id: `deadline-${idCounter++}`, text: `Scadenza ${b.brand}: ${b.deadline}`, isCustom: false }));

    // Idee da sviluppare
    const ideas = state.content.filter((c) => c.status === "Idea");
    if (ideas.length > 0) {
      actions.push({ id: `idea-${idCounter++}`, text: `Sviluppare idea: "${ideas[0].title}"`, isCustom: false });
    }

    // Reminder attivi per oggi
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    state.reminders
      .filter((r) => r.enabled && r.time >= currentTime)
      .slice(0, 1)
      .forEach((r) => actions.push({ id: `rem-${idCounter++}`, text: `${r.time} — ${r.text}`, isCustom: false }));

    // Aggiungi azioni personalizzate se presenti
    if (state.customActions) {
      state.customActions
        .filter(a => !a.completed)
        .slice(0, 2)
        .forEach(a => actions.push({ id: a.id, text: a.text, isCustom: true }));
    }

    // Fallback se non c'è nulla
    if (actions.length === 0) {
      actions.push({ id: 'fallback', text: "Aggiungi nuovi contenuti alla pipeline!", isCustom: false });
    }

    return actions.slice(0, 6);
  }, [state.content, state.brands, state.reminders, state.customActions]);

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

  const updateGoalText = (idx: number, goal: string) => {
    setState((s) => ({
      ...s,
      goals: s.goals.map((g, i) => (i === idx ? { ...g, goal } : g)),
    }));
  };

  const removeGoal = (idx: number) => {
    setState((s) => ({
      ...s,
      goals: s.goals.filter((_, i) => i !== idx),
    }));
  };

  const addNewGoal = () => {
    setState((s) => ({
      ...s,
      goals: [...s.goals, { goal: "Nuovo Obiettivo", progress: 0 }]
    }));
  };

  const addCustomAction = (text: string) => {
    if (!text.trim()) return;
    setState((s) => ({
      ...s,
      customActions: [
        ...(s.customActions || []),
        { id: Date.now(), text: text.trim(), completed: false }
      ]
    }));
    toast("Azione aggiunta!", "success");
  };

  const removeCustomAction = (id: number | string) => {
    setState((s) => ({
      ...s,
      customActions: (s.customActions || []).filter(a => a.id !== id)
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
    toast("Reminder aggiunto", "success");
  };

  const removeReminder = (id: number) => {
    setState((s) => ({
      ...s,
      reminders: s.reminders.filter((r) => r.id !== id),
    }));
    toast("Reminder rimosso", "success");
  };

  return (
    <div className="dashboard-container" style={{ padding: "10px 0" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            {getGreeting()}
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              margin: "4px 0 0",
            }}
          >
            {getWeekRange()}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        <StatCard
          label="Entrate Mese"
          value={`€${totalEntrate.toLocaleString()}`}
          sub={net >= 0 ? `+€${net.toLocaleString()} netto` : `−€${Math.abs(net).toLocaleString()} netto`}
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

      {/* 🎯 Obiettivi Q2 2026 */}
      <div className="glass-panel" style={{ padding: 20, marginBottom: 20 }}>
        <h3
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--accent-color)",
            marginBottom: 16,
            margin: "0 0 16px",
            textTransform: "uppercase",
            letterSpacing: "1px",
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
                <input
                  type="text"
                  value={g.goal}
                  onChange={(e) => updateGoalText(i, e.target.value)}
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.8)",
                    background: "none",
                    border: "none",
                    padding: 0,
                    width: "80%",
                    outline: "none",
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: g.progress >= 100 ? "#10b981" : "#f97316" }}
                    aria-live="polite"
                  >
                    {g.progress}%{g.progress >= 100 ? " ✓" : ""}
                  </span>
                  <button 
                    onClick={() => removeGoal(i)}
                    style={{ background: "none", border: "none", color: "#ff4d4d", cursor: "pointer", fontSize: 16, padding: "0 4px", lineHeight: 1 }}
                    title="Elimina obiettivo"
                  >
                    ×
                  </button>
                </div>
              </div>
              <ProgressBar value={g.progress} />
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
                  accentColor: "var(--accent-color)",
                  cursor: "pointer",
                  opacity: 0.6,
                }}
                aria-label={`${g.goal}: ${g.progress}%`}
              />
            </div>
          ))}
        </div>
        <button 
          onClick={addNewGoal}
          style={{ marginTop: 16, width: "100%", background: "rgba(255,255,255,0.02)", border: "1px dashed var(--accent-color)", color: "var(--accent-color)", padding: "10px", borderRadius: 8, cursor: "pointer", fontSize: 13, opacity: 0.8, transition: "all 0.2s ease" }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "0.8"}
        >
          + Aggiungi Obiettivo
        </button>
      </div>

      {/* ⚡ Prossime Azioni */}
      <div className="glass-panel" style={{ padding: 20, marginBottom: 20 }}>
        <h3
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--accent-color)",
            marginBottom: 16,
            margin: "0 0 16px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          ⚡ Prossime Azioni
        </h3>
        
        {/* Input per nuove azioni */}
        <div style={{ marginBottom: 16 }}>
          <input
            className="premium-input"
            style={{ width: "100%", padding: "10px", fontSize: 13, border: "1px dashed var(--accent-color)", background: "rgba(255,255,255,0.02)", color: "#fff" }}
            placeholder="+ Aggiungi un'azione personalizzata..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addCustomAction(e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
          />
        </div>

        <div role="group" aria-label="Lista azioni">
          {smartActions.map((action, i) => {
            const checked = checkedActions.has(i);
            return (
              <div
                key={action.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom:
                    i < smartActions.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                  minHeight: 44,
                  padding: "10px 0"
                }}
              >
                <div
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
                    cursor: "pointer",
                    flex: 1
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      border: checked
                        ? "2px solid var(--accent-color)"
                        : "2px solid rgba(255,255,255,0.2)",
                      background: checked ? "var(--accent-color)22" : "transparent",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      color: checked ? "var(--accent-color)" : "transparent",
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
                    {action.text}
                  </span>
                </div>
                {action.isCustom && (
                  <button 
                    onClick={() => removeCustomAction(action.id)}
                    style={{ background: "none", border: "none", color: "#ff4d4d", cursor: "pointer", fontSize: 16, padding: "0 8px" }}
                    title="Elimina azione"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reminder Quick Add */}
      <div className="glass-panel" style={{ padding: 20, marginBottom: 80 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-color)", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>⏰ Reminder Veloci</h3>
          <button 
            onClick={() => setShowReminders(!showReminders)}
            style={{ fontSize: 12, background: "none", border: "none", color: "var(--accent-color)", cursor: "pointer" }}
          >
            {showReminders ? "Chiudi" : "Gestisci"}
          </button>
        </div>

        {showReminders && (
          <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
            <input 
              className="premium-input"
              style={{ flex: 1, padding: "8px 12px", fontSize: 13 }}
              placeholder="Cosa devi ricordare?"
              value={newReminder.text}
              onChange={e => setNewReminder({...newReminder, text: e.target.value})}
            />
            <input 
              type="time"
              className="premium-input"
              style={{ width: 100, padding: "8px", fontSize: 13 }}
              value={newReminder.time}
              onChange={e => setNewReminder({...newReminder, time: e.target.value})}
            />
            <button className="premium-btn primary" style={{ padding: "8px 16px" }} onClick={addReminder}>+</button>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(state.reminders || []).filter(r => r.enabled).map(r => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-color)" }}>{r.time}</span>
                <span style={{ fontSize: 13 }}>{r.text}</span>
              </div>
              {showReminders && (
                <button onClick={() => removeReminder(r.id)} style={{ background: "none", border: "none", color: "#ff4d4d", cursor: "pointer" }}>✕</button>
              )}
            </div>
          ))}
          {(!state.reminders || state.reminders.length === 0) && (
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", textAlign: "center", margin: "10px 0" }}>Nessun reminder attivo</p>
          )}
        </div>
      </div>
      
      <ConfirmDialog
        open={!!deleteTarget}
        title="Rimuovere reminder?"
        message="Questa azione non può essere annullata."
        onConfirm={() => {
          if (deleteTarget) removeReminder(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
