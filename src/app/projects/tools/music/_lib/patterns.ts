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

// ── Helpers ──────────────────────────────────────────────────────────

function randomInRange(min: number, max: number): number {
   return min + Math.floor(Math.random() * (max - min + 1));
}

function chance(p: number): boolean {
   return Math.random() < p;
}

// ── Euclidean rhythm generator ───────────────────────────────────────
// Distributes `hits` as evenly as possible across `steps`.
// Produces tresillo (3,8), son clave (5,16), bossa nova, etc.

function euclidean(hits: number, steps: number): boolean[] {
   if (hits >= steps) return Array(steps).fill(true);
   if (hits <= 0) return Array(steps).fill(false);

   // Bjorklund's algorithm
   let pattern: number[][] = [];
   const remainder: number[][] = [];

   for (let i = 0; i < steps; i++) {
      if (i < hits) pattern.push([1]);
      else remainder.push([0]);
   }

   while (remainder.length > 1) {
      const newPattern: number[][] = [];
      const newRemainder: number[][] = [];
      const minLen = Math.min(pattern.length, remainder.length);

      for (let i = 0; i < minLen; i++) {
         newPattern.push([...pattern[i], ...remainder[i]]);
      }
      for (let i = minLen; i < pattern.length; i++) {
         newRemainder.push(pattern[i]);
      }
      for (let i = minLen; i < remainder.length; i++) {
         newRemainder.push(remainder[i]);
      }

      pattern = newPattern;
      if (newRemainder.length <= 1) {
         // Append remaining
         for (const r of newRemainder) pattern.push(r);
         break;
      }
      remainder.length = 0;
      remainder.push(...newRemainder);
   }

   const flat = pattern.flat();
   return flat.map(Boolean);
}

function rotate(pattern: boolean[], offset: number): boolean[] {
   if (offset === 0 || pattern.length === 0) return pattern;
   const n = pattern.length;
   const shift = ((offset % n) + n) % n;
   return [...pattern.slice(shift), ...pattern.slice(0, shift)];
}

// ── Fit pattern to step count ────────────────────────────────────────

export function fitPattern(
   pattern: (number | boolean)[],
   stepCount: number,
): boolean[] {
   if (pattern.length === stepCount) return pattern.map(Boolean);
   const result: boolean[] = [];
   for (let i = 0; i < stepCount; i++) {
      result.push(Boolean(pattern[i % pattern.length]));
   }
   return result;
}

// ── Humanize: add ghost notes / remove non-essential hits ────────────

function humanize(
   pattern: boolean[],
   protectedSteps: Set<number>,
   ghostChance = 0.07,
   dropChance = 0.05,
): boolean[] {
   return pattern.map((v, i) => {
      if (protectedSteps.has(i)) return true;
      if (!v && chance(ghostChance)) return true;
      if (v && !protectedSteps.has(i) && chance(dropChance)) return false;
      return v;
   });
}

// ── Per-instrument rhythm generation ─────────────────────────────────
// Each uses euclidean() with role-appropriate hit counts,
// then applies rotation and humanization rules.

type RhythmGenerator = (stepCount: number, energy: number) => boolean[];

function generateKick(stepCount: number, energy: number): boolean[] {
   // 3-6 hits, always start on beat 1 (no rotation)
   const base = 16;
   const hits = randomInRange(3, Math.round(3 + energy * 3));
   const raw = euclidean(hits, base);
   // Ensure step 0 is always a hit
   raw[0] = true;
   return humanize(fitPattern(raw, stepCount), new Set([0]));
}

