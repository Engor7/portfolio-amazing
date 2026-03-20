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
   kick: "#e0635a",
   snare: "#e09050",
   hihat: "#b8c840",
   clap: "#e060a0",
   bass: "#a870d4",
   lead: "#50a4e0",
   pluck: "#40c8b4",
   "fm-bell": "#e0b840",
   metal: "#88a8c0",
   "noise-sweep": "#80b498",
   "sub-bass": "#7070d4",
   cowbell: "#c87840",
   rimshot: "#cc7860",
   "chord-stab": "#6078c4",
   arp: "#48c878",
};

export const LIGHT_THEME: MusicTheme = {
   id: "default",
   name: "Default",
   isDark: false,
   bg: "#f5f0eb",
   surface: "#faf7f4",
   border: "#e0d8d0",
   textPrimary: "#3a3530",
   textSecondary: "#9a918a",
   textMuted: "#c4bbb4",
   inactive: "#ece5dd",
   play: "#7ab88c",
   playHover: "#6aa87c",
   stop: "#d4817a",
   stopHover: "#c4716a",
   random: "#b8a0d8",
   evolve: "#d4a86c",
   fxActive: "#7ab88c",
   fxReverb: "#d4817a",
   fxDelay: "#b8a0d8",
   fxFilter: "#d4a86c",
   trackColors: DEFAULT_TRACK_COLORS,
};

export const DARK_THEME: MusicTheme = {
   id: "constellation",
   name: "Constellation",
   isDark: true,
   bg: "#0a0e1a",
   surface: "#121828",
   border: "#1e2a40",
   textPrimary: "#e0dcd8",
   textSecondary: "#6878a0",
   textMuted: "#3a4868",
   inactive: "#182038",
   play: "#3a6fa8",
   playHover: "#4a80b8",
   stop: "#d44040",
   stopHover: "#c03030",
   random: "#e8c840",
   evolve: "#3a6fa8",
   fxActive: "#3a6fa8",
   fxReverb: "#d44040",
   fxDelay: "#e8c840",
   fxFilter: "#3a6fa8",
   trackColors: {
      kick: "#4a70c0",
      snare: "#c85040",
      hihat: "#e8c840",
      clap: "#d06080",
      bass: "#3860a8",
      lead: "#70a8e0",
      pluck: "#40b0c8",
      "fm-bell": "#e8c840",
      metal: "#607898",
      "noise-sweep": "#506880",
      "sub-bass": "#2850a0",
      cowbell: "#c88040",
      rimshot: "#a06050",
      "chord-stab": "#5070b0",
      arp: "#60c8a0",
   },
};

let activeTrackColors: Record<string, string> = { ...DEFAULT_TRACK_COLORS };

export function getTrackColor(instrumentId: string): string {
   return activeTrackColors[instrumentId] ?? "#888";
}

export function setActiveTheme(theme: MusicTheme): void {
   activeTrackColors = { ...theme.trackColors };
}
