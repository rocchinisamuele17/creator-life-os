import { useApp } from "../../context/AppContext";
import { StatCard } from "../../components/ui/StatCard";
import type { BrandStatus } from "../../types";

const STATUS_STYLE: Record<BrandStatus, { bg: string; color: string }> = {
  Attivo: { bg: "#10b98122", color: "#10b981" },
  Negoziazione: { bg: "#f59e0b22", color: "#f59e0b" },
  Proposta: { bg: "#6366f122", color: "#6366f1" },
  Completato: { bg: "#3b82f622", color: "#3b82f6" },
};

export function BrandDeals() {
  const { state } = useApp();

  const totalActive = state.brands
    .filter((b) => b.status === "Attivo" || b.status === "Completato")
    .reduce((s, b) => s + b.value, 0);
  const totalPending = state.brands
    .filter((b) => b.status === "Negoziazione" || b.status === "Proposta")
    .reduce((s, b) => s + b.value, 0);

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
        🤝 Brand Deal Manager
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
          label="Fatturato Confermato"
          value={`€${totalActive.toLocaleString()}`}
          accent="#10b981"
        />
        <StatCard
          label="In Pipeline"
          value={`€${totalPending.toLocaleString()}`}
          accent="#f59e0b"
        />
        <StatCard label="Deal Totali" value={state.brands.length} accent="#6366f1" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {state.brands.map((b, i) => {
          const st = STATUS_STYLE[b.status];
          return (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {b.brand[0]}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#fff",
                      }}
                    >
                      {b.brand}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}
                    >
                      Scadenza: {b.deadline}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    background: st.bg,
                    color: st.color,
                  }}
                >
                  {b.status}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}
                  >
                    Deliverables
                  </div>
                  <div
                    style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}
                  >
                    {b.deliverables}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}
                  >
                    Valore
                  </div>
                  <div
                    style={{ fontSize: 16, fontWeight: 700, color: "#10b981" }}
                  >
                    €{b.value}
                  </div>
                </div>
              </div>
              {b.paid && (
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#10b981",
                    }}
                  />
                  <span style={{ fontSize: 11, color: "#10b981" }}>Pagato</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 20,
          background: "rgba(249,115,22,0.06)",
          border: "1px solid rgba(249,115,22,0.15)",
          borderRadius: 10,
          padding: 16,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#f97316",
            marginBottom: 6,
          }}
        >
          📋 Template Proposta
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.6,
          }}
        >
          Ciao [Brand],
          <br />
          Sono [Nome], content creator con [X] follower su Instagram nel settore [nicchia].
          <br />
          Il mio pubblico è composto da [target]. Engagement rate: [X%].
          <br />
          Propongo: [deliverables] a [prezzo].
          <br />
          Media kit in allegato. Possiamo sentirci?
        </div>
      </div>
    </div>
  );
}
