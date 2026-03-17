export type InstrumentId =
   | "kick"
   | "snare"
   | "hihat"
   | "clap"
   | "bass"
   | "lead"
   | "pluck"
   | "fm-bell"
   | "metal"
   | "noise-sweep"
   | "sub-bass"
   | "cowbell"
   | "rimshot"
   | "chord-stab"
   | "arp";

export type InstrumentRole =
   | "bass"
   | "lead"
   | "arpeggio"
   | "pad"
   | "chord"
   | "bell";

export interface TrackConfig {
   id: string;
   instrumentId: InstrumentId;
   label: string;
   note: string | string[];
   volume: number;
   muted: boolean;
}

export interface HarmonicContext {
   root: string;
   scale: number[];
   scaleName: string;
   parentScale: number[]; // always 7-note (major or natural minor)
   progression: number[];
   progressionName: string;
}

export type NoteGrid = Record<string, (string | string[] | null)[]>;

export type VelocityGrid = Record<string, number[]>;
