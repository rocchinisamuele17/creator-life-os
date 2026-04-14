export type TabId = "dashboard" | "content" | "money" | "life" | "brands";

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

export const TABS: Tab[] = [
  { id: "dashboard", label: "Dashboard", icon: "◆" },
  { id: "content", label: "Content", icon: "▶" },
  { id: "money", label: "Money", icon: "◈" },
  { id: "life", label: "Vita", icon: "○" },
  { id: "brands", label: "Brands", icon: "◇" },
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
        gap: 1,
        overflowX: "auto",
        paddingBottom: 0,
        marginBottom: -1,
      }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              padding: "11px 18px",
              border: "none",
              borderBottom: isActive
                ? "2px solid var(--accent)"
                : "2px solid transparent",
              background: isActive
                ? "var(--accent-glow)"
                : "none",
              color: isActive
                ? "var(--accent-light)"
                : "var(--text-muted)",
              fontSize: 12,
              fontWeight: isActive ? 600 : 400,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.25s ease",
              fontFamily: "var(--font-body)",
              letterSpacing: 0.3,
              borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 8, opacity: isActive ? 1 : 0.4 }}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