function generateSnare(stepCount: number, energy: number): boolean[] {
   const base = 16;
   const hits = randomInRange(2, Math.round(2 + energy * 2));
   let raw = euclidean(hits, base);
   // Rotate so hits land on backbeats (step 4 and 12 in 16-step)
   // Find rotation that puts a hit closest to step 4
   let bestRot = 0;
   let bestScore = -1;
   for (let r = 0; r < base; r++) {
      const rotated = rotate(raw, r);
      let score = 0;
      if (rotated[4]) score += 2;
      if (rotated[12]) score += 2;
      // Penalize hits on step 0 (conflict with kick)
      if (rotated[0]) score -= 1;
      if (score > bestScore) {
         bestScore = score;
         bestRot = r;
      }
   }
   raw = rotate(raw, bestRot);
   return humanize(fitPattern(raw, stepCount), new Set([4, 12]));
}

function generateHihat(stepCount: number, energy: number): boolean[] {
   const base = 16;
   // Hi-hat density scales strongly with energy
   const hits = randomInRange(
      Math.round(4 + energy * 4),
      Math.round(8 + energy * 8),
   );
   const raw = euclidean(Math.min(hits, base), base);
   return humanize(fitPattern(raw, stepCount), new Set(), 0.1, 0.08);
}

function generateClap(stepCount: number, energy: number): boolean[] {
   const base = 16;
   const hits = randomInRange(1, Math.round(1 + energy * 2));
   let raw = euclidean(hits, base);
   // Prefer backbeat placement like snare
   let bestRot = 0;
   let bestScore = -1;
   for (let r = 0; r < base; r++) {
      const rotated = rotate(raw, r);
      let score = 0;
      if (rotated[4]) score += 2;
      if (rotated[12]) score += 1;
      if (rotated[0]) score -= 1;
      if (score > bestScore) {
         bestScore = score;
         bestRot = r;
      }
   }
   raw = rotate(raw, bestRot);
   return humanize(fitPattern(raw, stepCount), new Set());
}

function generateCowbell(stepCount: number, energy: number): boolean[] {
   const base = 16;
   const hits = randomInRange(2, Math.round(2 + energy * 3));
   const raw = euclidean(hits, base);
   const rot = randomInRange(0, base - 1);
   return humanize(fitPattern(rotate(raw, rot), stepCount), new Set());
}

function generateRimshot(stepCount: number, energy: number): boolean[] {
   const base = 16;
   const hits = randomInRange(1, Math.round(2 + energy * 2));
   const raw = euclidean(hits, base);
   const rot = randomInRange(0, base - 1);
   return humanize(fitPattern(rotate(raw, rot), stepCount), new Set());
}

function generateMetal(stepCount: number, _energy: number): boolean[] {
   const base = 16;
   const hits = randomInRange(1, 3);
   const raw = euclidean(hits, base);
   const rot = randomInRange(0, base - 1);
   return fitPattern(rotate(raw, rot), stepCount);
}

function generateNoiseSweep(stepCount: number, _energy: number): boolean[] {
   const base = 16;
   const hits = randomInRange(1, 2);
   const raw = euclidean(hits, base);
   return fitPattern(raw, stepCount);
}

// ── Melodic rhythm generators ────────────────────────────────────────

function generateBassRhythm(stepCount: number, energy: number): boolean[] {
   const base = 16;
   const hits = randomInRange(3, Math.round(4 + energy * 3));
   let raw = euclidean(hits, base);
   // Bass should always hit step 0
   raw[0] = true;
   // Slight syncopation: random rotation of 0-2 steps, but keep step 0
   if (chance(0.4)) {
      const shifted = rotate(raw, randomInRange(1, 2));
      shifted[0] = true;
      raw = shifted;
   }
   return humanize(fitPattern(raw, stepCount), new Set([0]), 0.05, 0.03);
}

function generateLeadRhythm(stepCount: number, energy: number): boolean[] {
   const base = 16;
   // Lead is sparser — melodic space
   const hits = randomInRange(3, Math.round(3 + energy * 3));
   const raw = euclidean(hits, base);
   // Random rotation for melodic interest
   const rot = randomInRange(0, base - 1);
   return humanize(
      fitPattern(rotate(raw, rot), stepCount),
      new Set(),
      0.05,
      0.08,
   );
}

