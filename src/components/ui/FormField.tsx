import type { CSSProperties, InputHTMLAttributes } from "react";

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
};

const labelStyle: CSSProperties = {
  fontSize: 11,
  color: "rgba(255,255,255,0.45)",
  textTransform: "uppercase",
  letterSpacing: 0.8,
  marginBottom: 4,
  display: "block",
};

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormField({ label, ...props }: FormFieldProps) {
  return (
    <div style={{ flex: 1, minWidth: 120 }}>
      <label style={labelStyle}>{label}</label>
      <input style={inputStyle} {...props} />
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
        style={{ ...inputStyle, cursor: "pointer" }}
      >
        {options.map((o) => (
          <option key={o} value={o} style={{ background: "#1a1a1b" }}>
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
        padding: "8px 16px",
        borderRadius: 8,
        border: "none",
        background: "#f97316",
        color: "#fff",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      + {label}
    </button>
  );
}
