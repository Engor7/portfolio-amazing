"use client";
import { Card } from "../_ui/Card";
import { Button } from "../_ui/Button";
import type { ComponentMeta } from "./index";

const CardDemo = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 360 }}>
    <Card
      title="Simple Card"
      description="A basic card with just a title and description."
    />
    <Card
      title="Card with Content"
      description="Cards can contain arbitrary children."
      footer={<Button size="sm" variant="secondary">Action</Button>}
    >
      <p style={{ margin: 0, fontSize: 14, color: "#6b6b6b" }}>
        This is the card body content area.
      </p>
    </Card>
  </div>
);

export const cardMeta: ComponentMeta = {
  slug: "card",
  name: "Card",
  description: "A surface container with optional title, description, content, and footer.",
  usage: `import { Card } from "./_ui/Card";

<Card title="Hello" description="World" footer={<button>OK</button>}>
  <p>Content goes here.</p>
</Card>`,
  props: [
    { name: "title", type: "string", default: "—", description: "Card heading." },
    { name: "description", type: "string", default: "—", description: "Subtext below the title." },
    { name: "children", type: "ReactNode", default: "—", description: "Body content." },
    { name: "footer", type: "ReactNode", default: "—", description: "Footer content, rendered with a top border." },
  ],
  demo: CardDemo,
  source: `import type { CSSProperties, ReactNode } from "react";

export interface CardProps {
  title?: string;
  description?: string;
  footer?: ReactNode;
  children?: ReactNode;
}

const cardStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: 10,
  overflow: "hidden",
};
const bodyStyle: CSSProperties = { padding: 20 };
const titleStyle: CSSProperties = { fontSize: 16, fontWeight: 600, color: "#1a1a1a", margin: "0 0 6px" };
const descStyle: CSSProperties  = { fontSize: 14, color: "#6b6b6b", margin: 0 };
const contentStyle: CSSProperties = { marginTop: 12, fontSize: 14 };
const footerStyle: CSSProperties = {
  padding: "12px 20px",
  borderTop: "1px solid #e5e5e5",
  background: "#fafafa",
  fontSize: 13,
  color: "#6b6b6b",
};

export const Card = ({ title, description, footer, children }: CardProps) => (
  <div style={cardStyle}>
    <div style={bodyStyle}>
      {title && <h3 style={titleStyle}>{title}</h3>}
      {description && <p style={descStyle}>{description}</p>}
      {children && <div style={contentStyle}>{children}</div>}
    </div>
    {footer && <div style={footerStyle}>{footer}</div>}
  </div>
);`,
};
