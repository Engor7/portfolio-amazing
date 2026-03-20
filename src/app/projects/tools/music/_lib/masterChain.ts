import type * as ToneNs from "tone";

export interface MasterChain {
   masterGain: ToneNs.Gain;
   compressor: ToneNs.Compressor;
   limiter: ToneNs.Limiter;
   hall: ToneNs.Reverb;
   delay: ToneNs.PingPongDelay;
   wobble: ToneNs.AutoFilter;
}

function buildChain(
   Tone: typeof ToneNs,
   destination: ToneNs.ToneAudioNode,
): MasterChain {
   const masterGain = new Tone.Gain(0.55);

   const compressor = new Tone.Compressor({
      threshold: -12,
      ratio: 2.5,
      attack: 0.01,
      release: 0.15,
      knee: 10,
   });

   const limiter = new Tone.Limiter(-3);

   const hall = new Tone.Reverb({ decay: 1.5, preDelay: 0.03, wet: 0 });
   const delay = new Tone.PingPongDelay({
      delayTime: "8n",
      feedback: 0.2,
      wet: 0,
   });

   const wobble = new Tone.AutoFilter({
      frequency: 1.5,
      baseFrequency: 200,
      octaves: 3,
   }).start();
   wobble.wet.value = 0;

   masterGain.chain(compressor, hall, delay, wobble, limiter, destination);

   return { masterGain, compressor, limiter, hall, delay, wobble };
}

export async function createMasterChain(
   Tone: typeof ToneNs,
   destination: ToneNs.ToneAudioNode,
): Promise<MasterChain> {
   const chain = buildChain(Tone, destination);
   await chain.hall.ready;
   return chain;
}

export function createMasterChainSync(
   Tone: typeof ToneNs,
   destination: ToneNs.ToneAudioNode,
): MasterChain {
   return buildChain(Tone, destination);
}
