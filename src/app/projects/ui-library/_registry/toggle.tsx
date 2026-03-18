"use client";
import { useState } from "react";
import { Toggle } from "../_ui/Toggle";
import type { ComponentMeta } from "./index";

const ToggleDemo = () => {
  const [on, setOn] = useState(false);
  const [labeled, setLabeled] = useState(true);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Toggle checked={on} onChange={setOn} label={on ? "On" : "Off"} />
      <Toggle checked={labeled} onChange={setLabeled} label="Notifications" />
      <Toggle checked={false} onChange={() => {}} label="Disabled" disabled />
    </div>
  );
};

export const toggleMeta: ComponentMeta = {
  slug: "toggle",
  name: "Toggle",
  description: "A switch input for boolean values, with optional label.",
  usage: `import { Toggle } from "./_ui/Toggle";

const [on, setOn] = useState(false);
<Toggle checked={on} onChange={setOn} label="Enable feature" />`,
  props: [
    { name: "checked", type: "boolean", default: "—", description: "Current on/off state." },
    { name: "onChange", type: "(checked: boolean) => void", default: "—", description: "Called with new value on toggle." },
    { name: "label", type: "string", default: "—", description: "Label shown next to the toggle." },
    { name: "disabled", type: "boolean", default: "false", description: "Prevents interaction when true." },
  ],
  demo: ToggleDemo,
  source: `import type { CSSProperties } from "react";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const wrapStyle = (disabled: boolean): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.45 : 1,
});
const trackStyle = (checked: boolean): CSSProperties => ({
  position: "relative",
  width: 40,
  height: 22,
  borderRadius: 999,
  background: checked ? "#1a1a1a" : "#d4d4d4",
  transition: "background 0.2s",
  flexShrink: 0,
});
const thumbStyle = (checked: boolean): CSSProperties => ({
  position: "absolute",
  top: 3,
  left: 3,
  width: 16,
  height: 16,
  borderRadius: "50%",
  background: "#fff",
  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  transition: "transform 0.2s",
  transform: checked ? "translateX(18px)" : "none",
});
const labelStyle: CSSProperties = { fontSize: 14, color: "#1a1a1a", userSelect: "none" };

export const Toggle = ({ checked, onChange, label, disabled = false }: ToggleProps) => (
  <span
    style={wrapStyle(disabled)}
    onClick={() => !disabled && onChange(!checked)}
    role="switch"
    aria-checked={checked}
    tabIndex={disabled ? -1 : 0}
    onKeyDown={(e) => {
      if (!disabled && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        onChange(!checked);
      }
    }}
  >
    <span style={trackStyle(checked)}>
      <span style={thumbStyle(checked)} />
    </span>
    {label && <span style={labelStyle}>{label}</span>}
  </span>
);`,
};
