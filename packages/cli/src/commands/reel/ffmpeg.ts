/**
 * FFmpeg composite operations for reel production.
 *
 * Takes a talking-head video + optional music/captions and produces
 * a final reel at the target aspect ratio. Uses child_process.execFile
 * to call ffmpeg directly.
 */

import { execFile } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import type { CompositeOptions, AspectFormat } from "./types.js";
import { ensureTmpDir } from "./storage.js";

const DIMENSIONS: Record<AspectFormat, { w: number; h: number }> = {
  "9:16": { w: 1080, h: 1920 },
  "16:9": { w: 1920, h: 1080 },
  "1:1": { w: 1080, h: 1080 },
};

/**
 * Composite a talking-head video with optional music and captions.
 *
 * The talking-head video already contains the narration audio baked in.
 * We scale/pad to the target aspect ratio, mix in background music at -15dB,
 * and optionally burn in SRT captions.
 */
export async function composite(opts: CompositeOptions): Promise<void> {
  const dim = DIMENSIONS[opts.format];
  const args: string[] = ["-y"]; // overwrite output

  // Input 0: talking-head video (includes narration audio)
  args.push("-i", opts.talkingHeadVideo);

  // Input 1: background music (optional)
  if (opts.musicAudio) {
    args.push("-i", opts.musicAudio);
  }

  // Build the filter graph
  const filters: string[] = [];
  let videoLabel = "[vscaled]";
  const audioLabel = opts.musicAudio ? "[aout]" : "0:a";

  // Scale + pad video to target dimensions
  filters.push(
    `[0:v]scale=${dim.w}:${dim.h}:force_original_aspect_ratio=decrease,` +
      `pad=${dim.w}:${dim.h}:(ow-iw)/2:(oh-ih)/2:color=black${videoLabel}`
  );

  // Mix audio: narration from video + music at ~15% volume
  if (opts.musicAudio) {
    filters.push(`[1:a]volume=0.15[bgmusic]`);
    filters.push(
      `[0:a][bgmusic]amix=inputs=2:duration=first:dropout_transition=2[aout]`
    );
  }

  // Burn in captions
  if (opts.captions) {
    const escapedPath = opts.captions
      .replace(/\\/g, "\\\\")
      .replace(/:/g, "\\:")
      .replace(/'/g, "\\'");

    const captionLabel = "[vcaption]";
    filters.push(
      `${videoLabel}subtitles='${escapedPath}':force_style=` +
        `'FontSize=24,FontName=Inter,PrimaryColour=&Hffffff,` +
        `OutlineColour=&H000000,Outline=2,Alignment=2,MarginV=60'${captionLabel}`
    );
    videoLabel = captionLabel;
  }

  args.push("-filter_complex", filters.join(";"));

  // Map outputs
  args.push("-map", videoLabel);
  args.push("-map", audioLabel);

  // Encoding settings
  args.push("-c:v", "libx264", "-preset", "fast", "-crf", "23");
  args.push("-c:a", "aac", "-b:a", "192k");
  args.push("-shortest");
  args.push("-movflags", "+faststart");
  args.push(opts.output);

  console.log(`      Running: ffmpeg ${args.join(" ")}`);

  await new Promise<void>((resolve, reject) => {
    execFile("ffmpeg", args, { maxBuffer: 50 * 1024 * 1024 }, (err, _stdout, stderr) => {
      if (err) {
        reject(new Error(`FFmpeg failed (exit ${err.code}):\n${stderr}`));
      } else {
        resolve();
      }
    });
  });
}

// ── SRT Caption Generation ──

interface SrtEntry {
  index: number;
  startMs: number;
  endMs: number;
  text: string;
}

/**
 * Generate an SRT subtitle file from a script string.
 *
 * Splits the script into phrases of ~8 words on sentence boundaries,
 * then distributes them evenly based on an estimated speaking rate
 * of 150 words per minute.
 */
export function generateSrt(script: string): string {
  const words = script.split(/\s+/).filter(Boolean);
  const totalWords = words.length;
  const wpm = 150;
  const totalDurationMs = (totalWords / wpm) * 60 * 1000;

  const phrases = splitIntoPhrases(script, 8);
  const entries: SrtEntry[] = [];
  let currentMs = 0;

  for (let i = 0; i < phrases.length; i++) {
    const phraseWords = phrases[i].split(/\s+/).filter(Boolean).length;
    const durationMs = (phraseWords / totalWords) * totalDurationMs;

    entries.push({
      index: i + 1,
      startMs: Math.round(currentMs),
      endMs: Math.round(currentMs + durationMs),
      text: phrases[i],
    });

    currentMs += durationMs;
  }

  return entries.map((e) => formatSrtEntry(e)).join("\n\n");
}

function splitIntoPhrases(text: string, targetWords: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+\s*/g) || [text];
  const phrases: string[] = [];

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    const wordCount = trimmed.split(/\s+/).length;

    if (wordCount <= targetWords) {
      phrases.push(trimmed);
    } else {
      const words = trimmed.split(/\s+/);
      for (let i = 0; i < words.length; i += targetWords) {
        const chunk = words.slice(i, i + targetWords).join(" ");
        if (chunk) phrases.push(chunk);
      }
    }
  }

  return phrases;
}

function formatSrtEntry(entry: SrtEntry): string {
  return `${entry.index}\n${formatTimestamp(entry.startMs)} --> ${formatTimestamp(entry.endMs)}\n${entry.text}`;
}

function formatTimestamp(ms: number): string {
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1_000);
  const millis = ms % 1_000;

  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0") +
    "," +
    String(millis).padStart(3, "0")
  );
}

/**
 * Write an SRT string to a temp file and return its path.
 */
export function writeSrtFile(srt: string): string {
  const tmpDir = ensureTmpDir();
  const srtPath = join(tmpDir, `captions-${Date.now()}.srt`);
  writeFileSync(srtPath, srt);
  return srtPath;
}

/**
 * Clean up a temp SRT file (best-effort).
 */
export function cleanupSrtFile(path: string): void {
  try {
    unlinkSync(path);
  } catch {
    // ignore cleanup errors
  }
}
