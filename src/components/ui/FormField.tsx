import type { CSSProperties, InputHTMLAttributes } from "react";

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-medium)",
  background: "rgba(255,255,255,0.04)",
  color: "var(--text-primary)",
  fontSize: 13,
  fontFamily: "var(--font-body)",
  outline: "none",
  transition: "border-color 0.2s ease, background 0.2s ease",
  boxSizing: "border-box" as const,
};

const labelStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 10,
  fontWeight: 600,
  color: "var(--text-muted)",
  textTransform: "uppercase",
  letterSpacing: 1.2,
  marginBottom: 5,
  display: "block",
};

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormField({ label, ...props }: FormFieldProps) {
  return (
    <div style={{ flex: 1, minWidth: 120 }}>
      <label style={labelStyle}>{label}</label>
      <input
        style={inputStyle}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--accent)";
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border-medium)";
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }}
        {...props}
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div style={{ flex: 1, minWidth: 120 }}>
      <label style={labelStyle}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
      >
        {options.map((o) => (
          <option key={o} value={o} style={{ background: "#0e1220", color: "#fff" }}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 16px",
        borderRadius: "var(--radius-full)",
        border: "1px solid var(--accent)",
        background: "var(--accent-muted)",
        color: "var(--accent-light)",
        fontSize: 11,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "var(--font-body)",
        letterSpacing: 0.3,
        transition: "all 0.2s ease",
        textTransform: "uppercase",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--accent)";
        e.currentTarget.style.color = "#080b14";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--accent-muted)";
        e.currentTarget.style.color = "var(--accent-light)";
      }}
    >
      + {label}
    </button>
  );
}
