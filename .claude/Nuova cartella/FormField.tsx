import { useId } from "react";
import type { CSSProperties, InputHTMLAttributes } from "react";

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  fontSize: 14,
  fontFamily: "inherit",
  minHeight: 44,
};

const labelStyle: CSSProperties = {
  fontSize: 11,
  color: "rgba(255,255,255,0.55)",
  textTransform: "uppercase",
  letterSpacing: 0.8,
  marginBottom: 4,
  display: "block",
  fontWeight: 600,
};

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormField({ label, ...props }: FormFieldProps) {
  const id = useId();
  return (
    <div style={{ flex: 1, minWidth: 120 }}>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      <input id={id} style={inputStyle} {...props} />
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
  const id = useId();
  return (
    <div style={{ flex: 1, minWidth: 120 }}>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      <select
        id={id}
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
      className="touch-target"
      style={{
        padding: "10px 18px",
        borderRadius: 8,
        border: "none",
        background: "#f97316",
        color: "#fff",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        minHeight: 44,
      }}
    >
      + {label}
    </button>
  );
}
