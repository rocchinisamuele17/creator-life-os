export type TabId = "dashboard" | "content" | "money" | "life" | "brands";

interface Tab {
  id: TabId;
  label: string;
}

export const TABS: Tab[] = [
  { id: "dashboard", label: "🏠 Dashboard" },
  { id: "content", label: "🎬 Content Machine" },
  { id: "money", label: "💰 Money Tracker" },
  { id: "life", label: "🧘 Vita Personale" },
  { id: "brands", label: "🤝 Brand Deals" },
];

interface TabNavProps {
  active: TabId;
  onChange: (id: TabId) => void;
}

export function TabNav({ active, onChange }: TabNavProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        paddingBottom: 0,
        marginBottom: -1,
      }}
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            padding: "10px 14px",
            border: "none",
            borderBottom:
              active === tab.id
                ? "2px solid #f97316"
                : "2px solid transparent",
            background: "none",
            color: active === tab.id ? "#f97316" : "rgba(255,255,255,0.4)",
            fontSize: 12,
            fontWeight: active === tab.id ? 600 : 400,
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.2s ease",
            fontFamily: "inherit",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
