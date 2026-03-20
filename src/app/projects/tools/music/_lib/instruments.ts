import type * as ToneNs from "tone";
import { tone } from "./tone-lazy";
import type { InstrumentId } from "./types";

export interface SequencerInstrument {
   trigger(note: string | string[], time?: number, velocity?: number): void;
   dispose(): void;
}

// biome-ignore lint: Tone.js instrument types are complex, using any for flexibility
type AnyInstrument = any;

export function createInstrument(
   id: InstrumentId,
   gain: ToneNs.Gain,
): SequencerInstrument {
   const Tone = tone();
   const wrap = (
      inst: AnyInstrument,
      duration: string | number = "8n",
   ): SequencerInstrument => {
      inst.connect(gain);
      return {
         trigger: (note, time, velocity = 1) =>
            inst.triggerAttackRelease(note, duration, time, velocity),
         dispose: () => inst.dispose(),
      };
   };

   const wrapNoise = (
      inst: AnyInstrument,
      duration: string | number = "8n",
   ): SequencerInstrument => {
      inst.connect(gain);
      return {
         trigger: (_note: string | string[], time?: number, velocity = 1) =>
            inst.triggerAttackRelease(duration, time, velocity),
         dispose: () => inst.dispose(),
      };
   };

   switch (id) {
      case "kick":
         return wrap(
            new Tone.MembraneSynth({
               pitchDecay: 0.05,
               octaves: 6,
               envelope: {
                  attack: 0.001,
                  decay: 0.3,
                  sustain: 0,
                  release: 0.1,
               },
            }),
            "8n",
         );

      case "snare":
         return wrapNoise(
            new Tone.NoiseSynth({
               noise: { type: "white" },
               envelope: {
                  attack: 0.001,
                  decay: 0.15,
                  sustain: 0,
                  release: 0.05,
               },
            }),
            "16n",
         );

      case "hihat": {
         const hh = new Tone.MetalSynth({
            envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 4000,
            octaves: 1.5,
         });
         hh.frequency.value = 400;
         return wrap(hh, "32n");
      }

      case "clap":
         return wrapNoise(
            new Tone.NoiseSynth({
               noise: { type: "pink" },
               envelope: {
                  attack: 0.003,
                  decay: 0.1,
                  sustain: 0,
                  release: 0.05,
               },
            }),
            "32n",
         );

      case "bass":
         return wrap(
            new Tone.MonoSynth({
               oscillator: { type: "triangle" },
               filter: { Q: 1, type: "lowpass", rolloff: -24 },
               envelope: {
                  attack: 0.01,
                  decay: 0.3,
                  sustain: 0.4,
                  release: 0.15,
               },
               filterEnvelope: {
                  attack: 0.01,
                  decay: 0.15,
                  sustain: 0.3,
                  release: 0.2,
                  baseFrequency: 150,
                  octaves: 2,
               },
            }),
            "8n",
         );

      case "lead":
         return wrap(
            new Tone.MonoSynth({
               oscillator: { type: "sine" },
               filter: { Q: 1, type: "lowpass", rolloff: -12 },
               envelope: {
                  attack: 0.02,
                  decay: 0.4,
                  sustain: 0.3,
                  release: 0.4,
               },
               filterEnvelope: {
                  attack: 0.02,
                  decay: 0.3,
                  sustain: 0.2,
                  release: 0.4,
                  baseFrequency: 600,
                  octaves: 2.5,
               },
            }),
            "8n",
         );

      case "pluck":
         return wrap(
            new Tone.PolySynth(Tone.Synth, {
               oscillator: { type: "triangle" },
               envelope: {
                  attack: 0.002,
                  decay: 0.6,
                  sustain: 0,
                  release: 0.4,
               },
            }),
            "8n",
         );

      case "fm-bell":
         return wrap(
            new Tone.FMSynth({
               harmonicity: 6,
               modulationIndex: 1.2,
               envelope: {
                  attack: 0.001,
                  decay: 0.8,
                  sustain: 0,
                  release: 0.6,
               },
               modulation: { type: "sine" },
               modulationEnvelope: {
                  attack: 0.002,
                  decay: 0.3,
                  sustain: 0,
                  release: 0.3,
               },
            }),
            "8n",
         );

      case "metal": {
         const mt = new Tone.MetalSynth({
            envelope: { attack: 0.001, decay: 0.4, release: 0.2 },
            harmonicity: 5.1,
            modulationIndex: 24,
            resonance: 5000,
            octaves: 2,
         });
         mt.frequency.value = 800;
         return wrap(mt, "4n");
      }

      case "noise-sweep":
         return wrapNoise(
            new Tone.NoiseSynth({
               noise: { type: "brown" },
               envelope: { attack: 0.1, decay: 0.5, sustain: 0, release: 0.3 },
            }),
            "4n",
         );

      case "sub-bass":
         return wrap(
            new Tone.MembraneSynth({
               pitchDecay: 0.08,
               octaves: 4,
               envelope: { attack: 0.01, decay: 0.6, sustain: 0, release: 0.3 },
            }),
            "4n",
         );

      case "cowbell": {
         const cb = new Tone.MetalSynth({
            envelope: { attack: 0.001, decay: 0.2, release: 0.05 },
            harmonicity: 2,
            modulationIndex: 10,
            resonance: 5000,
            octaves: 0.5,
         });
         cb.frequency.value = 560;
         return wrap(cb, "16n");
      }

      case "rimshot":
         return wrap(
            new Tone.MembraneSynth({
               pitchDecay: 0.008,
               octaves: 2,
               envelope: {
                  attack: 0.001,
                  decay: 0.05,
                  sustain: 0,
                  release: 0.03,
               },
            }),
            "32n",
         );

      case "chord-stab":
         return wrap(
            new Tone.PolySynth(Tone.Synth, {
               oscillator: { type: "triangle" },
               envelope: {
                  attack: 0.03,
                  decay: 0.3,
                  sustain: 0.15,
                  release: 0.3,
               },
            }),
            "8n",
         );

      case "arp":
         return wrap(
            new Tone.FMSynth({
               harmonicity: 3,
               modulationIndex: 1.5,
               envelope: {
                  attack: 0.001,
                  decay: 0.25,
                  sustain: 0,
                  release: 0.25,
               },
               modulation: { type: "sine" },
               modulationEnvelope: {
                  attack: 0.01,
                  decay: 0.15,
                  sustain: 0,
                  release: 0.15,
               },
            }),
            "16n",
         );

      default:
         throw new Error(`Unknown instrument: ${id satisfies never}`);
   }
}
