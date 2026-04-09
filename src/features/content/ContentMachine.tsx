import { useState } from "react";
import { useApp } from "../../context/AppContext";
import type { ContentStatus } from "../../types";

const STATUS_COLORS: Record<ContentStatus, string> = {
  Idea: "#6366f1",
  Script: "#f59e0b",
  Pronto: "#10b981",
  Pubblicato: "#3b82f6",
  Analisi: "#8b5cf6",
};

const HOOK_BANK = [
  "Nessuno te lo dirà mai",
  "Il problema non è...",
  "Ho smesso di fare X e...",
  "3 cose che ho imparato",
  "La verità scomoda su...",
];

type Filter = "Tutti" | ContentStatus;
const FILTERS: Filter[] = ["Tutti", "Idea", "Script", "Pronto", "Pubblicato"];

export function ContentMachine() {
  const { state } = useApp();
  const [filter, setFilter] = useState<Filter>("Tutti");

  const filtered =
    filter === "Tutti"
      ? state.content
      : state.content.filter((c) => c.status === filter);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>
          🎬 Content Machine
        </h2>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                border: "none",
                background:
                  filter === s ? "#6366f1" : "rgba(255,255,255,0.06)",
                color: filter === s ? "#fff" : "rgba(255,255,255,0.5)",
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        {(Object.entries(STATUS_COLORS) as [ContentStatus, string][]).map(
          ([status, color]) => {
            const count = state.content.filter(
              (c) => c.status === status
            ).length;
            return (
              <div
                key={status}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: color,
                  }}
                />
                <span
                  style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}
                >
                  {status}
                </span>
                <span style={{ fontSize: 16, fontWeight: 700, color }}>
                  {count}
                </span>
              </div>
            );
          }
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((c) => (
          <div
            key={c.id}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
                flexWrap: "wrap",
                gap: 6,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#fff",
                    marginBottom: 3,
                  }}
                >
                  {c.title}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                  {c.platform} · {c.date}
                </div>
              </div>
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 600,
                  background: `${STATUS_COLORS[c.status]}22`,
                  color: STATUS_COLORS[c.status],
                }}
              >
                {c.status}
              </span>
            </div>
            {c.hook !== "—" && (
              <div
                style={{
                  background: "rgba(249,115,22,0.08)",
                  borderLeft: "3px solid #f97316",
                  padding: "6px 12px",
                  borderRadius: "0 6px 6px 0",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}
                >
                  HOOK:{" "}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#f97316",
                    fontStyle: "italic",
                  }}
                >
                  {c.hook}
                </span>
              </div>
            )}
            {c.views !== "—" && (
              <div style={{ display: "flex", gap: 16 }}>
                <span
                  style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}
                >
                  👁 {c.views}
                </span>
                <span
                  style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}
                >
                  ❤️ {c.engagement}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 20,
          background: "rgba(99,102,241,0.08)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: 10,
          padding: 16,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#6366f1",
            marginBottom: 8,
          }}
        >
          🏦 Banca Hook & Hashtag
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {HOOK_BANK.map((h, i) => (
            <span
              key={i}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 11,
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {h}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
