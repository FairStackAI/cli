/**
 * Podcast Intro Producer
 *
 * Generates a podcast intro with voice narration and background music,
 * then mixes them together with ffmpeg.
 *
 * Usage:
 *   npx tsx examples/podcast-producer/produce.ts
 *
 * Dry run (no credits):
 *   FAIRSTACK_DRY_RUN=1 npx tsx examples/podcast-producer/produce.ts
 */

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ── Configuration ─────────────────────────────────────────────────────

const SHOW_NAME = "The Developer's Edge";
const VOICE_MODEL = "chatterbox-turbo";
const VOICE_ID = "internal_marco";
const MUSIC_MODEL = "mureka-bgm";
const OUTPUT_DIR = join(process.cwd(), "podcast-output");
const OUTPUT_FILE = join(OUTPUT_DIR, "podcast-intro.mp3");

const INTRO_SCRIPT =
  `Welcome to ${SHOW_NAME}, the podcast where we explore the tools, ` +
  `techniques, and mindsets that give developers an unfair advantage. ` +
  `Each week, we sit down with builders who are shipping faster, ` +
  `thinking differently, and pushing the boundaries of what's possible ` +
  `with modern development tools. I'm your host, Marco. Let's dive in.`;

// ── Helpers ───────────────────────────────────────────────────────────

interface GenerationResult {
  data: {
    output: { url: string } | null;
    cost: { credits_used: number; estimated_credits: number };
    status: string;
  };
}

interface VoiceListResult {
  voices: Array<{
    id: string;
    name: string;
    archetype: string;
    gender: string;
    description: string;
  }>;
  pagination: { total: number };
}

function fairstack(command: string): string {
  return execSync(`fairstack ${command}`, {
    encoding: "utf-8",
    timeout: 300_000,
  }).trim();
}

function formatCost(microDollars: number): string {
  const dollars = microDollars / 1_000_000;
  if (dollars < 0.01) return `$${dollars.toFixed(4)}`;
  return `$${dollars.toFixed(3)}`;
}

function getUrl(result: GenerationResult): string {
  return result.data.output?.url ?? "(pending)";
}

function getCost(result: GenerationResult): number {
  return result.data.cost?.credits_used || result.data.cost?.estimated_credits || 0;
}

function downloadFile(url: string, dest: string): void {
  // Use curl for simplicity — available on all platforms
  execSync(`curl -sL "${url}" -o "${dest}"`, { timeout: 60_000 });
}

// ── Main ──────────────────────────────────────────────────────────────

console.log(`\nPodcast Intro Producer`);
console.log(`Show: ${SHOW_NAME}\n`);

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

let totalCost = 0;

// Step 1: Browse voices
console.log("[1/4] Browsing voice library...");

const voices = JSON.parse(
  fairstack("voices --archetype narrator --raw")
) as VoiceListResult;

console.log(
  `      Found ${voices.pagination.total} voices. Using: ${VOICE_ID} (warm narrator)\n`
);

// Show a few options for context
if (voices.voices.length > 0) {
  console.log("      Top narrator voices:");
  for (const v of voices.voices.slice(0, 3)) {
    console.log(`        ${v.id.padEnd(24)} ${v.gender.padEnd(8)} ${v.description.slice(0, 50)}`);
  }
  console.log();
}

// Step 2: Generate narration
console.log("[2/4] Generating narration...");
console.log(`      Script: "${INTRO_SCRIPT.slice(0, 60)}..."`);

const voiceResult = JSON.parse(
  fairstack(
    `voice "${INTRO_SCRIPT.replace(/"/g, '\\"')}" --model ${VOICE_MODEL} --voice ${VOICE_ID} --raw`
  )
) as GenerationResult;

const narrationUrl = getUrl(voiceResult);
totalCost += getCost(voiceResult);
console.log(`      ${narrationUrl}\n`);

// Step 3: Generate background music
console.log("[3/4] Generating background music...");

const musicPrompt =
  "Ambient lo-fi background music for a tech podcast intro, warm and " +
  "inviting, soft piano with subtle electronic textures, builds gently, " +
  "15 seconds, instrumental only, no drums";

console.log(`      Style: ambient lo-fi, warm and inviting`);

const musicResult = JSON.parse(
  fairstack(
    `music "${musicPrompt.replace(/"/g, '\\"')}" --model ${MUSIC_MODEL} --duration 15 --instrumental --raw`
  )
) as GenerationResult;

const musicUrl = getUrl(musicResult);
totalCost += getCost(musicResult);
console.log(`      ${musicUrl}\n`);

// Step 4: Mix with ffmpeg
console.log("[4/4] Mixing with ffmpeg...");

const narrationPath = join(OUTPUT_DIR, "narration.mp3");
const musicPath = join(OUTPUT_DIR, "music.mp3");

// Download both files
console.log("      Downloading narration...");
downloadFile(narrationUrl, narrationPath);
console.log("      Downloading music...");
downloadFile(musicUrl, musicPath);

// Check if ffmpeg is available
try {
  execSync("which ffmpeg", { encoding: "utf-8" });
} catch {
  console.log("\n      ffmpeg not found. Skipping audio mix.");
  console.log("      Install ffmpeg to combine voice + music automatically.");
  console.log(`\n      Manual mix command:`);
  console.log(`      ffmpeg -i "${narrationPath}" -i "${musicPath}" \\`);
  console.log(`        -filter_complex "[1:a]volume=0.2[music];[0:a][music]amix=inputs=2:duration=first[out]" \\`);
  console.log(`        -map "[out]" "${OUTPUT_FILE}"`);
  console.log(`\nDone.`);
  console.log(`  Narration: ${narrationPath}`);
  console.log(`  Music:     ${musicPath}`);
  console.log(`  Total cost: ${formatCost(totalCost)}\n`);
  process.exit(0);
}

// Mix: voice at full volume, music at 20% volume, fade out music at end
const ffmpegCmd =
  `ffmpeg -y -i "${narrationPath}" -i "${musicPath}" ` +
  `-filter_complex "[1:a]volume=0.2,afade=t=out:st=12:d=3[music];` +
  `[0:a][music]amix=inputs=2:duration=first[out]" ` +
  `-map "[out]" "${OUTPUT_FILE}"`;

console.log("      Voice:  narration.mp3 (100% volume)");
console.log("      Music:  music.mp3 (20% volume, fade out)");
console.log(`      Output: ${OUTPUT_FILE}`);

try {
  execSync(ffmpegCmd, { encoding: "utf-8", stdio: "pipe" });
  console.log("      Mix complete.\n");
} catch (err) {
  console.log("      ffmpeg mix failed — files are still available separately.\n");
}

// Summary
console.log("Done.");
console.log(`  Output:     ${OUTPUT_FILE}`);
console.log(`  Narration:  ${narrationPath}`);
console.log(`  Music:      ${musicPath}`);
console.log(`  Total cost: ${formatCost(totalCost)}\n`);
