export type TabId = "dashboard" | "content" | "money" | "life" | "brands";

interface Tab {
  id: TabId;
  icon: string;
  label: string;
}

export const TABS: Tab[] = [
  { id: "dashboard", icon: "🏠", label: "Dashboard" },
  { id: "content", icon: "🎬", label: "Content Machine" },
  { id: "money", icon: "💰", label: "Money Tracker" },
  { id: "life", icon: "🧘", label: "Vita Personale" },
  { id: "brands", icon: "🤝", label: "Brand Deals" },
];

interface TabNavProps {
  active: TabId;
  onChange: (id: TabId) => void;
}

export function TabNav({ active, onChange }: TabNavProps) {
  return (
    <div className="tab-nav" role="tablist" aria-label="Sezioni dell'app">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => {
              const currentIdx = TABS.findIndex((t) => t.id === tab.id);
              let nextIdx = currentIdx;
              if (e.key === "ArrowRight") nextIdx = (currentIdx + 1) % TABS.length;
              else if (e.key === "ArrowLeft") nextIdx = (currentIdx - 1 + TABS.length) % TABS.length;
              else if (e.key === "Home") nextIdx = 0;
              else if (e.key === "End") nextIdx = TABS.length - 1;
              else return;
              e.preventDefault();
              onChange(TABS[nextIdx].id);
              document.getElementById(`tab-${TABS[nextIdx].id}`)?.focus();
            }}
            className={`tab-btn ${isActive ? "active" : ""}`}
          >
            <span aria-hidden="true">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
