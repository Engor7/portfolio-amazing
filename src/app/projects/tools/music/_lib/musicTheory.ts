import { INSTRUMENT_CATALOG } from "./constants";
import type {
   HarmonicContext,
   InstrumentRole,
   NoteGrid,
   TrackConfig,
   VelocityGrid,
} from "./types";

const NOTE_NAMES = [
   "C",
   "C#",
   "D",
   "D#",
   "E",
   "F",
   "F#",
   "G",
   "G#",
   "A",
   "A#",
   "B",
];

const SCALES: Record<string, number[]> = {
   major: [0, 2, 4, 5, 7, 9, 11],
   naturalMinor: [0, 2, 3, 5, 7, 8, 10],
   dorian: [0, 2, 3, 5, 7, 9, 10],
   mixolydian: [0, 2, 4, 5, 7, 9, 10],
   minorPentatonic: [0, 3, 5, 7, 10],
   majorPentatonic: [0, 2, 4, 7, 9],
};

const PARENT_SCALE: Record<string, string> = {
   major: "major",
   naturalMinor: "naturalMinor",
   dorian: "naturalMinor",
   mixolydian: "major",
   majorPentatonic: "major",
   minorPentatonic: "naturalMinor",
};

// Weighted: pentatonic scales are more forgiving
const SCALE_CHOICES: { name: string; weight: number }[] = [
   { name: "majorPentatonic", weight: 3 },
   { name: "minorPentatonic", weight: 3 },
   { name: "major", weight: 2 },
   { name: "naturalMinor", weight: 2 },
   { name: "dorian", weight: 1 },
   { name: "mixolydian", weight: 1 },
];

const PROGRESSIONS: { name: string; degrees: number[] }[] = [
   { name: "I-V-vi-IV", degrees: [0, 4, 5, 3] },
   { name: "vi-IV-I-V", degrees: [5, 3, 0, 4] },
   { name: "i-VI-III-VII", degrees: [0, 5, 2, 6] },
   { name: "I-vi-IV-V", degrees: [0, 5, 3, 4] },
   { name: "i-iv-VII-III", degrees: [0, 3, 6, 2] },
   { name: "I-IV-V-IV", degrees: [0, 3, 4, 3] },
];

// --- Arpeggio figures (point 3) ---
const ARP_FIGURES = [
   [0, 1, 2, 1], // up-down
   [2, 1, 0, 1], // down-up
   [0, 2, 1, 2], // skip
   [0, 0, 1, 2], // root-emphasis
];

function pick<T>(arr: T[]): T {
   return arr[Math.floor(Math.random() * arr.length)];
}

function weightedPick<T extends { weight: number }>(items: T[]): T {
   const total = items.reduce((s, i) => s + i.weight, 0);
   let r = Math.random() * total;
   for (const item of items) {
      r -= item.weight;
      if (r <= 0) return item;
   }
   return items[items.length - 1];
}

