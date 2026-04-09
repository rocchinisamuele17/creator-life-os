import { useApp } from "../../context/AppContext";
import { StatCard } from "../../components/ui/StatCard";
import { ProgressBar } from "../../components/ui/ProgressBar";

export function MoneyTracker() {
  const { state } = useApp();
  const totalIn = state.entrate.reduce((s, e) => s + e.amount, 0);
  const totalOut = state.spese.reduce((s, e) => s + e.amount, 0);
  const net = totalIn - totalOut;

  const byType: Record<string, number> = {};
  state.entrate.forEach((e) => {
    byType[e.type] = (byType[e.type] || 0) + e.amount;
  });

  return (
    <div>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#fff",
          margin: "0 0 20px",
        }}
      >
        💰 Money Tracker
      </h2>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        <StatCard
          label="Entrate"
          value={`€${totalIn.toLocaleString()}`}
          accent="#10b981"
        />
        <StatCard label="Spese" value={`€${totalOut}`} accent="#ef4444" />
        <StatCard
          label="Netto"
          value={`€${net.toLocaleString()}`}
          accent={net > 0 ? "#10b981" : "#ef4444"}
        />
      </div>

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
            marginBottom: 14,
          }}
        >
          Entrate per Tipo
        </div>
        {Object.entries(byType).map(([type, amount]) => (
          <div key={type} style={{ marginBottom: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                {type}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#10b981" }}>
                €{amount}
              </span>
            </div>
            <ProgressBar value={(amount / totalIn) * 100} color="#10b981" />
          </div>
        ))}
      </div>

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
          📥 Entrate
        </div>
        {state.entrate.map((e, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom:
                i < state.entrate.length - 1
                  ? "1px solid rgba(255,255,255,0.05)"
                  : "none",
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                {e.source}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                {e.type}
              </div>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#10b981" }}>
              +€{e.amount}
            </span>
          </div>
        ))}
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
          📤 Spese
        </div>
        {state.spese.map((e, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom:
                i < state.spese.length - 1
                  ? "1px solid rgba(255,255,255,0.05)"
                  : "none",
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                {e.item}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                {e.category}
              </div>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#ef4444" }}>
              −€{e.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
