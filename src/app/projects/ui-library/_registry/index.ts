import type { FC } from "react";
import { buttonMeta } from "./button";
import { inputMeta } from "./input";
import { badgeMeta } from "./badge";
import { cardMeta } from "./card";
import { toggleMeta } from "./toggle";

export interface PropDef {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface ComponentMeta {
  slug: string;
  name: string;
  description: string;
  usage: string;
  props: PropDef[];
  demo: FC;
  source: string;
  notes?: string;
}

export const registry: ComponentMeta[] = [
  buttonMeta,
  inputMeta,
  badgeMeta,
  cardMeta,
  toggleMeta,
];
