import { INSTRUMENT_CATALOG } from "./constants";
import { generateNoteGrid, generateVelocityGrid } from "./musicTheory";
import type {
   HarmonicContext,
   InstrumentId,
   NoteGrid,
   TrackConfig,
   VelocityGrid,
} from "./types";

// Reuse pattern helpers from patterns.ts
function fitPattern(pattern: number[], stepCount: number): boolean[] {
   if (stepCount === 16) return pattern.map(Boolean);
   const result: boolean[] = [];
   for (let i = 0; i < stepCount; i++) {
      result.push(Boolean(pattern[i % 16]));
   }
   return result;
}

export type PresetId = "hiphop" | "techno" | "lofi" | "ambient" | "pop";

export interface GenrePreset {
   id: PresetId;
   label: string;
   bpm: number;
   stepCount: number;
   instruments: InstrumentId[];
   harmonicContext: HarmonicContext;
   effects: string[];
   drumPatterns: Partial<Record<InstrumentId, number[]>>;
   rolePatterns: Partial<Record<string, number[]>>;
}

const PRESETS: Record<PresetId, GenrePreset> = {
   hiphop: {
      id: "hiphop",
      label: "Hip-Hop",
      bpm: 85,
      stepCount: 16,
      instruments: [
         "kick",
         "snare",
         "hihat",
         "clap",
         "bass",
         "lead",
         "chord-stab",
         "fm-bell",
      ],
      harmonicContext: {
         root: "D",
         scale: [0, 3, 5, 7, 10], // minor pentatonic
         scaleName: "minorPentatonic",
         parentScale: [0, 2, 3, 5, 7, 8, 10],
         progression: [0, 3, 5, 4], // i-iv-VI-v
         progressionName: "i-iv-VII-III",
      },
      effects: ["Hall"],
      drumPatterns: {
         kick: [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
         snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
         hihat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
         clap: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      rolePatterns: {
         bass: [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
         lead: [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
         chord: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
         bell: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      },
   },
   techno: {
      id: "techno",
      label: "Techno",
      bpm: 130,
      stepCount: 16,
      instruments: [
         "kick",
         "hihat",
         "clap",
         "metal",
         "bass",
         "lead",
         "arp",
         "noise-sweep",
      ],
      harmonicContext: {
         root: "A",
         scale: [0, 2, 3, 5, 7, 9, 10], // dorian
         scaleName: "dorian",
         parentScale: [0, 2, 3, 5, 7, 8, 10],
         progression: [0, 3, 5, 3], // i-iv-VI-iv
         progressionName: "i-iv-VII-III",
      },
      effects: ["Delay", "Wobble"],
      drumPatterns: {
         kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
         hihat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
         clap: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
         metal: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      },
      rolePatterns: {
         bass: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
         lead: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
         arpeggio: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      },
   },
   lofi: {
      id: "lofi",
      label: "Lo-Fi",
      bpm: 75,
      stepCount: 16,
      instruments: [
         "kick",
         "snare",
         "hihat",
         "bass",
         "pluck",
         "chord-stab",
         "fm-bell",
      ],
      harmonicContext: {
         root: "F",
         scale: [0, 2, 4, 7, 9], // major pentatonic
         scaleName: "majorPentatonic",
         parentScale: [0, 2, 4, 5, 7, 9, 11],
         progression: [0, 5, 3, 4], // I-vi-IV-V
         progressionName: "I-vi-IV-V",
      },
      effects: ["Hall", "Delay"],
      drumPatterns: {
         kick: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
         snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
         hihat: [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0],
      },
      rolePatterns: {
         bass: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
         arpeggio: [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
         pad: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
         chord: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
         bell: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      },
   },
   ambient: {
      id: "ambient",
      label: "Ambient",
      bpm: 90,
      stepCount: 16,
      instruments: ["pluck", "fm-bell", "arp", "bass", "noise-sweep"],
      harmonicContext: {
         root: "E",
         scale: [0, 2, 4, 5, 7, 9, 11], // major
         scaleName: "major",
         parentScale: [0, 2, 4, 5, 7, 9, 11],
         progression: [0, 4, 5, 3], // I-V-vi-IV
         progressionName: "I-V-vi-IV",
      },
      effects: ["Hall", "Delay"],
      drumPatterns: {
         "noise-sweep": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      rolePatterns: {
         pad: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         arpeggio: [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
         bell: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
         bass: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      },
   },
   pop: {
      id: "pop",
      label: "Pop",
      bpm: 110,
      stepCount: 16,
      instruments: [
         "kick",
         "snare",
         "hihat",
         "clap",
         "bass",
         "lead",
         "chord-stab",
         "pluck",
      ],
      harmonicContext: {
         root: "C",
         scale: [0, 2, 4, 5, 7, 9, 11], // major
         scaleName: "major",
         parentScale: [0, 2, 4, 5, 7, 9, 11],
         progression: [0, 4, 5, 3], // I-V-vi-IV
         progressionName: "I-V-vi-IV",
      },
      effects: ["Hall"],
      drumPatterns: {
         kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
         snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
         hihat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
         clap: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      },
      rolePatterns: {
         bass: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
         lead: [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
         chord: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
         arpeggio: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
         pad: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      },
   },
};

export const GENRE_PRESETS = Object.values(PRESETS);

export interface PresetResult {
   tracks: TrackConfig[];
   grid: Record<string, boolean[][]>;
   noteGrid: NoteGrid;
   velocityGrid: VelocityGrid;
   harmonicContext: HarmonicContext;
   bpm: number;
   stepCount: number;
   effects: Set<string>;
}

let presetTrackCounter = 1000;

function makePresetTrack(instrumentId: InstrumentId): TrackConfig {
   const preset = INSTRUMENT_CATALOG.find((p) => p.id === instrumentId);
   if (!preset) throw new Error(`Unknown instrument: ${instrumentId}`);
   presetTrackCounter += 1;

   const ROLE_VOLUMES: Record<string, number> = {
      bass: -6,
      lead: -10,
      arpeggio: -14,
      pad: -16,
      chord: -14,
      bell: -16,
      drum: -8,
   };

   const role = preset.kind === "drum" ? "drum" : (preset.role ?? "lead");
   return {
      id: `track-${presetTrackCounter}-${Date.now()}`,
      instrumentId,
      label: preset.label,
      note: preset.note,
      volume: ROLE_VOLUMES[role] ?? -10,
      muted: false,
   };
}

export function generatePreset(presetId: PresetId): PresetResult {
   const preset = PRESETS[presetId];
   const tracks = preset.instruments.map(makePresetTrack);

   const grid: Record<string, boolean[][]> = {};
   for (const track of tracks) {
      const catalogEntry = INSTRUMENT_CATALOG.find(
         (p) => p.id === track.instrumentId,
      );
      const kind = catalogEntry?.kind ?? "melodic";
      const role = catalogEntry?.role;

      // Check drum patterns first
      const drumPattern = preset.drumPatterns[track.instrumentId];
      if (drumPattern) {
         grid[track.id] = [fitPattern(drumPattern, preset.stepCount)];
         continue;
      }

      // Then check role patterns
      if (kind === "melodic" && role) {
         const rolePattern = preset.rolePatterns[role];
         if (rolePattern) {
            grid[track.id] = [fitPattern(rolePattern, preset.stepCount)];
            continue;
         }
      }

      // Fallback: empty
      grid[track.id] = [Array(preset.stepCount).fill(false)];
   }

   const noteGrid = generateNoteGrid(
      preset.harmonicContext,
      tracks,
      preset.stepCount,
   );
   const velocityGrid = generateVelocityGrid(tracks, preset.stepCount);

   return {
      tracks,
      grid,
      noteGrid,
      velocityGrid,
      harmonicContext: { ...preset.harmonicContext },
      bpm: preset.bpm,
      stepCount: preset.stepCount,
      effects: new Set(preset.effects),
   };
}
