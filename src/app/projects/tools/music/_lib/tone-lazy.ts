/**
 * Lazy Tone.js loader — avoids creating an AudioContext on module evaluation.
 * Call `ensureTone()` from a user gesture handler before using `tone()`.
 */
let _tone: typeof import("tone") | undefined;

export async function ensureTone(): Promise<typeof import("tone")> {
   if (!_tone) {
      _tone = await import("tone");
   }
   return _tone;
}

export function tone(): typeof import("tone") {
   if (!_tone) throw new Error("Tone.js not loaded — call ensureTone() first");
   return _tone;
}