function noteToMidi(note: string): number {
   const match = note.match(/^([A-G]#?)(\d+)$/);
   if (!match) return 60;
   const name = match[1];
   const octave = parseInt(match[2], 10);
   const idx = NOTE_NAMES.indexOf(name);
   return idx + (octave + 1) * 12;
}

function midiToNote(midi: number): string {
   const idx = ((midi % 12) + 12) % 12;
   const octave = Math.floor(midi / 12) - 1;
   return `${NOTE_NAMES[idx]}${octave}`;
}

// --- Voice leading (point 4) ---
function voiceLead(prevChord: string[], nextChord: string[]): string[] {
   if (prevChord.length === 0) return nextChord;
   const prevMidis = prevChord.map(noteToMidi);
   const result: string[] = [];
   const usedMidi = new Set<number>();

   for (const targetNote of nextChord) {
      const targetPc = noteToMidi(targetNote) % 12;
      let bestMidi = noteToMidi(targetNote);
      let bestDist = Infinity;

      // Try octave positions near each previous voice
      for (const pm of prevMidis) {
         for (let oct = -1; oct <= 1; oct++) {
            const candidate = targetPc + Math.floor((pm + oct * 12) / 12) * 12;
            const dist = Math.abs(candidate - pm);
            if (
               dist < bestDist &&
               !usedMidi.has(candidate) &&
               candidate >= 24 &&
               candidate <= 96
            ) {
               bestDist = dist;
               bestMidi = candidate;
            }
         }
      }
      usedMidi.add(bestMidi);
      result.push(midiToNote(bestMidi));
   }
   return result;
}

// --- Mood system ---
export type MoodId = "happy" | "dark" | "chill" | "energetic";

const MOOD_MAP: Record<
   MoodId,
   { scales: string[]; progressions: string[]; rootBias: string[] }
> = {
   happy: {
      scales: ["majorPentatonic", "major"],
      progressions: ["I-V-vi-IV", "I-IV-V-IV"],
      rootBias: ["C", "G", "F", "D"],
   },
   dark: {
      scales: ["minorPentatonic", "naturalMinor", "dorian"],
      progressions: ["i-VI-III-VII", "i-iv-VII-III"],
      rootBias: ["A", "D", "E", "B"],
   },
   chill: {
      scales: ["majorPentatonic", "dorian", "mixolydian"],
      progressions: ["I-vi-IV-V", "vi-IV-I-V"],
      rootBias: ["F", "E", "G", "A"],
   },
   energetic: {
      scales: ["minorPentatonic", "mixolydian", "naturalMinor"],
      progressions: ["i-VI-III-VII", "I-V-vi-IV", "I-IV-V-IV"],
      rootBias: ["A", "E", "D", "G"],
   },
};

export function generateHarmonicContextForMood(mood: MoodId): HarmonicContext {
   const config = MOOD_MAP[mood];
   const root = pick(config.rootBias);
   const scaleName = pick(config.scales);
   const progName = pick(config.progressions);
   const prog =
      PROGRESSIONS.find((p) => p.name === progName) ?? PROGRESSIONS[0];
   return {
      root,
      scale: SCALES[scaleName],
      scaleName,
      parentScale: SCALES[PARENT_SCALE[scaleName] ?? "major"],
      progression: prog.degrees,
      progressionName: prog.name,
   };
}

export function generateHarmonicContext(): HarmonicContext {
   const root = pick(NOTE_NAMES);
   const scaleChoice = weightedPick(SCALE_CHOICES);
   const prog = pick(PROGRESSIONS);
   return {
      root,
      scale: SCALES[scaleChoice.name],
      scaleName: scaleChoice.name,
      parentScale: SCALES[PARENT_SCALE[scaleChoice.name] ?? "major"],
      progression: prog.degrees,
      progressionName: prog.name,
   };
}

export function getScaleNotes(
   root: string,
   scale: number[],
   octaveLow: number,
   octaveHigh: number,
): string[] {
   const rootIdx = NOTE_NAMES.indexOf(root);
   const notes: string[] = [];
   for (let oct = octaveLow; oct <= octaveHigh; oct++) {
      for (const interval of scale) {
         const midi = (oct + 1) * 12 + rootIdx + interval;
         notes.push(midiToNote(midi));
      }
   }
   return notes;
}

function buildChordFromParent(
   scaleDegree: number,
   parentNotes: string[],
   trackScale: string[],
): string[] {
   const len = parentNotes.length;
   if (len === 0) return [];
   const root = scaleDegree % len;
   const third = (scaleDegree + 2) % len;
   const fifth = (scaleDegree + 4) % len;

   const rawNotes = [parentNotes[root], parentNotes[third], parentNotes[fifth]];

   const sorted = rawNotes.map((n) => ({ note: n, midi: noteToMidi(n) }));
   for (let i = 1; i < sorted.length; i++) {
      while (sorted[i].midi <= sorted[i - 1].midi) {
         sorted[i].midi += 12;
         sorted[i].note = midiToNote(sorted[i].midi);
      }
   }

   if (trackScale.length === 0) return sorted.map((s) => s.note);

   const trackMidis = trackScale.map(noteToMidi);
   const snapped: string[] = [];
   const seenMidi = new Set<number>();

   for (const { midi } of sorted) {
      let closest = trackMidis[0];
      let minDist = Math.abs(midi - closest);
      for (const tm of trackMidis) {
         const dist = Math.abs(midi - tm);
         if (dist < minDist) {
            minDist = dist;
            closest = tm;
         }
      }
      if (!seenMidi.has(closest)) {
         seenMidi.add(closest);
         snapped.push(midiToNote(closest));
      }
   }
   return snapped;
}

function buildChord(scaleDegree: number, scaleNotes: string[]): string[] {
   const len = scaleNotes.length;
   if (len === 0) return [];
   const root = scaleDegree % len;
   const third = (scaleDegree + 2) % len;
   const fifth = (scaleDegree + 4) % len;

   const notes = [scaleNotes[root], scaleNotes[third], scaleNotes[fifth]];

   const sorted = notes.map((n) => ({ note: n, midi: noteToMidi(n) }));
   for (let i = 1; i < sorted.length; i++) {
      while (sorted[i].midi <= sorted[i - 1].midi) {
         sorted[i].midi += 12;
         sorted[i].note = midiToNote(sorted[i].midi);
      }
   }
   return sorted.map((s) => s.note);
}

// --- Extended chords (point 8) ---
function maybeExtendChord(
   chord: string[],
   parentNotes: string[],
   scaleDegree: number,
): string[] {
   const len = parentNotes.length;
   if (len === 0 || chord.length < 3) return chord;

   const r = Math.random();
   if (r < 0.25) {
      // Add 7th
      const seventh = (scaleDegree + 6) % len;
      const seventhNote = parentNotes[seventh];
      if (seventhNote) {
         let seventhMidi = noteToMidi(seventhNote);
         const fifthMidi = noteToMidi(chord[chord.length - 1]);
         while (seventhMidi <= fifthMidi) seventhMidi += 12;
         return [...chord, midiToNote(seventhMidi)];
      }
   } else if (r < 0.35) {
      // sus4: replace third with fourth
      const fourth = (scaleDegree + 3) % len;
      const fourthNote = parentNotes[fourth];
      if (fourthNote) {
         let fourthMidi = noteToMidi(fourthNote);
         const rootMidi = noteToMidi(chord[0]);
         while (fourthMidi <= rootMidi) fourthMidi += 12;
         return [chord[0], midiToNote(fourthMidi), ...chord.slice(2)];
      }
   } else if (r < 0.4) {
      // sus2: replace third with second
      const second = (scaleDegree + 1) % len;
      const secondNote = parentNotes[second];
      if (secondNote) {
         let secondMidi = noteToMidi(secondNote);
         const rootMidi = noteToMidi(chord[0]);
         while (secondMidi <= rootMidi) secondMidi += 12;
         return [chord[0], midiToNote(secondMidi), ...chord.slice(2)];
      }
   }
   return chord;
}

function getChordForStep(
   step: number,
   stepCount: number,
   progression: number[],
): number {
   const stepsPerChord = Math.max(
      1,
      Math.floor(stepCount / progression.length),
   );
   const chordIdx = Math.min(
      Math.floor(step / stepsPerChord),
      progression.length - 1,
   );
   return progression[chordIdx];
}

// --- Improved bass lines (point 5) ---
function generateBassNotes(
   context: HarmonicContext,
   stepCount: number,
   octaveLow: number,
   octaveHigh: number,
): (string | null)[] {
   const trackScale = getScaleNotes(
      context.root,
      context.scale,
      octaveLow,
      octaveHigh,
   );
   const parentNotes = getScaleNotes(
      context.root,
      context.parentScale,
      octaveLow,
      octaveHigh,
   );
   const result: (string | null)[] = Array(stepCount).fill(null);
   const stepsPerChord = Math.max(
      1,
      Math.floor(stepCount / context.progression.length),
   );

   for (let i = 0; i < stepCount; i++) {
      const chordDegree = getChordForStep(i, stepCount, context.progression);
      const chord = buildChordFromParent(chordDegree, parentNotes, trackScale);
      if (chord.length === 0) continue;

      const posInChord = i % stepsPerChord;
      const rootMidi = noteToMidi(chord[0]);

      if (posInChord === 0) {
         // Beat 1: always root
         result[i] = chord[0];
      } else if (posInChord === Math.floor(stepsPerChord / 2)) {
         // Beat 3 equivalent: 5th, octave, or 3rd
         const r = Math.random();
         if (r < 0.5 && chord.length >= 3) {
            result[i] = chord[2]; // 5th
         } else if (r < 0.7) {
            result[i] = midiToNote(rootMidi + 12); // octave
         } else if (chord.length >= 2) {
            result[i] = chord[1]; // 3rd
         } else {
            result[i] = chord[0];
         }
      } else if (posInChord === stepsPerChord - 1) {
         // Last step: approach tone to next chord root
         const nextChordIdx = Math.min(
            Math.floor(i / stepsPerChord) + 1,
            context.progression.length - 1,
         );
         const nextDegree = context.progression[nextChordIdx];
         const nextChord = buildChordFromParent(
            nextDegree,
            parentNotes,
            trackScale,
         );
         if (nextChord.length > 0) {
            const nextRoot = noteToMidi(nextChord[0]);
            // Approach from one semitone above or below
            const approach = Math.random() < 0.5 ? nextRoot - 1 : nextRoot + 1;
            result[i] = midiToNote(approach);
         } else {
            result[i] = chord[0];
         }
      } else if (Math.random() < 0.1) {
         // Rare octave jump (10%)
         result[i] = midiToNote(rootMidi + 12);
      } else {
         result[i] = chord[0];
      }
   }
   return result;
}

// --- Musical contour shapes for lead melodies ---
const CONTOUR_SHAPES: number[][] = [
   [0, 1, 2, 3, 2, 1, 0, -1], // arch
   [0, -1, -2, -1, 0, 1, 2, 1], // valley
   [0, 1, 2, 3, 4, 3, 2, 1], // ascending peak
   [0, -1, 0, 1, 0, -1, 0, 1], // oscillating
   [0, 2, 1, 3, 2, 4, 3, 2], // ascending steps
   [0, -1, -2, -3, -2, -1, 0, 1], // descending valley
];

// --- Lead motifs (point 6) ---
function generateLeadNotes(
   context: HarmonicContext,
   stepCount: number,
   octaveLow: number,
   octaveHigh: number,
): (string | null)[] {
   const trackScale = getScaleNotes(
      context.root,
      context.scale,
      octaveLow,
      octaveHigh,
   );
   const parentNotes = getScaleNotes(
      context.root,
      context.parentScale,
      octaveLow,
      octaveHigh,
   );
   if (trackScale.length === 0) return Array(stepCount).fill(null);

   const result: (string | null)[] = Array(stepCount).fill(null);
   const contour = pick(CONTOUR_SHAPES);
   const phraseLen = 8; // re-anchor every 8 steps

   // Start near middle of scale
   let currentPos = Math.floor(trackScale.length / 2);

   for (let i = 0; i < stepCount; i++) {
      const chordDegree = getChordForStep(i, stepCount, context.progression);
      const chord = buildChordFromParent(chordDegree, parentNotes, trackScale);
      if (chord.length === 0) continue;

      const chordMidis = chord.map(noteToMidi);

      // Re-anchor on phrase boundaries
      if (i % phraseLen === 0) {
         // Find nearest chord tone to current position as new anchor
         const currentMidi = noteToMidi(trackScale[currentPos]);
         let bestIdx = currentPos;
         let bestDist = Infinity;
         for (const cm of chordMidis) {
            const dist = Math.abs(cm - currentMidi);
            if (dist < bestDist) {
               bestDist = dist;
               const idx = trackScale.findIndex((n) => noteToMidi(n) === cm);
               if (idx >= 0) bestIdx = idx;
            }
         }
         currentPos = bestIdx;
      }

      // Apply contour shape offset
      const contourOffset = contour[i % contour.length];
      let targetPos = currentPos + contourOffset;
      targetPos = Math.max(0, Math.min(trackScale.length - 1, targetPos));

      // Prefer stepwise motion: limit jump from previous position
      if (i > 0) {
         const maxStep = 2; // max 2 scale degrees at a time
         if (targetPos - currentPos > maxStep) targetPos = currentPos + maxStep;
         if (currentPos - targetPos > maxStep) targetPos = currentPos - maxStep;
         targetPos = Math.max(0, Math.min(trackScale.length - 1, targetPos));
      }

      // On strong beats (every 4 steps), snap to nearest chord tone
      if (i % 4 === 0 && chord.length > 0) {
         const targetMidi = noteToMidi(trackScale[targetPos]);
         let closestIdx = targetPos;
         let closestDist = Infinity;
         for (const cm of chordMidis) {
            const dist = Math.abs(cm - targetMidi);
            if (dist < closestDist) {
               closestDist = dist;
               const scaleIdx = trackScale.findIndex(
                  (n) => noteToMidi(n) === cm,
               );
               if (scaleIdx >= 0) closestIdx = scaleIdx;
            }
         }
         if (closestDist <= 4) targetPos = closestIdx;
      }

      currentPos = targetPos;
      result[i] = trackScale[currentPos];
   }
   return result;
}

// --- Arpeggio with figures (point 3) ---
function generateArpeggioNotes(
   context: HarmonicContext,
   stepCount: number,
   octaveLow: number,
   octaveHigh: number,
): (string | null)[] {
   const trackScale = getScaleNotes(
      context.root,
      context.scale,
      octaveLow,
      octaveHigh,
   );
   const parentNotes = getScaleNotes(
      context.root,
      context.parentScale,
      octaveLow,
      octaveHigh,
   );
   const result: (string | null)[] = Array(stepCount).fill(null);

   const figure = pick(ARP_FIGURES);

   for (let i = 0; i < stepCount; i++) {
      const chordDegree = getChordForStep(i, stepCount, context.progression);
      const chord = buildChordFromParent(chordDegree, parentNotes, trackScale);
      if (chord.length === 0) continue;
      const figIdx = figure[i % figure.length];
      result[i] = chord[figIdx % chord.length];
   }
   return result;
}

// --- Pad with voice leading (point 4) ---
function generatePadNotes(
   context: HarmonicContext,
   stepCount: number,
   octaveLow: number,
   octaveHigh: number,
): (string | null)[] {
   const trackScale = getScaleNotes(
      context.root,
      context.scale,
      octaveLow,
      octaveHigh,
   );
   const parentNotes = getScaleNotes(
      context.root,
      context.parentScale,
      octaveLow,
      octaveHigh,
   );
   const result: (string | null)[] = Array(stepCount).fill(null);
   const stepsPerChord = Math.max(
      1,
      Math.floor(stepCount / context.progression.length),
   );

   let prevChord: string[] = [];

   for (let i = 0; i < stepCount; i++) {
      const chordDegree = getChordForStep(i, stepCount, context.progression);
      const chord = buildChordFromParent(chordDegree, parentNotes, trackScale);
      if (chord.length === 0) continue;

      if (i % stepsPerChord === 0 || result[i - 1] === null) {
         const voiced = voiceLead(prevChord, chord);
         result[i] = voiced[0] ?? chord[0];
         prevChord = voiced.length > 0 ? voiced : chord;
      } else {
         result[i] = result[i - 1];
      }
   }
   return result;
}

// --- Chord with voice leading + extensions (points 4, 8) ---
function generateChordNotes(
   context: HarmonicContext,
   stepCount: number,
   octaveLow: number,
   octaveHigh: number,
): (string[] | null)[] {
   const parentNotes = getScaleNotes(
      context.root,
      context.parentScale,
      octaveLow,
      octaveHigh,
   );
   const result: (string[] | null)[] = Array(stepCount).fill(null);

   let prevChord: string[] = [];

   for (let i = 0; i < stepCount; i++) {
      const chordDegree = getChordForStep(i, stepCount, context.progression);
      let chord = buildChord(chordDegree, parentNotes);
      chord = maybeExtendChord(chord, parentNotes, chordDegree);

      if (chord.length > 0) {
         const voiced = voiceLead(prevChord, chord);
         result[i] = voiced;
         prevChord = voiced;
      }
   }
   return result;
}

// --- Coherent bell (point 9) ---
function generateBellNotes(
   context: HarmonicContext,
   stepCount: number,
   octaveLow: number,
   octaveHigh: number,
): (string | null)[] {
   const trackScale = getScaleNotes(
      context.root,
      context.scale,
      octaveLow,
      octaveHigh,
   );
   const parentNotes = getScaleNotes(
      context.root,
      context.parentScale,
      octaveLow,
      octaveHigh,
   );
   if (trackScale.length === 0) return Array(stepCount).fill(null);

   const result: (string | null)[] = Array(stepCount).fill(null);
   const upperHalf = trackScale.slice(Math.floor(trackScale.length / 2));

   // Pick a 2-note fragment (an interval) to repeat
   const fragmentInterval = pick([2, 3, 4, 5]); // in scale degrees

   for (let i = 0; i < stepCount; i++) {
      const chordDegree = getChordForStep(i, stepCount, context.progression);
      const chord = buildChordFromParent(chordDegree, parentNotes, trackScale);
      const upperChordTones = chord.filter((n) => upperHalf.includes(n));

      // Pick anchor from upper chord tones
      let anchor: string;
      if (upperChordTones.length > 0) {
         anchor = upperChordTones[0];
      } else if (upperHalf.length > 0) {
         anchor = upperHalf[0];
      } else {
         anchor = trackScale[0];
      }

      const anchorIdx = trackScale.indexOf(anchor);
      // Alternate between anchor and anchor+interval (2-note fragment)
      if (i % 2 === 0) {
         result[i] = anchor;
      } else {
         const secondIdx = Math.min(
            anchorIdx + fragmentInterval,
            trackScale.length - 1,
         );
         result[i] = trackScale[secondIdx];
      }
   }
   return result;
}

export function generateNoteGrid(
   context: HarmonicContext,
   tracks: TrackConfig[],
   stepCount: number,
): NoteGrid {
   const noteGrid: NoteGrid = {};

   for (const track of tracks) {
      const preset = INSTRUMENT_CATALOG.find(
         (p) => p.id === track.instrumentId,
      );
      if (!preset || preset.kind === "drum") continue;

      const role: InstrumentRole = preset.role ?? "lead";
      const [octLow, octHigh] = preset.octaveRange;

      switch (role) {
         case "bass":
            noteGrid[track.id] = generateBassNotes(
               context,
               stepCount,
               octLow,
               octHigh,
            );
            break;
         case "lead":
            noteGrid[track.id] = generateLeadNotes(
               context,
               stepCount,
               octLow,
               octHigh,
            );
            break;
         case "arpeggio":
            noteGrid[track.id] = generateArpeggioNotes(
               context,
               stepCount,
               octLow,
               octHigh,
            );
            break;
         case "pad":
            noteGrid[track.id] = generatePadNotes(
               context,
               stepCount,
               octLow,
               octHigh,
            );
            break;
         case "chord":
            noteGrid[track.id] = generateChordNotes(
               context,
               stepCount,
               octLow,
               octHigh,
            );
            break;
         case "bell":
            noteGrid[track.id] = generateBellNotes(
               context,
               stepCount,
               octLow,
               octHigh,
            );
            break;
      }
   }

   return noteGrid;
}

// --- Velocity grid generation (point 1) ---
export function generateVelocityGrid(
   tracks: TrackConfig[],
   stepCount: number,
): VelocityGrid {
   const velocityGrid: VelocityGrid = {};

   for (const track of tracks) {
      const preset = INSTRUMENT_CATALOG.find(
         (p) => p.id === track.instrumentId,
      );
      const role =
         preset?.kind === "drum" ? preset.id : (preset?.role ?? "lead");
      const velocities: number[] = [];

      for (let i = 0; i < stepCount; i++) {
         let v: number;
         const isDownbeat = i % 4 === 0;
         const isHalfBeat = i % 2 === 0 && !isDownbeat;
         const _isWeakBeat = !isDownbeat && !isHalfBeat;

         // Base velocity by beat position
         if (isDownbeat) {
            v = 0.8 + Math.random() * 0.2; // 0.8-1.0
         } else if (isHalfBeat) {
            v = 0.5 + Math.random() * 0.2; // 0.5-0.7
         } else {
            v = 0.3 + Math.random() * 0.2; // 0.3-0.5
         }

         // Role-specific modifiers
         switch (role) {
            case "bass":
            case "sub-bass":
               // Bass accents beat 1 strongly
               if (i % 4 === 0) v = Math.min(1, v + 0.1);
               else v *= 0.85;
               break;
            case "hihat":
               // Alternating strong/weak for groove
               if (i % 2 === 1) v *= 0.6;
               break;
            case "kick":
               // Kick is always punchy
               v = Math.max(v, 0.75);
               break;
            case "snare":
            case "clap":
               // Snare/clap backbeat emphasis
               v = Math.max(v, 0.7);
               break;
            case "bell":
               // Bells are subtle
               v *= 0.7;
               break;
            case "pad":
               // Pads are even and soft
               v = 0.5 + Math.random() * 0.15;
               break;
            case "arpeggio":
               // Arps have slight accent on downbeats
               if (!isDownbeat) v *= 0.8;
               break;
         }

         velocities.push(Math.max(0.15, Math.min(1, v)));
      }

      velocityGrid[track.id] = velocities;
   }

   return velocityGrid;
}

export function getNoteForCell(
   context: HarmonicContext,
   track: TrackConfig,
   step: number,
   stepCount: number,
): string | string[] | null {
   const preset = INSTRUMENT_CATALOG.find((p) => p.id === track.instrumentId);
   if (!preset || preset.kind === "drum") return null;

   const role: InstrumentRole = preset.role ?? "lead";
   const [octLow, octHigh] = preset.octaveRange;
   const trackScale = getScaleNotes(
      context.root,
      context.scale,
      octLow,
      octHigh,
   );
   const parentNotes = getScaleNotes(
      context.root,
      context.parentScale,
      octLow,
      octHigh,
   );

   const chordDegree = getChordForStep(step, stepCount, context.progression);

   switch (role) {
      case "bass": {
         const chord = buildChordFromParent(
            chordDegree,
            parentNotes,
            trackScale,
         );
         return chord[0] ?? trackScale[0] ?? null;
      }
      case "chord": {
         const chord = buildChord(chordDegree, parentNotes);
         const extended = maybeExtendChord(chord, parentNotes, chordDegree);
         return extended.length > 0 ? extended : null;
      }
      case "pad": {
         const chord = buildChordFromParent(
            chordDegree,
            parentNotes,
            trackScale,
         );
         return chord[0] ?? null;
      }
      case "arpeggio": {
         const chord = buildChordFromParent(
            chordDegree,
            parentNotes,
            trackScale,
         );
         return chord.length > 0 ? chord[step % chord.length] : null;
      }
      case "bell": {
         const upper = trackScale.slice(Math.floor(trackScale.length / 2));
         const chord = buildChordFromParent(
            chordDegree,
            parentNotes,
            trackScale,
         );
         const upperChord = chord.filter((n) => upper.includes(n));
         return upperChord.length > 0
            ? upperChord[0]
            : upper.length > 0
              ? upper[0]
              : null;
      }
      default: {
         const chord = buildChordFromParent(
            chordDegree,
            parentNotes,
            trackScale,
         );
         if (chord.length > 0) {
            const isStrong = step % 4 === 0;
            return isStrong ? chord[0] : pick(chord);
         }
         return trackScale.length > 0 ? pick(trackScale) : null;
      }
   }
}