function generateArpRhythm(stepCount: number, energy: number): boolean[] {
   const base = 16;
   // Arps are dense
   const hits = randomInRange(
      Math.round(6 + energy * 2),
      Math.round(8 + energy * 8),
   );
   const raw = euclidean(Math.min(hits, base), base);
   const rot = randomInRange(0, 3); // small rotation
   return humanize(
      fitPattern(rotate(raw, rot), stepCount),
      new Set(),
      0.08,
      0.03,
   );
}

function generateChordRhythm(stepCount: number, energy: number): boolean[] {
   const base = 16;
   // Chords are sparse — sustained
   const hits = randomInRange(2, Math.round(2 + energy * 2));
   const raw = euclidean(hits, base);
   // Prefer starting on beat 1
   raw[0] = true;
   return humanize(fitPattern(raw, stepCount), new Set([0]), 0.02, 0.02);
}

function generatePadRhythm(stepCount: number, _energy: number): boolean[] {
   const base = 16;
   // Pads: very sparse, 1-2 hits
   const hits = randomInRange(1, 2);
   const raw = euclidean(hits, base);
   raw[0] = true;
   return fitPattern(raw, stepCount);
}

function generateBellRhythm(stepCount: number, energy: number): boolean[] {
   const base = 16;
   const hits = randomInRange(2, Math.round(2 + energy * 2));
   const raw = euclidean(hits, base);
   const rot = randomInRange(0, base - 1);
   return humanize(
      fitPattern(rotate(raw, rot), stepCount),
      new Set(),
      0.05,
      0.05,
   );
}

// ── Instrument → generator mapping ──────────────────────────────────

const DRUM_GENERATORS: Partial<Record<InstrumentId, RhythmGenerator>> = {
   kick: generateKick,
   snare: generateSnare,
   hihat: generateHihat,
   clap: generateClap,
   cowbell: generateCowbell,
   rimshot: generateRimshot,
   metal: generateMetal,
   "noise-sweep": generateNoiseSweep,
};

type RoleKey = "bass" | "lead" | "arpeggio" | "pad" | "bell" | "chord";

const ROLE_GENERATORS: Record<RoleKey, RhythmGenerator> = {
   bass: generateBassRhythm,
   lead: generateLeadRhythm,
   arpeggio: generateArpRhythm,
   pad: generatePadRhythm,
   bell: generateBellRhythm,
   chord: generateChordRhythm,
};

function generateRhythmForTrack(
   instrumentId: InstrumentId,
   stepCount: number,
   energy: number,
): boolean[] {
   const drumGen = DRUM_GENERATORS[instrumentId];
   if (drumGen) return drumGen(stepCount, energy);

   const preset = INSTRUMENT_MAP.get(instrumentId);
   const role = (preset?.role ?? "lead") as RoleKey;
   const roleGen = ROLE_GENERATORS[role];
   return roleGen(stepCount, energy);
}

// ── Algorithmic arrangement ──────────────────────────────────────────
// Instead of 12 hardcoded templates, algorithmically decide which
// instruments play based on a random energy level.

interface ArrangementSlot {
   id: InstrumentId;
   /** Minimum energy to include (0-1) */
   minEnergy: number;
   /** Base probability of inclusion when energy >= minEnergy */
   probability: number;
   /** If true, always included */
   required?: boolean;
}

