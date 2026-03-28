export interface MusicTheme {
   id: string;
   name: string;
   bg: string;
   surface: string;
   border: string;
   textPrimary: string;
   textSecondary: string;
   textMuted: string;
   inactive: string;
   play: string;
   playHover: string;
   stop: string;
   stopHover: string;
   random: string;
   evolve: string;
   fxActive: string;
   fxReverb: string;
   fxDelay: string;
   fxFilter: string;
   isDark: boolean;
   trackColors: Record<string, string>;
}

const DEFAULT_TRACK_COLORS: Record<string, string> = {
   kick: "#ef4444",
   snare: "#f97316",
   hihat: "#84cc16",
   clap: "#ec4899",
   bass: "#8b5cf6",
   lead: "#3b82f6",
   pluck: "#14b8a6",
   "fm-bell": "#eab308",
   metal: "#64748b",
   "noise-sweep": "#10b981",
   "sub-bass": "#6366f1",
   cowbell: "#ea580c",
   rimshot: "#e11d48",
   "chord-stab": "#2563eb",
   arp: "#22c55e",
};

export const LIGHT_THEME: MusicTheme = {
   id: "default",
   name: "Default",
   isDark: false,
   bg: "#f0ece8",
   surface: "#faf8f6",
   border: "#d6cfc7",
   textPrimary: "#1a1816",
   textSecondary: "#6b6560",
   textMuted: "#9c9590",
   inactive: "#e4dfd9",
   play: "#22c55e",
   playHover: "#16a34a",
   stop: "#ef4444",
   stopHover: "#dc2626",
   random: "#8b5cf6",
   evolve: "#f59e0b",
   fxActive: "#22c55e",
   fxReverb: "#6366f1",
   fxDelay: "#8b5cf6",
   fxFilter: "#f59e0b",
   trackColors: DEFAULT_TRACK_COLORS,
};

export const DARK_THEME: MusicTheme = {
   id: "constellation",
   name: "Constellation",
   isDark: true,
   bg: "#060a14",
   surface: "#10162a",
   border: "#2e3d58",
   textPrimary: "#f5f3f0",
   textSecondary: "#90a0c0",
   textMuted: "#586a88",
   inactive: "#161e34",
   play: "#22c55e",
   playHover: "#16a34a",
   stop: "#ef4444",
   stopHover: "#dc2626",
   random: "#f0c830",
   evolve: "#3b82f6",
   fxActive: "#22c55e",
   fxReverb: "#818cf8",
   fxDelay: "#f0c830",
   fxFilter: "#3b82f6",
   trackColors: {
      kick: "#60a5fa",
      snare: "#f87171",
      hihat: "#facc15",
      clap: "#f472b6",
      bass: "#818cf8",
      lead: "#38bdf8",
      pluck: "#2dd4bf",
      "fm-bell": "#fbbf24",
      metal: "#94a3b8",
      "noise-sweep": "#34d399",
      "sub-bass": "#6366f1",
      cowbell: "#fb923c",
      rimshot: "#fb7185",
      "chord-stab": "#60a5fa",
      arp: "#4ade80",
   },
};

let activeTrackColors: Record<string, string> = { ...DEFAULT_TRACK_COLORS };

export function getTrackColor(instrumentId: string): string {
   return activeTrackColors[instrumentId] ?? "#888";
}

export function setActiveTheme(theme: MusicTheme): void {
   activeTrackColors = { ...theme.trackColors };
}
