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

  const [activeSection, setActiveSection] = useState<"theme" | "background" | "calendar" | "data" | "subscription" | "info">("theme");
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
    showToast(`Tema applicato`, "success");
  };

  const setBackground = (bg: BackgroundConfig) => {
    updateSettings({ background: bg });
    showToast("Sfondo aggiornato", "success");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBackground({ type: "photo", value: reader.result as string });
    reader.readAsDataURL(file);
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

  /* ── Actions ── */
  const exportData = () => {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup.json`;
    a.click();
    showToast("Backup esportato", "success");
  };

  const sections = [
    { key: "theme", label: "🎨 Tema" },
    { key: "background", label: "🖼️ Sfondo" },
    { key: "calendar", label: "📅 Calendario" },
    { key: "data", label: "💾 Dati" },
    { key: "subscription", label: "💳 Abbonamento" },
    { key: "info", label: "ℹ️ Info" },
  ] as const;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>⚙️ Impostazioni</h2>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 24 }} className="no-scrollbar">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: activeSection === s.key ? "var(--glass-bg)" : "transparent",
              color: activeSection === s.key ? "var(--accent-color)" : "#888",
              border: activeSection === s.key ? "1px solid var(--glass-border)" : "1px solid transparent",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: "nowrap"
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* SECTIONS */}
      {activeSection === "theme" && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Personalizza Colori</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
            {THEMES.map(t => (
              <button key={t.key} onClick={() => setTheme(t.key)} style={{ padding: 16, borderRadius: 12, border: currentTheme === t.key ? `2px solid ${t.accent}` : "1px solid #333", background: "#111", cursor: "pointer", color: "#fff" }}>
                <div style={{ fontSize: 24 }}>{t.emoji}</div>
                <div style={{ marginTop: 8 }}>{t.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeSection === "background" && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Sfondo</h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
             <button onClick={() => setBackground({type: "default", value: ""})} style={navBtnStyle}>Default</button>
             <button onClick={() => fileRef.current?.click()} style={navBtnStyle}>Carica Foto</button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
            {GRADIENT_PRESETS.map(g => (
              <button key={g.label} onClick={() => setBackground({type: "gradient", value: g.value})} style={{ height: 60, background: g.value, borderRadius: 8, border: background.value === g.value ? "2px solid #fff" : "none", cursor: "pointer" }} />
            ))}
          </div>
        </div>
      )}

      {activeSection === "calendar" && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Calendario</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
             {DAYS_IT.map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, color: "#555" }}>{d}</div>)}
             {Array.from({length: firstDay}).map((_, i) => <div key={i} />)}
             {Array.from({length: daysInMonth}).map((_, i) => (
               <div key={i} style={{ height: 40, border: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, borderRadius: 4, background: (i+1) === new Date().getDate() ? "var(--accent-color)" : "transparent", color: (i+1) === new Date().getDate() ? "#000" : "#fff" }}>{i+1}</div>
             ))}
          </div>
        </div>
      )}

      {activeSection === "data" && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>I tuoi Dati</h3>
          <button onClick={exportData} style={dataBtnStyle}>📤 Esporta Backup JSON</button>
          <button onClick={() => confirm("Vuoi resettare tutto?") && localStorage.clear()} style={{ ...dataBtnStyle, color: "#ff4444", marginTop: 10 }}>🗑️ Reset Totale</button>
        </div>
      )}

      {activeSection === "subscription" && (
        <div className="glass-panel" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>💳 Il tuo Abbonamento</h3>
          <div style={{ background: "#111", padding: 20, borderRadius: 12, border: "1px solid #333" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
              <span style={{ fontWeight: "bold", color: "var(--accent-color)" }}>Creator Life PRO</span>
              <span style={{ color: "#10b981", fontSize: 12 }}>ATTIVO</span>
            </div>
            <button onClick={() => window.open('https://billing.stripe.com/p/login/test_91c7ub7Y4d5Cg924gg', '_blank')} style={{ width: "100%", padding: 12, background: "var(--accent-gradient)", border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer" }}>Gestisci su Stripe</button>
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <button onClick={() => window.open('https://billing.stripe.com/p/login/test_91c7ub7Y4d5Cg924gg', '_blank')} style={{ background: "none", border: "none", color: "#666", textDecoration: "underline", cursor: "pointer", fontSize: 12 }}>Annulla Abbonamento</button>
            </div>
          </div>
        </div>
      )}

      {activeSection === "info" && (
        <div className="glass-panel" style={{ padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 40 }}>⚡</div>
          <h3>Creator Life OS</h3>
          <p style={{ color: "#666" }}>Versione 2.0.8 — Prodigi Digitali</p>
        </div>
      )}
    </div>
  );
}

const navBtnStyle = { padding: "8px 16px", borderRadius: 8, border: "1px solid #333", background: "#111", color: "#fff", cursor: "pointer" };
const dataBtnStyle = { width: "100%", padding: "15px", borderRadius: 10, border: "1px solid #333", background: "#111", color: "#fff", cursor: "pointer", textAlign: "left" as const };
