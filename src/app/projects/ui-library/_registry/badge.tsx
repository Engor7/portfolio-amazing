"use client";
import { Badge } from "../_ui/Badge";
import type { ComponentMeta } from "./index";

const BadgeDemo = () => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
    <Badge label="Default" />
    <Badge label="Success" variant="success" />
    <Badge label="Warning" variant="warning" />
    <Badge label="Error" variant="error" />
    <Badge label="Small" size="sm" />
    <Badge label="Success SM" variant="success" size="sm" />
  </div>
);

export const badgeMeta: ComponentMeta = {
  slug: "badge",
  name: "Badge",
  description: "A small status indicator badge with semantic color variants.",
  usage: `import { Badge } from "./_ui/Badge";

<Badge label="Success" variant="success" />`,
  props: [
    { name: "label", type: "string", default: "—", description: "Text displayed inside the badge." },
    { name: "variant", type: '"default" | "success" | "warning" | "error"', default: '"default"', description: "Color variant." },
    { name: "size", type: '"sm" | "md"', default: '"md"', description: "Size of the badge." },
  ],
  demo: BadgeDemo,
  source: `import type { CSSProperties } from "react";

type BadgeVariant = "default" | "success" | "warning" | "error";
type BadgeSize = "sm" | "md";

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const base: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: 999,
  fontWeight: 500,
  whiteSpace: "nowrap",
};

const variantStyle: Record<BadgeVariant, CSSProperties> = {
  default: { background: "#f0f0f0", color: "#1a1a1a" },
  success: { background: "#dcfce7", color: "#15803d" },
  warning: { background: "#fef9c3", color: "#a16207" },
  error:   { background: "#fee2e2", color: "#b91c1c" },
};

const sizeStyle: Record<BadgeSize, CSSProperties> = {
  sm: { padding: "2px 8px",  fontSize: 11 },
  md: { padding: "4px 12px", fontSize: 13 },
};

export const Badge = ({ label, variant = "default", size = "md" }: BadgeProps) => (
  <span style={{ ...base, ...variantStyle[variant], ...sizeStyle[size] }}>
    {label}
  </span>
);`,
};
