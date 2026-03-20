import type { InstrumentId, InstrumentRole } from "./types";

export const DEFAULT_BPM = 120;
export const DEFAULT_STEPS = 24;
export const MOBILE_MAX_STEPS = 10;
export const COMPACT_MAX_STEPS = 16;
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
      color: "#e0635a",
      kind: "drum",
      octaveRange: [1, 1],
   },
   {
      id: "snare",
      label: "Snare",
      note: "C2",
      color: "#e09050",
      kind: "drum",
      octaveRange: [2, 2],
   },
   {
      id: "hihat",
      label: "Hi-Hat",
      note: "C4",
      color: "#b8c840",
      kind: "drum",
      octaveRange: [4, 4],
   },
   {
      id: "clap",
      label: "Clap",
      note: "C2",
      color: "#e060a0",
      kind: "drum",
      octaveRange: [2, 2],
   },
   {
      id: "bass",
      label: "Bass",
      note: "C2",
      color: "#a870d4",
      kind: "melodic",
      octaveRange: [1, 2],
      role: "bass",
   },
   {
      id: "lead",
      label: "Lead",
      note: "C4",
      color: "#50a4e0",
      kind: "melodic",
      octaveRange: [4, 5],
      role: "lead",
   },
   {
      id: "pluck",
      label: "Pluck",
      note: "E4",
      color: "#40c8b4",
      kind: "melodic",
      octaveRange: [4, 5],
      role: "arpeggio",
   },
   {
      id: "fm-bell",
      label: "FM Bell",
      note: "G5",
      color: "#e0b840",
      kind: "melodic",
      octaveRange: [5, 6],
      role: "bell",
   },
   {
      id: "metal",
      label: "Cymbal",
      note: "C4",
      color: "#88a8c0",
      kind: "drum",
      octaveRange: [4, 4],
   },
   {
      id: "noise-sweep",
      label: "Noise",
      note: "C2",
      color: "#80b498",
      kind: "drum",
      octaveRange: [2, 2],
   },
   {
      id: "sub-bass",
      label: "Sub Bass",
      note: "C1",
      color: "#7070d4",
      kind: "melodic",
      octaveRange: [1, 1],
      role: "bass",
   },
   {
      id: "cowbell",
      label: "Cowbell",
      note: "C4",
      color: "#c87840",
      kind: "drum",
      octaveRange: [4, 4],
   },
   {
      id: "rimshot",
      label: "Rimshot",
      note: "G3",
      color: "#cc7860",
      kind: "drum",
      octaveRange: [3, 3],
   },
   {
      id: "chord-stab",
      label: "Chord",
      note: "C3,E3,G3",
      color: "#6078c4",
      kind: "melodic",
      octaveRange: [3, 4],
      role: "chord",
   },
   {
      id: "arp",
      label: "Arp",
      note: "C5",
      color: "#48c878",
      kind: "melodic",
      octaveRange: [4, 5],
      role: "arpeggio",
   },
];

export const DEFAULT_TRACKS: InstrumentId[] = INSTRUMENT_CATALOG.map(
   (p) => p.id,
);
