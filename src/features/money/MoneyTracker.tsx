import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { StatCard } from "../../components/ui/StatCard";
import { FormField, SelectField, AddButton } from "../../components/ui/FormField";
import { EmptyState } from "../../components/ui/EmptyState";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { toast } from "../../components/ui/Toast";
import type { MoneyEntry, MoneyExpense } from "../../types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const ENTRY_TYPES = ["Prodotto", "Sponsorship", "Affiliazione", "Servizio", "Freelance"];
const EXPENSE_CATEGORIES = ["Tool", "Infra", "Attrezzatura", "Marketing", "Formazione"];
const PIE_COLORS_IN = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"];
const PIE_COLORS_OUT = ["#ef4444", "#f97316", "#eab308", "#6366f1", "#14b8a6"];

const MONTHS = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

type MonthFilter = "all" | string; // "all" or "2026-04"

export function MoneyTracker() {
  const { state, setState } = useApp();
  const [showEntrata, setShowEntrata] = useState(false);
  const [showSpesa, setShowSpesa] = useState(false);
  const [monthFilter, setMonthFilter] = useState<MonthFilter>("all");
  const [deleteTarget, setDeleteTarget] = useState<{ type: "entrata" | "spesa"; idx: number } | null>(null);
  const today = new Date().toISOString().split("T")[0];
  const [entForm, setEntForm] = useState({ source: "", amount: "", type: ENTRY_TYPES[0], date: today });
  const [spForm, setSpForm] = useState({ item: "", amount: "", category: EXPENSE_CATEGORIES[0], date: today });

  // ── Filtro per mese ──────────────────────────────────────────────
  const availableMonths = useMemo(() => {
    const monthSet = new Set<string>();
    state.entrate.forEach((e) => { if (e.date) monthSet.add(e.date.slice(0, 7)); });
    state.spese.forEach((e) => { if (e.date) monthSet.add(e.date.slice(0, 7)); });
    return Array.from(monthSet).sort().reverse();
  }, [state.entrate, state.spese]);

  const filteredEntrate = useMemo(() => {
    if (monthFilter === "all") return state.entrate;
    return state.entrate.filter((e) => e.date && e.date.startsWith(monthFilter));
  }, [state.entrate, monthFilter]);

  const filteredSpese = useMemo(() => {
    if (monthFilter === "all") return state.spese;
    return state.spese.filter((e) => e.date && e.date.startsWith(monthFilter));
  }, [state.spese, monthFilter]);

  const totalIn = filteredEntrate.reduce((s, e) => s + e.amount, 0);
  const totalOut = filteredSpese.reduce((s, e) => s + e.amount, 0);
  const net = totalIn - totalOut;
  const margin = totalIn > 0 ? Math.round((net / totalIn) * 100) : 0;

  // ── Pie data ──────────────────────────────────────────────────────
  const byType: Record<string, number> = {};
  filteredEntrate.forEach((e) => { byType[e.type] = (byType[e.type] || 0) + e.amount; });

  const byCategory: Record<string, number> = {};
  filteredSpese.forEach((e) => { byCategory[e.category] = (byCategory[e.category] || 0) + e.amount; });

  // ── Monthly trend bar chart ───────────────────────────────────────
  const monthlyTrend = useMemo(() => {
    const map: Record<string, { month: string; entrate: number; spese: number }> = {};
    state.entrate.forEach((e) => {
      const key = e.date ? e.date.slice(0, 7) : "senza-data";
      if (!map[key]) map[key] = { month: key, entrate: 0, spese: 0 };
      map[key].entrate += e.amount;
    });
    state.spese.forEach((e) => {
      const key = e.date ? e.date.slice(0, 7) : "senza-data";
      if (!map[key]) map[key] = { month: key, entrate: 0, spese: 0 };
      map[key].spese += e.amount;
    });
    return Object.values(map)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map((d) => ({
        ...d,
        label: d.month === "senza-data" ? "N/D" : MONTHS[parseInt(d.month.slice(5, 7)) - 1] || d.month,
      }));
  }, [state.entrate, state.spese]);

  // ── CRUD ──────────────────────────────────────────────────────────
  const addEntrata = () => {
    const amount = parseFloat(entForm.amount);
    if (!entForm.source.trim() || isNaN(amount) || amount <= 0) return;
    const entry: MoneyEntry = { source: entForm.source.trim(), amount, type: entForm.type, date: entForm.date };
    setState((s) => ({ ...s, entrate: [...s.entrate, entry] }));
    setEntForm({ source: "", amount: "", type: ENTRY_TYPES[0], date: today });
    setShowEntrata(false);
    toast("Entrata aggiunta!", "success");
  };

  const addSpesa = () => {
    const amount = parseFloat(spForm.amount);
    if (!spForm.item.trim() || isNaN(amount) || amount <= 0) return;
    const expense: MoneyExpense = { item: spForm.item.trim(), amount, category: spForm.category, date: spForm.date };
    setState((s) => ({ ...s, spese: [...s.spese, expense] }));
    setSpForm({ item: "", amount: "", category: EXPENSE_CATEGORIES[0], date: today });
    setShowSpesa(false);
    toast("Spesa registrata!", "success");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "entrata") {
      setState((s) => ({ ...s, entrate: s.entrate.filter((_, i) => i !== deleteTarget.idx) }));
      toast("Entrata eliminata", "info");
    } else {
      setState((s) => ({ ...s, spese: s.spese.filter((_, i) => i !== deleteTarget.idx) }));
      toast("Spesa eliminata", "info");
    }
    setDeleteTarget(null);
  };

  const formatMonth = (key: string) => {
    const [y, m] = key.split("-");
    return `${MONTHS[parseInt(m) - 1]} ${y}`;
  };

  return (
    <div>
      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Eliminare ${deleteTarget?.type === "entrata" ? "entrata" : "spesa"}?`}
        message="Questa voce verrà rimossa definitivamente."
        confirmLabel="Elimina"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>
          💰 Money Tracker
        </h2>
        {/* Month filter */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button
            onClick={() => setMonthFilter("all")}
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              border: "none",
              background: monthFilter === "all" ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
              color: monthFilter === "all" ? "#fff" : "rgba(255,255,255,0.5)",
              fontSize: 11,
              fontWeight: monthFilter === "all" ? 600 : 500,
              cursor: "pointer",
            }}
          >
            Tutto
          </button>
          {availableMonths.map((m) => (
            <button
              key={m}
              onClick={() => setMonthFilter(m)}
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                border: "none",
                background: monthFilter === m ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
                color: monthFilter === m ? "#fff" : "rgba(255,255,255,0.5)",
                fontSize: 11,
                fontWeight: monthFilter === m ? 600 : 500,
                cursor: "pointer",
              }}
            >
              {formatMonth(m)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Entrate" value={`€${totalIn.toLocaleString()}`} accent="#10b981" />
        <StatCard label="Spese" value={`€${totalOut.toLocaleString()}`} accent="#ef4444" />
        <StatCard
          label="Netto"
          value={`€${net.toLocaleString()}`}
          sub={totalIn > 0 ? `Margine: ${margin}%` : undefined}
          accent={net >= 0 ? "#10b981" : "#ef4444"}
        />
      </div>

      {/* Charts row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        {/* Pie Entrate */}
        <div className="glass-panel" style={{ flex: 1, minWidth: 280, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>
            📥 Distribuzione Entrate
          </div>
          {Object.keys(byType).length === 0 ? (
            <EmptyState icon="📊" title="Nessun dato" description="Aggiungi entrate per vedere il grafico." />
          ) : (
            <div style={{ height: 220, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(byType).map(([name, value]) => ({ name, value }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {Object.keys(byType).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS_IN[i % PIE_COLORS_IN.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "rgba(0,0,0,0.85)", borderColor: "rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }}
                    formatter={(value: any) => `€${value}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Pie Spese */}
        <div className="glass-panel" style={{ flex: 1, minWidth: 280, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>
            📤 Distribuzione Spese
          </div>
          {Object.keys(byCategory).length === 0 ? (
            <EmptyState icon="📊" title="Nessun dato" description="Aggiungi spese per vedere il grafico." />
          ) : (
            <div style={{ height: 220, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(byCategory).map(([name, value]) => ({ name, value }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {Object.keys(byCategory).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS_OUT[i % PIE_COLORS_OUT.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "rgba(0,0,0,0.85)", borderColor: "rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }}
                    formatter={(value: any) => `€${value}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Trend Bar Chart */}
      {monthlyTrend.length > 1 && (
        <div className="glass-panel" style={{ padding: 18, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>
            📈 Trend Mensile (ultimi 6 mesi)
          </div>
          <div style={{ height: 200, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(0,0,0,0.85)", borderColor: "rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }}
                  formatter={(value: any, name: any) => [`€${value}`, name === "entrate" ? "Entrate" : "Spese"]}
                />
                <Bar dataKey="entrate" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spese" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Entrate */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: 18,
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>📥 Entrate</div>
          <AddButton onClick={() => setShowEntrata(!showEntrata)} label="Entrata" />
        </div>

        {showEntrata && (
          <div
            style={{
              background: "rgba(16,185,129,0.06)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: 10,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              <FormField label="Fonte" value={entForm.source} onChange={(e) => setEntForm({ ...entForm, source: e.target.value })} placeholder="Es. Template Notion" />
              <FormField label="Importo (€)" type="number" value={entForm.amount} onChange={(e) => setEntForm({ ...entForm, amount: e.target.value })} placeholder="0" />
              <FormField label="Data" type="date" value={entForm.date} onChange={(e) => setEntForm({ ...entForm, date: e.target.value })} />
              <SelectField label="Tipo" value={entForm.type} onChange={(v) => setEntForm({ ...entForm, type: v })} options={ENTRY_TYPES} />
            </div>
            <button onClick={addEntrata} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", minHeight: 40 }}>
              Aggiungi Entrata
            </button>
          </div>
        )}

        {filteredEntrate.length === 0 ? (
          <EmptyState icon="📥" title="Nessuna entrata" description={monthFilter !== "all" ? "Nessuna entrata in questo mese." : "Registra la prima entrata per iniziare a tracciare."} action={{ label: "+ Nuova Entrata", onClick: () => setShowEntrata(true) }} />
        ) : (
          filteredEntrate.map((e, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < filteredEntrate.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{e.source}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{e.type}{e.date ? ` · ${e.date}` : ""}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#10b981" }}>+€{e.amount}</span>
                <button onClick={() => setDeleteTarget({ type: "entrata", idx: state.entrate.indexOf(e) })} className="delete-btn" aria-label={`Elimina entrata: ${e.source}`}>×</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Spese */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: 18,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>📤 Spese</div>
          <AddButton onClick={() => setShowSpesa(!showSpesa)} label="Spesa" />
        </div>

        {showSpesa && (
          <div
            style={{
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 10,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              <FormField label="Voce" value={spForm.item} onChange={(e) => setSpForm({ ...spForm, item: e.target.value })} placeholder="Es. Canva Pro" />
              <FormField label="Importo (€)" type="number" value={spForm.amount} onChange={(e) => setSpForm({ ...spForm, amount: e.target.value })} placeholder="0" />
              <FormField label="Data" type="date" value={spForm.date} onChange={(e) => setSpForm({ ...spForm, date: e.target.value })} />
              <SelectField label="Categoria" value={spForm.category} onChange={(v) => setSpForm({ ...spForm, category: v })} options={EXPENSE_CATEGORIES} />
            </div>
            <button onClick={addSpesa} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", minHeight: 40 }}>
              Aggiungi Spesa
            </button>
          </div>
        )}

        {filteredSpese.length === 0 ? (
          <EmptyState icon="📤" title="Nessuna spesa" description={monthFilter !== "all" ? "Nessuna spesa in questo mese." : "Registra la prima spesa per iniziare."} action={{ label: "+ Nuova Spesa", onClick: () => setShowSpesa(true) }} />
        ) : (
          filteredSpese.map((e, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < filteredSpese.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{e.item}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{e.category}{e.date ? ` · ${e.date}` : ""}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#ef4444" }}>−€{e.amount}</span>
                <button onClick={() => setDeleteTarget({ type: "spesa", idx: state.spese.indexOf(e) })} className="delete-btn" aria-label={`Elimina spesa: ${e.item}`}>×</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
