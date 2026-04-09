/**
 * Types for the reel production pipeline.
 *
 * Characters and voices are stored as local JSON profiles.
 * The create pipeline chains multiple FairStack API calls
 * (image, voice, talking-head, music) then composites with FFmpeg.
 */

// ── Character ──

export interface CharacterProfile {
  name: string;
  product: string;
  imageUrl: string;
  localImage: string;
  prompt: string;
  model: string;
  createdAt: string;
}

// ── Voice ──

export type VoiceType = "library" | "cloned";

export interface VoiceProfile {
  name: string;
  type: VoiceType;
  model: string;
  /** For library voices — the voice ID from the FairStack library. */
  voiceId?: string;
  /** For cloned voices — URL to the reference audio. */
  referenceAudioUrl?: string;
  /** For cloned voices — transcript of the reference audio. */
  referenceText?: string;
  createdAt: string;
}

// ── Pipeline ──

export type AspectFormat = "9:16" | "16:9" | "1:1";

export interface CreateOptions {
  character: string;
  voice: string;
  script: string;
  format: AspectFormat;
  output: string;
  music?: string;
  captions: boolean;
  talkingHeadModel: string;
}

export interface CostBreakdown {
  voice: number;
  talkingHead: number;
  music: number;
  total: number;
}

// ── FFmpeg Composite ──

export interface CompositeOptions {
  talkingHeadVideo: string;
  musicAudio?: string;
  format: AspectFormat;
  captions?: string;
  output: string;
}
