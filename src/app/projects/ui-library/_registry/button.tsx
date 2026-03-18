"use client";
import { useState } from "react";
import { Button } from "../_ui/Button";
import type { ComponentMeta } from "./index";

const ButtonDemo = () => {
  const [clicked, setClicked] = useState(false);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
      <Button variant="primary" onClick={() => setClicked((v) => !v)}>
        {clicked ? "Clicked!" : "Primary"}
      </Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary" size="lg">Large</Button>
      <Button variant="primary" disabled>Disabled</Button>
    </div>
  );
};

export const buttonMeta: ComponentMeta = {
  slug: "button",
  name: "Button",
  description: "A versatile button component with multiple variants and sizes.",
  usage: `import { Button } from "./_ui/Button";

<Button variant="primary" size="md">Click me</Button>`,
  props: [
    { name: "variant", type: '"primary" | "secondary" | "ghost"', default: '"primary"', description: "Visual style of the button." },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Size of the button." },
    { name: "disabled", type: "boolean", default: "false", description: "Disables the button when true." },
    { name: "onClick", type: "() => void", default: "—", description: "Click handler." },
    { name: "children", type: "ReactNode", default: "—", description: "Button content." },
  ],
  demo: ButtonDemo,
  source: `import type { ButtonHTMLAttributes, CSSProperties } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 6,
  fontWeight: 500,
  cursor: "pointer",
  border: "1px solid transparent",
  transition: "opacity 0.15s, background 0.15s",
  fontFamily: "inherit",
};

const variantStyle: Record<Variant, CSSProperties> = {
  primary:   { background: "#1a1a1a", color: "#fff" },
  secondary: { background: "#fff",    color: "#1a1a1a", borderColor: "#d4d4d4" },
  ghost:     { background: "transparent", color: "#1a1a1a" },
};

const sizeStyle: Record<Size, CSSProperties> = {
  sm: { padding: "4px 10px",  fontSize: 13 },
  md: { padding: "8px 16px",  fontSize: 14 },
  lg: { padding: "12px 22px", fontSize: 16 },
};

export const Button = ({
  variant = "primary",
  size = "md",
  style,
  children,
  ...props
}: ButtonProps) => (
  <button
    style={{ ...base, ...variantStyle[variant], ...sizeStyle[size], ...(props.disabled ? { opacity: 0.45, cursor: "not-allowed" } : {}), ...style }}
    {...props}
  >
    {children}
  </button>
);`,
};
