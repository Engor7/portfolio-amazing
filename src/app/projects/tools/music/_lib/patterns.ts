import { INSTRUMENT_MAP } from "./constants";
import {
   generateHarmonicContext,
   generateNoteGrid,
   generateVelocityGrid,
} from "./musicTheory";
import type {
   HarmonicContext,
   InstrumentId,
   NoteGrid,
   TrackConfig,
   VelocityGrid,
} from "./types";

const KICK_PATTERNS = [
   [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
   [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
   [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
   [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
   [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
];

const SNARE_PATTERNS = [
   [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
   [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
   [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
   [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
];

const HIHAT_PATTERNS = [
   [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
   [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
   [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
];

const CLAP_PATTERNS = [
   [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
   [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
   [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
];

const DRUM_PRESETS: Partial<Record<InstrumentId, number[][]>> = {
   kick: KICK_PATTERNS,
   snare: SNARE_PATTERNS,
   hihat: HIHAT_PATTERNS,
   clap: CLAP_PATTERNS,
};

// --- Role-specific rhythm presets ---
const BASS_RHYTHMS = [
   [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
   [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
   [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0],
   [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
   [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
];

const LEAD_RHYTHMS = [
   [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
   [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
   [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
   [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
];

const ARP_RHYTHMS = [
   [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
   [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
   [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
];

const PAD_RHYTHMS = [
   [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
   [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
];

const BELL_RHYTHMS = [
   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
   [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
   [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
];

const CHORD_RHYTHMS = [
   [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
   [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
   [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
   [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
];

type RoleKey = "bass" | "lead" | "arpeggio" | "pad" | "bell" | "chord";

const ROLE_RHYTHMS: Record<RoleKey, number[][]> = {
   bass: BASS_RHYTHMS,
   lead: LEAD_RHYTHMS,
   arpeggio: ARP_RHYTHMS,
   pad: PAD_RHYTHMS,
   bell: BELL_RHYTHMS,
   chord: CHORD_RHYTHMS,
};

// --- Arrangement Templates ---
// Each defines exactly which instruments play together, with coordinated patterns.
// Rules: max 7 instruments, max ONE dense pattern, kick+bass rhythmically aligned,
// snare/clap on backbeats, max 2 melodic + 1 pad.

interface ArrangementTemplate {
   name: string;
   bpm: [number, number];
   tracks: { id: InstrumentId; patternIdx: number }[];
   fx: Set<string>;
}

const ARRANGEMENT_TEMPLATES: ArrangementTemplate[] = [
   {
      name: "Minimal House",
      bpm: [120, 126],
      tracks: [
         { id: "kick", patternIdx: 0 },
         { id: "hihat", patternIdx: 0 },
         { id: "clap", patternIdx: 0 },
         { id: "bass", patternIdx: 0 },
         { id: "chord-stab", patternIdx: 0 },
         { id: "chord-stab", patternIdx: 1 },
      ],
      fx: new Set(["Hall"]),
   },
   {
      name: "Lo-fi Chill",
      bpm: [78, 86],
      tracks: [
         { id: "kick", patternIdx: 3 },
         { id: "hihat", patternIdx: 3 },
         { id: "bass", patternIdx: 3 },
         { id: "lead", patternIdx: 1 },
         { id: "pluck", patternIdx: 0 },
         { id: "chord-stab", patternIdx: 0 },
      ],
      fx: new Set(["Hall", "Delay"]),
   },
   {
      name: "Synth Pop",
      bpm: [115, 125],
      tracks: [
         { id: "kick", patternIdx: 0 },
         { id: "snare", patternIdx: 0 },
         { id: "hihat", patternIdx: 0 },
         { id: "bass", patternIdx: 1 },
         { id: "arp", patternIdx: 0 },
         { id: "chord-stab", patternIdx: 1 },
      ],
      fx: new Set(["Hall"]),
   },
   {
      name: "Deep Minimal",
      bpm: [118, 124],
      tracks: [
         { id: "kick", patternIdx: 1 },
         { id: "hihat", patternIdx: 3 },
         { id: "rimshot", patternIdx: -1 },
         { id: "bass", patternIdx: 1 },
         { id: "chord-stab", patternIdx: 0 },
      ],
      fx: new Set(["Hall", "Delay"]),
   },
   {
      name: "Ambient Drift",
      bpm: [70, 80],
      tracks: [
         { id: "chord-stab", patternIdx: 1 },
         { id: "fm-bell", patternIdx: 1 },
         { id: "pluck", patternIdx: 0 },
         { id: "chord-stab", patternIdx: 0 },
         { id: "bass", patternIdx: 3 },
      ],
      fx: new Set(["Hall", "Delay", "Wobble"]),
   },
   {
      name: "Percussive Groove",
      bpm: [95, 105],
      tracks: [
         { id: "kick", patternIdx: 2 },
         { id: "snare", patternIdx: 1 },
         { id: "hihat", patternIdx: 2 },
         { id: "cowbell", patternIdx: -1 },
         { id: "bass", patternIdx: 2 },
         { id: "lead", patternIdx: 2 },
      ],
      fx: new Set(["Hall"]),
   },
   {
      name: "Dreamy Keys",
      bpm: [85, 95],
      tracks: [
         { id: "kick", patternIdx: 3 },
         { id: "chord-stab", patternIdx: 3 },
         { id: "lead", patternIdx: 3 },
         { id: "fm-bell", patternIdx: 0 },
         { id: "chord-stab", patternIdx: 3 },
         { id: "bass", patternIdx: 3 },
      ],
      fx: new Set(["Hall", "Delay"]),
   },
   {
      name: "Bouncy Electro",
      bpm: [125, 135],
      tracks: [
         { id: "kick", patternIdx: 4 },
         { id: "snare", patternIdx: 3 },
         { id: "hihat", patternIdx: 0 },
         { id: "bass", patternIdx: 4 },
         { id: "arp", patternIdx: 2 },
         { id: "lead", patternIdx: 4 },
      ],
      fx: new Set(["Hall"]),
   },
   {
      name: "Half-time",
      bpm: [130, 140],
      tracks: [
         { id: "kick", patternIdx: 3 },
         { id: "snare", patternIdx: 0 },
         { id: "hihat", patternIdx: 3 },
         { id: "bass", patternIdx: 3 },
         { id: "lead", patternIdx: 0 },
         { id: "chord-stab", patternIdx: 0 },
      ],
      fx: new Set(["Hall"]),
   },
   {
      name: "Acid Minimal",
      bpm: [125, 132],
      tracks: [
         { id: "kick", patternIdx: 0 },
         { id: "hihat", patternIdx: 1 },
         { id: "bass", patternIdx: 4 },
         { id: "lead", patternIdx: 3 },
      ],
      fx: new Set(["Hall", "Wobble"]),
   },
   {
      name: "Pad & Bells",
      bpm: [75, 85],
      tracks: [
         { id: "fm-bell", patternIdx: 3 },
         { id: "chord-stab", patternIdx: 0 },
         { id: "pluck", patternIdx: 0 },
         { id: "bass", patternIdx: 3 },
         { id: "chord-stab", patternIdx: 2 },
      ],
      fx: new Set(["Hall", "Delay"]),
   },
   {
      name: "Driving Techno",
      bpm: [128, 138],
      tracks: [
         { id: "kick", patternIdx: 0 },
         { id: "hihat", patternIdx: 0 },
         { id: "clap", patternIdx: 0 },
         { id: "bass", patternIdx: 0 },
         { id: "noise-sweep", patternIdx: -1 },
         { id: "lead", patternIdx: 0 },
      ],
      fx: new Set(["Hall"]),
   },
];

function pick<T>(arr: T[]): T {
   return arr[Math.floor(Math.random() * arr.length)];
}

function randomInRange(min: number, max: number): number {
   return min + Math.floor(Math.random() * (max - min + 1));
}

export function fitPattern(pattern: number[], stepCount: number): boolean[] {
   if (stepCount === 16) return pattern.map(Boolean);
   const result: boolean[] = [];
   for (let i = 0; i < stepCount; i++) {
      result.push(Boolean(pattern[i % 16]));
   }
   return result;
}

function generateSparseDrumPattern(stepCount: number): boolean[] {
   const result = Array(stepCount).fill(false);
   const hits = 1 + Math.floor(Math.random() * 3);
   for (let h = 0; h < hits; h++) {
      result[Math.floor(Math.random() * stepCount)] = true;
   }
   return result;
}

function getPatternForInstrument(
   instrumentId: InstrumentId,
   patternIdx: number,
   stepCount: number,
): boolean[] {
   // patternIdx -1 means sparse/random
   if (patternIdx === -1) {
      return generateSparseDrumPattern(stepCount);
   }

   const preset = INSTRUMENT_MAP.get(instrumentId);
   const kind = preset?.kind ?? "melodic";

   if (kind === "drum") {
      const patterns = DRUM_PRESETS[instrumentId];
      if (patterns) {
         const idx = Math.min(patternIdx, patterns.length - 1);
         return fitPattern(patterns[idx], stepCount);
      }
      return generateSparseDrumPattern(stepCount);
   }

   const role = (preset?.role ?? "lead") as RoleKey;
   const rhythms = ROLE_RHYTHMS[role];
   if (rhythms) {
      const idx = Math.min(patternIdx, rhythms.length - 1);
      return fitPattern(rhythms[idx], stepCount);
   }
   return fitPattern(pick(LEAD_RHYTHMS), stepCount);
}

export function mutatePattern(
   tracks: TrackConfig[],
   grid: Record<string, boolean[][]>,
   _noteGrid: NoteGrid,
   velocityGrid: VelocityGrid,
   harmonicContext: HarmonicContext,
   stepCount: number,
): {
   grid: Record<string, boolean[][]>;
   noteGrid: NoteGrid;
   velocityGrid: VelocityGrid;
} {
   const newGrid: Record<string, boolean[][]> = {};

   const PROTECTED: Partial<Record<string, number[]>> = {
      kick: [0, 8],
      snare: [4, 12],
      clap: [4, 12],
      bass: [0],
   };

   for (const track of tracks) {
      const trackGrid = grid[track.id];
      if (!trackGrid || !trackGrid[0]) {
         newGrid[track.id] = trackGrid ?? [Array(stepCount).fill(false)];
         continue;
      }

      const protectedSteps = new Set(PROTECTED[track.instrumentId] ?? []);

      const row = trackGrid[0].map((v, i) => {
         if (protectedSteps.has(i)) return true;
         if (Math.random() < 0.08) return !v;
         return v;
      });

      newGrid[track.id] = [row];
   }

   const newNoteGrid = generateNoteGrid(harmonicContext, tracks, stepCount);

   const newVelocityGrid: VelocityGrid = {};
   for (const track of tracks) {
      const old = velocityGrid[track.id];
      if (!old) {
         newVelocityGrid[track.id] = Array(stepCount).fill(0.7);
         continue;
      }
      newVelocityGrid[track.id] = old.map((v) => {
         const delta = (Math.random() - 0.5) * 0.15;
         return Math.max(0.15, Math.min(1, v + delta));
      });
   }

   return {
      grid: newGrid,
      noteGrid: newNoteGrid,
      velocityGrid: newVelocityGrid,
   };
}

export function generateRandomPattern(
   tracks: TrackConfig[],
   stepCount: number,
): {
   grid: Record<string, boolean[][]>;
   effects: Set<string>;
   noteGrid: NoteGrid;
   harmonicContext: HarmonicContext;
   velocityGrid: VelocityGrid;
   suggestedBpm: number;
} {
   const template = pick(ARRANGEMENT_TEMPLATES);

   const grid: Record<string, boolean[][]> = {};

   for (const track of tracks) {
      const templateTrack = template.tracks.find(
         (t) => t.id === track.instrumentId,
      );
      if (templateTrack) {
         grid[track.id] = [
            getPatternForInstrument(
               track.instrumentId,
               templateTrack.patternIdx,
               stepCount,
            ),
         ];
      } else {
         // Not in this arrangement — silent
         grid[track.id] = [Array(stepCount).fill(false)];
      }
   }

   const harmonicContext = generateHarmonicContext();
   const noteGrid = generateNoteGrid(harmonicContext, tracks, stepCount);
   const velocityGrid = generateVelocityGrid(tracks, stepCount);
   const suggestedBpm = randomInRange(template.bpm[0], template.bpm[1]);

   return {
      grid,
      effects: template.fx,
      noteGrid,
      harmonicContext,
      velocityGrid,
      suggestedBpm,
   };
}
