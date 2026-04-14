import type { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  glow?: string;
}

export const cardBase: CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--radius-md)",
  padding: 20,
  backdropFilter: "blur(12px)",
  boxShadow: "var(--shadow-card)",
  position: "relative",
  overflow: "hidden",
};

export function Card({ children, style, glow }: CardProps) {
  return (
    <div style={{ ...cardBase, ...style }}>
      {glow && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            right: "15%",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${glow}, transparent)`,
            opacity: 0.3,
          }}
        />
      )}
      {children}
    </div>
  );
}

export const sectionTitle: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: 13,
  fontWeight: 700,
  color: "var(--text-secondary)",
  letterSpacing: 0.3,
  marginBottom: 14,
};

export const pageTitle: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: 22,
  fontWeight: 800,
  color: "var(--text-primary)",
  margin: "0 0 22px",
  letterSpacing: -0.5,
};
