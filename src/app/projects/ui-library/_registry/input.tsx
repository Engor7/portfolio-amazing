"use client";
import { useState } from "react";
import { Input } from "../_ui/Input";
import type { ComponentMeta } from "./index";

const InputDemo = () => {
  const [value, setValue] = useState("");
  const [withError, setWithError] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 320 }}>
      <Input
        label="Name"
        placeholder="Enter your name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Input
        label="Email"
        placeholder="you@example.com"
        value={withError}
        onChange={(e) => setWithError(e.target.value)}
        error={withError && !withError.includes("@") ? "Enter a valid email" : undefined}
      />
      <Input label="Disabled" placeholder="Can't touch this" disabled />
    </div>
  );
};

export const inputMeta: ComponentMeta = {
  slug: "input",
  name: "Input",
  description: "A text input with optional label and error message.",
  usage: `import { Input } from "./_ui/Input";

<Input label="Name" placeholder="Enter your name" value={value} onChange={(e) => setValue(e.target.value)} />`,
  props: [
    { name: "label", type: "string", default: "—", description: "Label displayed above the input." },
    { name: "placeholder", type: "string", default: "—", description: "Placeholder text." },
    { name: "value", type: "string", default: "—", description: "Controlled value." },
    { name: "onChange", type: "(e: ChangeEvent) => void", default: "—", description: "Change handler." },
    { name: "error", type: "string", default: "—", description: "Error message shown below input." },
    { name: "disabled", type: "boolean", default: "false", description: "Disables the input." },
  ],
  demo: InputDemo,
  source: `import type { CSSProperties, InputHTMLAttributes } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const wrapStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: 4 };
const labelStyle: CSSProperties = { fontSize: 13, fontWeight: 500, color: "#1a1a1a" };
const inputStyle: CSSProperties = {
  padding: "8px 12px",
  fontSize: 14,
  border: "1px solid #d4d4d4",
  borderRadius: 6,
  outline: "none",
  background: "#fff",
  color: "#1a1a1a",
  fontFamily: "inherit",
};
const errorBorder: CSSProperties = { borderColor: "#e53e3e" };
const disabledStyle: CSSProperties = { background: "#f5f5f5", cursor: "not-allowed", color: "#999" };
const errorTextStyle: CSSProperties = { fontSize: 12, color: "#e53e3e" };

export const Input = ({ label, error, style, ...props }: InputProps) => (
  <div style={wrapStyle}>
    {label && <label style={labelStyle}>{label}</label>}
    <input
      style={{
        ...inputStyle,
        ...(error ? errorBorder : {}),
        ...(props.disabled ? disabledStyle : {}),
        ...style,
      }}
      {...props}
    />
    {error && <span style={errorTextStyle}>{error}</span>}
  </div>
);`,
};
