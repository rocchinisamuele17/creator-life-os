import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StatCard } from "../../components/ui/StatCard";
import { FormField, SelectField, AddButton } from "../../components/ui/FormField";
import type { BrandDeal, BrandStatus } from "../../types";

const STATUSES: BrandStatus[] = ["Proposta", "Negoziazione", "Attivo", "Completato"];

const STATUS_STYLE: Record<BrandStatus, { bg: string; color: string }> = {
  Attivo: { bg: "#10b98122", color: "#10b981" },
  Negoziazione: { bg: "#f59e0b22", color: "#f59e0b" },
  Proposta: { bg: "#6366f122", color: "#6366f1" },
  Completato: { bg: "#3b82f622", color: "#3b82f6" },
};

const emptyForm = {
  brand: "",
  value: "",
  deadline: "",
  deliverables: "",
  status: "Proposta" as BrandStatus,
};

export function BrandDeals() {
  const { state, setState } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const totalActive = state.brands
    .filter((b) => b.status === "Attivo" || b.status === "Completato")
    .reduce((s, b) => s + b.value, 0);
  const totalPending = state.brands
    .filter((b) => b.status === "Negoziazione" || b.status === "Proposta")
    .reduce((s, b) => s + b.value, 0);

  const addDeal = () => {
    const value = parseFloat(form.value);
    if (!form.brand.trim() || isNaN(value) || value <= 0) return;
    const deal: BrandDeal = {
      brand: form.brand.trim(),
      status: form.status,
      value,
      deadline: form.deadline || "—",
      deliverables: form.deliverables || "—",
      paid: false,
    };
    setState((s) => ({ ...s, brands: [...s.brands, deal] }));
    setForm(emptyForm);
    setShowForm(false);
  };

  const updateStatus = (idx: number, status: BrandStatus) => {
    setState((s) => ({
      ...s,
      brands: s.brands.map((b, i) => (i === idx ? { ...b, status } : b)),
    }));
  };

  const togglePaid = (idx: number) => {
    setState((s) => ({
      ...s,
      brands: s.brands.map((b, i) => (i === idx ? { ...b, paid: !b.paid } : b)),
    }));
  };

  const deleteDeal = (idx: number) => {
    setState((s) => ({ ...s, brands: s.brands.filter((_, i) => i !== idx) }));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>
          🤝 Brand Deal Manager
        </h2>
        <AddButton onClick={() => setShowForm(!showForm)} label="Deal" />
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Fatturato Confermato" value={`€${totalActive.toLocaleString()}`} accent="#10b981" />
        <StatCard label="In Pipeline" value={`€${totalPending.toLocaleString()}`} accent="#f59e0b" />
        <StatCard label="Deal Totali" value={state.brands.length} accent="#6366f1" />
      </div>

      {showForm && (
        <div
          style={{
            background: "rgba(249,115,22,0.06)",
            border: "1px solid rgba(249,115,22,0.2)",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            <FormField
              label="Brand"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              placeholder="Es. NordVPN"
            />
            <FormField
              label="Valore (€)"
              type="number"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              placeholder="0"
            />
            <SelectField
              label="Status"
              value={form.status}
              onChange={(v) => setForm({ ...form, status: v as BrandStatus })}
              options={STATUSES}
            />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
            <FormField
              label="Scadenza"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              placeholder="Es. 30 Apr"
            />
            <FormField
              label="Deliverables"
              value={form.deliverables}
              onChange={(e) => setForm({ ...form, deliverables: e.target.value })}
              placeholder="Es. 2 Reel + 1 Story"
            />
          </div>
          <button
            onClick={addDeal}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: "#f97316",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Aggiungi Deal
          </button>
        </div>
      )}

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
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{b.brand}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                      Scadenza: {b.deadline}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(i, e.target.value as BrandStatus)}
                    style={{
                      padding: "3px 8px",
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 600,
                      background: st.bg,
                      color: st.color,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} style={{ background: "#1a1a1b" }}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => deleteDeal(i)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(255,255,255,0.25)",
                      cursor: "pointer",
                      fontSize: 14,
                      padding: "2px 4px",
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Deliverables</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{b.deliverables}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Valore</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#10b981" }}>€{b.value}</div>
                </div>
              </div>
              <div
                onClick={() => togglePaid(i)}
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: b.paid ? "#10b981" : "rgba(255,255,255,0.2)",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: b.paid ? "#10b981" : "rgba(255,255,255,0.35)",
                  }}
                >
                  {b.paid ? "Pagato" : "Non pagato — clicca per segnare"}
                </span>
              </div>
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
        <div style={{ fontSize: 13, fontWeight: 600, color: "#f97316", marginBottom: 6 }}>
          📋 Template Proposta
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
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
