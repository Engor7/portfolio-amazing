export interface Point {
   x: number;
   y: number;
}

export interface Transform {
   x: number;
   y: number;
   scale: number;
}

export type ToolType = "rainbow" | "color";

export type ThemeMode = "dark" | "light";

export interface RainbowSegment {
   d: string;
   color: string;
}

export interface Stroke {
   id: number;
   kind: "color" | "rainbow";
   color: string;
   width: number;
   d: string;
   segments: RainbowSegment[];
}
