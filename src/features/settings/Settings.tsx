import { useState, useRef, useCallback, useMemo } from "react";

/* ──────────────────────── Types ──────────────────────── */
interface SettingsProps {
  state: any;
  setState: (fn: (prev: any) => any) => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

type ThemeKey = "cyan" | "orange" | "purple" | "green";

interface ThemeOption {
  key: ThemeKey;
  label: string;
  accent: string;
  gradient: string;
  emoji: string;
}

interface BackgroundConfig {
  type: "default" | "gradient" | "solid" | "photo";
  value: string; // CSS value or base64
}

interface CalendarEvent {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  color: string;
  type: "content" | "brand" | "personal" | "deadline";
}

/* ──────────────────────── Constants ──────────────────────── */
const THEMES: ThemeOption[] = [
  { key: "cyan", label: "Ciano Futuro", accent: "#00f0ff", gradient: "linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)", emoji: "💎" },
  { key: "orange", label: "Arancio Fuoco", accent: "#ff7300", gradient: "linear-gradient(135deg, #ff7300 0%, #ff004c 100%)", emoji: "🔥" },
  { key: "purple", label: "Viola Cosmico", accent: "#b026ff", gradient: "linear-gradient(135deg, #b026ff 0%, #3b00ff 100%)", emoji: "🔮" },
  { key: "green", label: "Verde Matrix", accent: "#00ff41", gradient: "linear-gradient(135deg, #00ff41 0%, #008f11 100%)", emoji: "🌿" },
];

const GRADIENT_PRESETS = [
  { label: "Aurora Boreale", value: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" },
  { label: "Tramonto", value: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)" },
  { label: "Oceano Profondo", value: "linear-gradient(135deg, #000428 0%, #004e92 100%)" },
  { label: "Foresta Notte", value: "linear-gradient(135deg, #0d1117 0%, #1a3a2a 50%, #0d1117 100%)" },
  { label: "Nebulosa", value: "linear-gradient(135deg, #0f0f1e 0%, #2d1b69 50%, #1a0a3e 100%)" },
  { label: "Carbon", value: "linear-gradient(135deg, #111 0%, #1a1a1a 50%, #0a0a0a 100%)" },
];

const SOLID_PRESETS = [
  { label: "Nero Profondo", value: "#050505" },
  { label: "Antracite", value: "#1a1a1a" },
  { label: "Blu Notte", value: "#0a0f1e" },
  { label: "Verde Scuro", value: "#0a1a0f" },
  { label: "Viola Scuro", value: "#120a1e" },
  { label: "Grigio Carbone", value: "#121212" },
];

const EVENT_TYPES = [
  { key: "content", label: "Contenuto", color: "#00f0ff", emoji: "🎬" },
  { key: "brand", label: "Brand Deal", color: "#f97316", emoji: "🤝" },
  { key: "personal", label: "Personale", color: "#10b981", emoji: "🧘" },
  { key: "deadline", label: "Deadline", color: "#ef4444", emoji: "⏰" },
];

const DAYS_IT = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const MONTHS_IT = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

/* ──────────────────────── Helpers ──────────────────────── */
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

function formatDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function todayStr() {
  const d = new Date();
  return formatDate(d.getFullYear(), d.getMonth(), d.getDate());
}

/* ──────────────────────── Component ──────────────────────── */
export function Settings({ state, setState, showToast }: SettingsProps) {
  const currentTheme: ThemeKey = state.settings?.theme || "cyan";
  const background: BackgroundConfig = state.settings?.background || { type: "default", value: "" };
  const calendarEvents: CalendarEvent[] = state.settings?.calendarEvents || [];

  const [activeSection, setActiveSection] = useState<"theme" | "background" | "calendar" | "data" | "info">("theme");
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", time: "", type: "content" as CalendarEvent["type"] });
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── State updaters ── */
  const updateSettings = useCallback(
    (patch: Record<string, any>) => {
      setState((prev: any) => ({
        ...prev,
        settings: { ...prev.settings, ...patch },
      }));
    },
    [setState],
  );

  const setTheme = (key: ThemeKey) => {
    updateSettings({ theme: key });
    showToast(`Tema "${THEMES.find((t) => t.key === key)!.label}" applicato`, "success");
  };

  const setBackground = (bg: BackgroundConfig) => {
    updateSettings({ background: bg });
    showToast("Sfondo aggiornato", "success");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Immagine troppo grande (max 5MB)", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setBackground({ type: "photo", value: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const addCalendarEvent = () => {
    if (!newEvent.title.trim() || !selectedDate) return;
    const evType = EVENT_TYPES.find((t) => t.key === newEvent.type)!;
    const event: CalendarEvent = {
      id: Date.now(),
      title: newEvent.title.trim(),
      date: selectedDate,
      time: newEvent.time || undefined,
      color: evType.color,
      type: newEvent.type,
    };
    updateSettings({ calendarEvents: [...calendarEvents, event] });
    setNewEvent({ title: "", time: "", type: "content" });
    setShowAddEvent(false);
    showToast("Evento aggiunto al calendario", "success");
  };

  const deleteCalendarEvent = (id: number) => {
    updateSettings({ calendarEvents: calendarEvents.filter((ev) => ev.id !== id) });
    showToast("Evento rimosso", "info");
  };

  /* ── Calendar computed ── */
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const today = todayStr();

  const eventsForDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    calendarEvents.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [calendarEvents]);

  const selectedEvents = selectedDate ? eventsForDate[selectedDate] || [] : [];

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  };

