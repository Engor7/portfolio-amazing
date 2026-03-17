import type { InstrumentId, InstrumentRole } from "./types";

export const DEFAULT_BPM = 120;
export const DEFAULT_STEPS = 20;
export const MIN_STEPS = 4;
export const MAX_STEPS = 32;
export const MOBILE_MAX_STEPS = 10;
export const MAX_TRACKS = 16;

export interface InstrumentPreset {
   id: InstrumentId;
   label: string;
   note: string | string[];
   color: string;
   kind: "drum" | "melodic";
   octaveRange: [number, number];
   role?: InstrumentRole;
}

export const INSTRUMENT_CATALOG: InstrumentPreset[] = [
   {
      id: "kick",
      label: "Kick",
      note: "C1",
      color: "#e74c3c",
      kind: "drum",
      octaveRange: [1, 1],
   },
   {
      id: "snare",
      label: "Snare",
      note: "C2",
      color: "#e67e22",
      kind: "drum",
      octaveRange: [2, 2],
   },
   {
      id: "hihat",
      label: "Hi-Hat",
      note: "C4",
      color: "#f1c40f",
      kind: "drum",
      octaveRange: [4, 4],
   },
   {
      id: "clap",
      label: "Clap",
      note: "C2",
      color: "#e91e63",
      kind: "drum",
      octaveRange: [2, 2],
   },
   {
      id: "bass",
      label: "Bass",
      note: "C2",
      color: "#9b59b6",
      kind: "melodic",
      octaveRange: [1, 2],
      role: "bass",
   },
   {
      id: "lead",
      label: "Lead",
      note: "C4",
      color: "#3498db",
      kind: "melodic",
      octaveRange: [4, 5],
      role: "lead",
   },
   {
      id: "pluck",
      label: "Pluck",
      note: "E4",
      color: "#1abc9c",
      kind: "melodic",
      octaveRange: [4, 5],
      role: "arpeggio",
   },
   {
      id: "fm-bell",
      label: "FM Bell",
      note: "G5",
      color: "#f39c12",
      kind: "melodic",
      octaveRange: [5, 6],
      role: "bell",
   },
   {
      id: "metal",
      label: "Cymbal",
      note: "C4",
      color: "#bdc3c7",
      kind: "drum",
      octaveRange: [4, 4],
   },
   {
      id: "noise-sweep",
      label: "Noise",
      note: "C2",
      color: "#7f8c8d",
      kind: "drum",
      octaveRange: [2, 2],
   },
   {
      id: "sub-bass",
      label: "Sub Bass",
      note: "C1",
      color: "#8e44ad",
      kind: "melodic",
      octaveRange: [1, 1],
      role: "bass",
   },
   {
      id: "cowbell",
      label: "Cowbell",
      note: "C4",
      color: "#d35400",
      kind: "drum",
      octaveRange: [4, 4],
   },
   {
      id: "rimshot",
      label: "Rimshot",
      note: "G3",
      color: "#c0392b",
      kind: "drum",
      octaveRange: [3, 3],
   },
   {
      id: "chord-stab",
      label: "Chord",
      note: "C3,E3,G3",
      color: "#2980b9",
      kind: "melodic",
      octaveRange: [3, 4],
      role: "chord",
   },
   {
      id: "arp",
      label: "Arp",
      note: "C5",
      color: "#16a085",
      kind: "melodic",
      octaveRange: [4, 5],
      role: "arpeggio",
   },
];

export const DEFAULT_TRACKS: InstrumentId[] = INSTRUMENT_CATALOG.map(
   (p) => p.id,
);
