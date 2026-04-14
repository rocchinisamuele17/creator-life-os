import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StatCard } from "../../components/ui/StatCard";
import { Card, sectionTitle, pageTitle } from "../../components/ui/Card";
import { FormField, SelectField, AddButton } from "../../components/ui/FormField";
import type { BrandDeal, BrandStatus } from "../../types";

const STATUSES: BrandStatus[] = ["Proposta", "Negoziazione", "Attivo", "Completato"];

const STATUS_STYLE: Record<BrandStatus, { color: string }> = {
  Attivo: { color: "var(--success)" },
  Negoziazione: { color: "var(--amber)" },
  Proposta: { color: "var(--purple)" },
  Completato: { color: "var(--info)" },
};

const emptyForm = { brand: "", value: "", deadline: "", deliverables: "", status: "Proposta" as BrandStatus };

export function BrandDeals() {
  const { state, setState } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const totalActive = state.brands.filter((b) => b.status === "Attivo" || b.status === "Completato").reduce((s, b) => s + b.value, 0);
  const totalPending = state.brands.filter((b) => b.status === "Negoziazione" || b.status === "Proposta").reduce((s, b) => s + b.value, 0);

  const addDeal = () => {
    const value = parseFloat(form.value);
    if (!form.brand.trim() || isNaN(value) || value <= 0) return;
    const deal: BrandDeal = { brand: form.brand.trim(), status: form.status, value, deadline: form.deadline || "—", deliverables: form.deliverables || "—", paid: false };
    setState((s) => ({ ...s, brands: [...s.brands, deal] }));
    setForm(emptyForm);
    setShowForm(false);
  };

  const updateStatus = (idx: number, status: BrandStatus) => {
    setState((s) => ({ ...s, brands: s.brands.map((b, i) => (i === idx ? { ...b, status } : b)) }));
  };

  const togglePaid = (idx: number) => {
    setState((s) => ({ ...s, brands: s.brands.map((b, i) => (i === idx ? { ...b, paid: !b.paid } : b)) }));
  };

  const deleteDeal = (idx: number) => {
    setState((s) => ({ ...s, brands: s.brands.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="stagger-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
        <h2 style={pageTitle}>Brand Deals</h2>
        <AddButton onClick={() => setShowForm(!showForm)} label="Deal" />
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Fatturato Confermato" value={`€${totalActive.toLocaleString()}`} accent="var(--success)" />
        <StatCard label="In Pipeline" value={`€${totalPending.toLocaleString()}`} accent="var(--amber)" />
        <StatCard label="Deal Totali" value={state.brands.length} accent="var(--purple)" />
      </div>

      {showForm && (
        <Card style={{ marginBottom: 18, borderColor: "rgba(229, 166, 59, 0.2)" }} glow="var(--accent)">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            <FormField label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Es. NordVPN" />
            <FormField label="Valore (€)" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="0" />
            <SelectField label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v as BrandStatus })} options={STATUSES} />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            <FormField label="Scadenza" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} placeholder="Es. 30 Apr" />
            <FormField label="Deliverables" value={form.deliverables} onChange={(e) => setForm({ ...form, deliverables: e.target.value })} placeholder="Es. 2 Reel + 1 Story" />
          </div>
          <button onClick={addDeal}
            style={{ padding: "10px 22px", borderRadius: "var(--radius-sm)", border: "none", background: "var(--accent)", color: "#080b14", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
            Aggiungi Deal
          </button>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {state.brands.map((b, i) => {
          const st = STATUS_STYLE[b.status];
          return (
            <Card key={i} style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "var(--bg-surface-hover)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 17, fontWeight: 800, color: "var(--text-muted)",
                    fontFamily: "var(--font-display)",
                  }}>{b.brand[0]}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{b.brand}</div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 2 }}>Scadenza: {b.deadline}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <select value={b.status} onChange={(e) => updateStatus(i, e.target.value as BrandStatus)}
                    style={{
                      padding: "4px 10px", borderRadius: "var(--radius-full)", fontSize: 10, fontWeight: 600,
                      background: `color-mix(in srgb, ${st.color} 12%, transparent)`,
                      color: st.color, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", appearance: "none",
                    }}>
                    {STATUSES.map((s) => <option key={s} value={s} style={{ background: "#0e1220", color: "#fff" }}>{s}</option>)}
                  </select>
                  <button onClick={() => deleteDeal(i)} style={{ background: "none", border: "none", color: "var(--text-ghost)", cursor: "pointer", fontSize: 14 }}>×</button>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Deliverables</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 3 }}>{b.deliverables}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Valore</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--success)", fontFamily: "var(--font-display)", marginTop: 2 }}>€{b.value}</div>
                </div>
              </div>
              <div onClick={() => togglePaid(i)}
                style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
                <div style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: b.paid ? "var(--success)" : "var(--text-ghost)",
                  boxShadow: b.paid ? "0 0 8px var(--success)" : "none",
                  transition: "all 0.2s",
                }} />
                <span style={{ fontSize: 11, color: b.paid ? "var(--success)" : "var(--text-muted)", fontWeight: 500 }}>
                  {b.paid ? "Pagato" : "Non pagato — clicca per segnare"}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Template */}
      <Card style={{ marginTop: 20 }} glow="var(--accent)">
        <div style={{ ...sectionTitle, color: "var(--accent)" }}>📋 Template Proposta</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.8, fontWeight: 400 }}>
          Ciao [Brand],<br />
          Sono [Nome], content creator con [X] follower su Instagram nel settore [nicchia].<br />
          Il mio pubblico è composto da [target]. Engagement rate: [X%].<br />
          Propongo: [deliverables] a [prezzo].<br />
          Media kit in allegato. Possiamo sentirci?
        </div>
      </Card>
    </div>
  );
}