const ARRANGEMENT_SLOTS: ArrangementSlot[] = [
   // Foundation — always present
   { id: "kick", minEnergy: 0, probability: 1, required: true },
   { id: "bass", minEnergy: 0, probability: 1, required: true },
   // Core rhythm
   { id: "hihat", minEnergy: 0.1, probability: 0.8 },
   { id: "snare", minEnergy: 0.2, probability: 0.5 },
   { id: "clap", minEnergy: 0.15, probability: 0.45 },
   // Melodic layers
   { id: "chord-stab", minEnergy: 0, probability: 0.65 },
   { id: "lead", minEnergy: 0.15, probability: 0.5 },
   { id: "pluck", minEnergy: 0.2, probability: 0.35 },
   { id: "arp", minEnergy: 0.3, probability: 0.35 },
   { id: "fm-bell", minEnergy: 0.1, probability: 0.3 },
   // Accents & texture
   { id: "sub-bass", minEnergy: 0.3, probability: 0.2 },
   { id: "cowbell", minEnergy: 0.4, probability: 0.2 },
   { id: "rimshot", minEnergy: 0.3, probability: 0.2 },
   { id: "metal", minEnergy: 0.5, probability: 0.15 },
   { id: "noise-sweep", minEnergy: 0.2, probability: 0.15 },
];

function generateArrangement(energy: number): Set<InstrumentId> {
   const active = new Set<InstrumentId>();

   for (const slot of ARRANGEMENT_SLOTS) {
      if (slot.required) {
         active.add(slot.id);
         continue;
      }
      if (energy < slot.minEnergy) continue;

      // Probability increases with energy
      const scaledProb = slot.probability * (0.5 + 0.5 * energy);
      if (chance(scaledProb)) {
         active.add(slot.id);
      }
   }

   // Ensure we don't have both snare AND clap at low energy (too busy)
   if (energy < 0.4 && active.has("snare") && active.has("clap")) {
      active.delete(chance(0.5) ? "snare" : "clap");
   }

   // Cap total instruments at 7 to prevent clutter
   if (active.size > 7) {
      const required = new Set<InstrumentId>(["kick", "bass"]);
      const optional = [...active].filter((id) => !required.has(id));
      // Shuffle and keep only enough to reach 7
      for (let i = optional.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [optional[i], optional[j]] = [optional[j], optional[i]];
      }
      const keep = optional.slice(0, 5);
      active.clear();
      for (const id of required) active.add(id);
      for (const id of keep) active.add(id);
   }

   // At least 3 instruments for musical interest
   if (active.size < 3 && !active.has("chord-stab")) {
      active.add("chord-stab");
   }
   if (active.size < 3 && !active.has("hihat")) {
      active.add("hihat");
   }

   return active;
}

function generateBpm(energy: number): number {
   // Low energy → 70-95 BPM, High energy → 120-140 BPM
   const minBpm = Math.round(70 + energy * 50);
   const maxBpm = Math.round(90 + energy * 50);
   return randomInRange(minBpm, maxBpm);
}

function generateEffects(energy: number): Set<string> {
   const fx = new Set<string>();

   // Hall reverb — almost always, especially at lower energy
   if (chance(0.8 + (1 - energy) * 0.2)) fx.add("Hall");

   // Delay — more common at lower energy (spacious)
   if (chance(0.15 + (1 - energy) * 0.35)) fx.add("Delay");

   // Wobble — occasional, more at high energy
   if (chance(energy * 0.25)) fx.add("Wobble");

   return fx;
}

// ── Public API ───────────────────────────────────────────────────────

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
   const energy = Math.random();
   const activeInstruments = generateArrangement(energy);

   const grid: Record<string, boolean[][]> = {};

   for (const track of tracks) {
      if (activeInstruments.has(track.instrumentId)) {
         grid[track.id] = [
            generateRhythmForTrack(track.instrumentId, stepCount, energy),
         ];
      } else {
         grid[track.id] = [Array(stepCount).fill(false)];
      }
   }

   const harmonicContext = generateHarmonicContext();
   const noteGrid = generateNoteGrid(harmonicContext, tracks, stepCount);
   const velocityGrid = generateVelocityGrid(tracks, stepCount);
   const suggestedBpm = generateBpm(energy);

   return {
      grid,
      effects: generateEffects(energy),
      noteGrid,
      harmonicContext,
      velocityGrid,
      suggestedBpm,
   };
}
