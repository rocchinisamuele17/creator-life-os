import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StatCard } from "../../components/ui/StatCard";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Card, sectionTitle, pageTitle } from "../../components/ui/Card";
import { FormField, SelectField, AddButton } from "../../components/ui/FormField";
import type { MoneyEntry, MoneyExpense } from "../../types";

const ENTRY_TYPES = ["Prodotto", "Sponsorship", "Affiliazione", "Servizio", "Freelance"];
const EXPENSE_CATEGORIES = ["Tool", "Infra", "Attrezzatura", "Marketing", "Formazione"];

export function MoneyTracker() {
  const { state, setState } = useApp();
  const [showEntrata, setShowEntrata] = useState(false);
  const [showSpesa, setShowSpesa] = useState(false);
  const [entForm, setEntForm] = useState({ source: "", amount: "", type: ENTRY_TYPES[0] });
  const [spForm, setSpForm] = useState({ item: "", amount: "", category: EXPENSE_CATEGORIES[0] });

  const totalIn = state.entrate.reduce((s, e) => s + e.amount, 0);
  const totalOut = state.spese.reduce((s, e) => s + e.amount, 0);
  const net = totalIn - totalOut;

  const byType: Record<string, number> = {};
  state.entrate.forEach((e) => { byType[e.type] = (byType[e.type] || 0) + e.amount; });

  const addEntrata = () => {
    const amount = parseFloat(entForm.amount);
    if (!entForm.source.trim() || isNaN(amount) || amount <= 0) return;
    const entry: MoneyEntry = { source: entForm.source.trim(), amount, type: entForm.type };
    setState((s) => ({ ...s, entrate: [...s.entrate, entry] }));
    setEntForm({ source: "", amount: "", type: ENTRY_TYPES[0] });
    setShowEntrata(false);
  };

  const addSpesa = () => {
    const amount = parseFloat(spForm.amount);
    if (!spForm.item.trim() || isNaN(amount) || amount <= 0) return;
    const expense: MoneyExpense = { item: spForm.item.trim(), amount, category: spForm.category };
    setState((s) => ({ ...s, spese: [...s.spese, expense] }));
    setSpForm({ item: "", amount: "", category: EXPENSE_CATEGORIES[0] });
    setShowSpesa(false);
  };

  const deleteEntrata = (idx: number) => { setState((s) => ({ ...s, entrate: s.entrate.filter((_, i) => i !== idx) })); };
  const deleteSpesa = (idx: number) => { setState((s) => ({ ...s, spese: s.spese.filter((_, i) => i !== idx) })); };

  return (
    <div className="stagger-in">
      <h2 style={pageTitle}>Money Tracker</h2>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Entrate" value={`€${totalIn.toLocaleString()}`} accent="var(--success)" />
        <StatCard label="Spese" value={`€${totalOut}`} accent="var(--danger)" />
        <StatCard label="Netto" value={`€${net.toLocaleString()}`} accent={net > 0 ? "var(--success)" : "var(--danger)"} />
      </div>

      {/* By type */}
      <Card style={{ marginBottom: 16 }} glow="var(--success)">
        <div style={sectionTitle}>Entrate per Tipo</div>
        {Object.entries(byType).map(([type, amount]) => (
          <div key={type} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 400 }}>{type}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--success)", fontFamily: "var(--font-display)" }}>€{amount}</span>
            </div>
            <ProgressBar value={(amount / totalIn) * 100} color="var(--success)" />
          </div>
        ))}
      </Card>

      {/* Entrate */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={sectionTitle}>📥 Entrate</div>
          <AddButton onClick={() => setShowEntrata(!showEntrata)} label="Entrata" />
        </div>

        {showEntrata && (
          <div style={{ background: "var(--success-muted)", border: "1px solid rgba(52, 211, 153, 0.15)", borderRadius: "var(--radius-sm)", padding: 14, marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              <FormField label="Fonte" value={entForm.source} onChange={(e) => setEntForm({ ...entForm, source: e.target.value })} placeholder="Es. Template Notion" />
              <FormField label="Importo (€)" type="number" value={entForm.amount} onChange={(e) => setEntForm({ ...entForm, amount: e.target.value })} placeholder="0" />
              <SelectField label="Tipo" value={entForm.type} onChange={(v) => setEntForm({ ...entForm, type: v })} options={ENTRY_TYPES} />
            </div>
            <button onClick={addEntrata}
              style={{ padding: "9px 18px", borderRadius: "var(--radius-sm)", border: "none", background: "var(--success)", color: "#080b14", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
              Aggiungi Entrata
            </button>
          </div>
        )}

        {state.entrate.map((e, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0",
            borderBottom: i < state.entrate.length - 1 ? "1px solid var(--border-subtle)" : "none",
          }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 400 }}>{e.source}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 2 }}>{e.type}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--success)", fontFamily: "var(--font-display)" }}>+€{e.amount}</span>
              <button onClick={() => deleteEntrata(i)} style={{ background: "none", border: "none", color: "var(--text-ghost)", cursor: "pointer", fontSize: 14 }}>×</button>
            </div>
          </div>
        ))}
      </Card>

      {/* Spese */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={sectionTitle}>📤 Spese</div>
          <AddButton onClick={() => setShowSpesa(!showSpesa)} label="Spesa" />
        </div>

        {showSpesa && (
          <div style={{ background: "var(--danger-muted)", border: "1px solid rgba(244, 63, 94, 0.15)", borderRadius: "var(--radius-sm)", padding: 14, marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              <FormField label="Voce" value={spForm.item} onChange={(e) => setSpForm({ ...spForm, item: e.target.value })} placeholder="Es. Canva Pro" />
              <FormField label="Importo (€)" type="number" value={spForm.amount} onChange={(e) => setSpForm({ ...spForm, amount: e.target.value })} placeholder="0" />
              <SelectField label="Categoria" value={spForm.category} onChange={(v) => setSpForm({ ...spForm, category: v })} options={EXPENSE_CATEGORIES} />
            </div>
            <button onClick={addSpesa}
              style={{ padding: "9px 18px", borderRadius: "var(--radius-sm)", border: "none", background: "var(--danger)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
              Aggiungi Spesa
            </button>
          </div>
        )}

        {state.spese.map((e, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0",
            borderBottom: i < state.spese.length - 1 ? "1px solid var(--border-subtle)" : "none",
          }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 400 }}>{e.item}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 2 }}>{e.category}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--danger)", fontFamily: "var(--font-display)" }}>−€{e.amount}</span>
              <button onClick={() => deleteSpesa(i)} style={{ background: "none", border: "none", color: "var(--text-ghost)", cursor: "pointer", fontSize: 14 }}>×</button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