  /* ── Export / Import data ── */
  const exportData = () => {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `creator-life-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Backup esportato con successo", "success");
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        setState(() => data);
        showToast("Dati importati con successo", "success");
      } catch {
        showToast("File non valido", "error");
      }
    };
    reader.readAsText(file);
  };

  const resetData = () => {
    if (confirm("Sei sicuro? Tutti i dati verranno cancellati.")) {
      localStorage.removeItem("creator-life-os:state:v1");
      window.location.reload();
    }
  };

  /* ──────────────────────── Sections nav ──────────────────────── */
  const sections = [
    { key: "theme", label: "🎨 Tema", desc: "Colori e stile" },
    { key: "background", label: "🖼️ Sfondo", desc: "Personalizza lo sfondo" },
    { key: "calendar", label: "📅 Calendario", desc: "Gestisci eventi" },
    { key: "data", label: "💾 Dati", desc: "Backup e ripristino" },
    { key: "info", label: "ℹ️ Info", desc: "Versione e crediti" },
  ] as const;

  const sectionStyle = {
    padding: "6px 14px",
    borderRadius: 8,
    border: "1px solid transparent",
    background: "transparent",
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    fontWeight: 600 as const,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s",
    whiteSpace: "nowrap" as const,
  };
  const sectionActiveStyle = {
    ...sectionStyle,
    border: "1px solid var(--glass-border)",
    background: "var(--glass-bg)",
    color: "var(--accent-color)",
  };

  /* ──────────────────────── Render ──────────────────────── */
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
        ⚙️ Impostazioni
      </h2>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
        Personalizza la tua esperienza Creator Life OS
      </p>

      {/* Section tabs */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 24, paddingBottom: 4 }} className="no-scrollbar">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            style={activeSection === s.key ? sectionActiveStyle : sectionStyle}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ════════ THEME ════════ */}
      {activeSection === "theme" && (
        <div className="glass-panel" style={{ padding: 24, borderRadius: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Scegli il Tema</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {THEMES.map((t) => {
              const active = currentTheme === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTheme(t.key)}
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    border: active ? `2px solid ${t.accent}` : "2px solid rgba(255,255,255,0.08)",
                    background: active ? `${t.accent}12` : "rgba(255,255,255,0.03)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    transition: "all 0.3s",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Gradient preview bar */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: t.gradient,
                  }} />

                  <div style={{ fontSize: 28, marginBottom: 8 }}>{t.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: active ? t.accent : "#fff", marginBottom: 4 }}>
                    {t.label}
                  </div>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: t.gradient,
                    border: `2px solid ${active ? t.accent : "rgba(255,255,255,0.1)"}`,
                    boxShadow: active ? `0 0 16px ${t.accent}40` : "none",
                  }} />
                  {active && (
                    <div style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      fontSize: 14,
                      background: t.accent,
                      color: "#000",
                      borderRadius: "50%",
                      width: 22,
                      height: 22,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                    }}>
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {/* Azioni Rapide */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Azioni Rapide</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button 
                onClick={exportData}
                title="Scarica un backup dei tuoi dati"
                style={{ cursor: "pointer", padding: "8px 16px", borderRadius: 8, background: "var(--accent-gradient)", border: "none", color: "#fff", fontSize: 13, fontWeight: 600 }}>
                Esporta Backup
              </button>
              <button 
                onClick={() => setActiveSection("calendar")}
                title="Apri il calendario"
                style={{ cursor: "pointer", padding: "8px 16px", borderRadius: 8, border: "1px solid var(--accent-color)", background: "transparent", color: "var(--accent-color)", fontSize: 13, fontWeight: 600 }}>
                Gestisci Calendario
              </button>
              <button 
                onClick={() => window.location.reload()}
                title="Forza l'aggiornamento dell'app"
                style={{ cursor: "pointer", padding: "8px 16px", borderRadius: 8, background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--accent-color)", fontSize: 13 }}>
                Ricarica App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════ BACKGROUND ════════ */}
      {activeSection === "background" && (
        <div className="glass-panel" style={{ padding: 24, borderRadius: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Sfondo Personalizzato</h3>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
            Scegli un gradiente, un colore a tinta unita oppure carica la tua foto.
          </p>

          {/* Type selector */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {[
              { type: "default", label: "Default" },
              { type: "gradient", label: "Gradiente" },
              { type: "solid", label: "Colore Solido" },
              { type: "photo", label: "Foto Personale" },
            ].map((opt) => (
              <button
                key={opt.type}
                onClick={() => {
                  if (opt.type === "default") {
                    setBackground({ type: "default", value: "" });
                  } else if (opt.type === "photo") {
                    // Se l'utente clicca Foto, apriamo SEMPRE il file selector
                    fileRef.current?.click();
                  } else {
                    setBackground({ 
                      type: opt.type as BackgroundConfig["type"], 
                      value: opt.type === "gradient" ? GRADIENT_PRESETS[0].value : SOLID_PRESETS[0].value 
                    });
                  }
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: background.type === opt.type ? "1px solid var(--accent-color)" : "1px solid rgba(255,255,255,0.1)",
                  background: background.type === opt.type ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
                  color: background.type === opt.type ? "var(--accent-color)" : "rgba(255,255,255,0.6)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />

          {/* Gradient presets */}
          {background.type === "gradient" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
              {GRADIENT_PRESETS.map((g) => (
                <button
                  key={g.label}
                  onClick={() => setBackground({ type: "gradient", value: g.value })}
                  style={{
                    border: background.value === g.value ? "2px solid var(--accent-color)" : "2px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "none",
                    padding: 0,
                  }}
                >
                  <div style={{ height: 70, background: g.value }} />
                  <div style={{ padding: "6px 8px", fontSize: 11, color: "rgba(255,255,255,0.6)", textAlign: "center", background: "rgba(0,0,0,0.4)" }}>
                    {g.label}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Solid presets */}
          {background.type === "solid" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 10 }}>
              {SOLID_PRESETS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setBackground({ type: "solid", value: s.value })}
                  style={{
                    border: background.value === s.value ? "2px solid var(--accent-color)" : "2px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "none",
                    padding: 0,
                  }}
                >
                  <div style={{ height: 50, background: s.value }} />
                  <div style={{ padding: "4px 6px", fontSize: 10, color: "rgba(255,255,255,0.5)", textAlign: "center", background: "rgba(0,0,0,0.4)" }}>
                    {s.label}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Photo upload */}
          {background.type === "photo" && (
            <div>
              {background.value ? (
                <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <img
                    src={background.value}
                    alt="Sfondo personalizzato"
                    style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                  />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px", background: "linear-gradient(transparent, rgba(0,0,0,0.8))", display: "flex", gap: 8 }}>
                    <button
                      onClick={() => fileRef.current?.click()}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.2)",
                        background: "rgba(255,255,255,0.1)",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      Cambia Foto
                    </button>
                    <button
                      onClick={() => setBackground({ type: "default", value: "" })}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(239,68,68,0.2)",
                        color: "#ef4444",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Rimuovi
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  style={{
                    width: "100%",
                    padding: "40px 20px",
                    borderRadius: 14,
                    border: "2px dashed rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.03)",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "center",
                  }}
                >
                  📷 Clicca per caricare un'immagine<br />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>JPG, PNG o WebP — Max 5MB</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ════════ CALENDAR ════════ */}
      {activeSection === "calendar" && (
        <div className="glass-panel" style={{ padding: 24, borderRadius: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📅 Calendario</h3>

          {/* Month navigation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <button onClick={prevMonth} style={navBtnStyle}>◀</button>
            <div style={{ fontSize: 16, fontWeight: 700 }}>
              {MONTHS_IT[calMonth]} {calYear}
            </div>
            <button onClick={nextMonth} style={navBtnStyle}>▶</button>
          </div>

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
            {DAYS_IT.map((d) => (
              <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", padding: "4px 0" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 16 }}>
            {/* Empty cells for offset */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} style={{ height: 44 }} />
            ))}
            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = formatDate(calYear, calMonth, day);
              const isToday = dateStr === today;
              const isSelected = dateStr === selectedDate;
              const dayEvents = eventsForDate[dateStr] || [];
              const hasEvents = dayEvents.length > 0;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  style={{
                    height: 44,
                    borderRadius: 8,
                    border: isSelected ? "2px solid var(--accent-color)" : isToday ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
                    background: isSelected ? "rgba(var(--accent-color-rgb, 0, 240, 255), 0.15)" : isToday ? "rgba(255,255,255,0.06)" : "transparent",
                    color: isToday ? "var(--accent-color)" : "#fff",
                    fontSize: 13,
                    fontWeight: isToday || isSelected ? 700 : 400,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {day}
                  {hasEvents && (
                    <div style={{
                      position: "absolute",
                      bottom: 3,
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: 2,
                    }}>
                      {dayEvents.slice(0, 3).map((ev, idx) => (
                        <div key={idx} style={{ width: 4, height: 4, borderRadius: "50%", background: ev.color }} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected date events */}
          {selectedDate && (
            <div style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 12,
              padding: 16,
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
                </div>
                <button
                  onClick={() => setShowAddEvent(true)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: "var(--accent-gradient)",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  + Evento
                </button>
              </div>

              {selectedEvents.length === 0 && !showAddEvent && (
                <div style={{ textAlign: "center", padding: "12px 0", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
                  Nessun evento per questo giorno
                </div>
              )}

              {selectedEvents.map((ev) => (
                <div key={ev.id} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: `${ev.color}10`,
                  border: `1px solid ${ev.color}25`,
                  marginBottom: 6,
                }}>
                  <div style={{ width: 4, height: 28, borderRadius: 2, background: ev.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{ev.title}</div>
                    {ev.time && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{ev.time}</div>}
                  </div>
                  <div style={{ fontSize: 10, color: ev.color, textTransform: "uppercase", fontWeight: 600 }}>
                    {EVENT_TYPES.find((t) => t.key === ev.type)?.emoji}
                  </div>
                  <button
                    onClick={() => deleteCalendarEvent(ev.id)}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 14, padding: "2px 6px" }}
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Add event form */}
              {showAddEvent && (
                <div style={{
                  marginTop: 8,
                  padding: 14,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}>
                  <input
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Titolo evento..."
                    style={inputStyle}
                    autoFocus
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as CalendarEvent["type"] })}
                      style={{ ...inputStyle, flex: 1, cursor: "pointer" }}
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t.key} value={t.key} style={{ background: "#1a1a1a" }}>
                          {t.emoji} {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "flex-end" }}>
                    <button
                      onClick={() => setShowAddEvent(false)}
                      style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
                    >
                      Annulla
                    </button>
                    <button
                      onClick={addCalendarEvent}
                      disabled={!newEvent.title.trim()}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 8,
                        border: "none",
                        background: newEvent.title.trim() ? "var(--accent-gradient)" : "rgba(255,255,255,0.06)",
                        color: newEvent.title.trim() ? "#fff" : "rgba(255,255,255,0.3)",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: newEvent.title.trim() ? "pointer" : "default",
                        fontFamily: "inherit",
                      }}
                    >
                      Aggiungi
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upcoming events summary */}
          {(() => {
            const upcoming = calendarEvents
              .filter((ev) => ev.date >= today)
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(0, 5);
            if (upcoming.length === 0) return null;
            return (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Prossimi eventi</div>
                {upcoming.map((ev) => (
                  <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ width: 3, height: 20, borderRadius: 2, background: ev.color }} />
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", minWidth: 55 }}>
                      {new Date(ev.date + "T12:00:00").toLocaleDateString("it-IT", { day: "numeric", month: "short" })}
                    </div>
                    <div style={{ fontSize: 13, color: "#fff", flex: 1 }}>{ev.title}</div>
                    <div style={{ fontSize: 10, color: ev.color }}>
                      {EVENT_TYPES.find((t) => t.key === ev.type)?.emoji}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* ════════ DATA ════════ */}
      {activeSection === "data" && (
        <div className="glass-panel" style={{ padding: 24, borderRadius: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Gestione Dati</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button onClick={exportData} style={dataBtnStyle}>
              <span style={{ fontSize: 20 }}>📤</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Esporta Backup</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                  Scarica tutti i tuoi dati in formato JSON
                </div>
              </div>
            </button>

            <label style={{ ...dataBtnStyle, cursor: "pointer" }}>
              <span style={{ fontSize: 20 }}>📥</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Importa Backup</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                  Ripristina i dati da un file JSON
                </div>
              </div>
              <input type="file" accept=".json" onChange={importData} style={{ display: "none" }} />
            </label>

            <button onClick={resetData} style={{ ...dataBtnStyle, borderColor: "rgba(239,68,68,0.2)" }}>
              <span style={{ fontSize: 20 }}>🗑️</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#ef4444" }}>Reset Completo</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                  Cancella tutti i dati e ripristina i valori predefiniti
                </div>
              </div>
            </button>
          </div>

          <div style={{
            marginTop: 20,
            padding: 14,
            borderRadius: 10,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
              Sincronizzazione Cloud
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                Sincronizzazione attiva via Supabase
              </span>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>
              I dati vengono sincronizzati automaticamente ogni 1.5 secondi quando sei loggato.
            </div>
          </div>
        </div>
      )}

      {/* ════════ INFO ════════ */}
      {activeSection === "info" && (
        <div className="glass-panel" style={{ padding: 24, borderRadius: 16, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Creator Life OS</h3>
          <div style={{ fontSize: 13, color: "var(--accent-color)", fontWeight: 600, marginBottom: 4 }}>
            v2.0 — Phase 2
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>
            by Prodigi Digitali © 2026
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 10,
            maxWidth: 300,
            margin: "0 auto",
            textAlign: "left",
          }}>
            {[
              { label: "Contenuti", value: state.content?.length || 0 },
              { label: "Entrate", value: state.entrate?.length || 0 },
              { label: "Abitudini", value: state.habits?.length || 0 },
              { label: "Brand Deal", value: state.brands?.length || 0 },
              { label: "Obiettivi", value: state.goals?.length || 0 },
              { label: "Eventi", value: calendarEvents.length },
            ].map((s) => (
              <div key={s.label} style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent-color)" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────── Shared Styles ──────────────────────── */
const navBtnStyle: React.CSSProperties = {
  padding: "6px 14px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)",
  color: "rgba(255,255,255,0.6)",
  fontSize: 14,
  cursor: "pointer",
  fontFamily: "inherit",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
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

const dataBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "16px 18px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  color: "#fff",
  textAlign: "left",
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "all 0.2s",
  width: "100%",
};
