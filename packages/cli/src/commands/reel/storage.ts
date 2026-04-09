/**
 * Local file storage for character and voice profiles.
 *
 * Characters: ~/.fairstack/reel/characters/{product}-{name}.json
 * Voices:     ~/.fairstack/reel/voices/{name}.json
 *
 * Uses the ~/.fairstack/ directory (same root as the CLI config)
 * rather than ~/.forge/ to keep everything under the CLI namespace.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import type { CharacterProfile, VoiceProfile } from "./types.js";

const REEL_DIR = join(homedir(), ".fairstack", "reel");
const CHARACTERS_DIR = join(REEL_DIR, "characters");
const VOICES_DIR = join(REEL_DIR, "voices");

function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// ── Character Storage ──

function characterPath(product: string, name: string): string {
  return join(CHARACTERS_DIR, `${product}-${name}.json`);
}

export function characterExists(product: string, name: string): boolean {
  return existsSync(characterPath(product, name));
}

export function saveCharacter(profile: CharacterProfile): void {
  ensureDir(CHARACTERS_DIR);
  const filePath = characterPath(profile.product, profile.name);
  writeFileSync(filePath, JSON.stringify(profile, null, 2) + "\n");
}

export function listCharacters(): CharacterProfile[] {
  ensureDir(CHARACTERS_DIR);
  const files = readdirSync(CHARACTERS_DIR).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const raw = readFileSync(join(CHARACTERS_DIR, file), "utf-8");
    return JSON.parse(raw) as CharacterProfile;
  });
}

export function loadCharacter(name: string): CharacterProfile {
  ensureDir(CHARACTERS_DIR);
  const files = readdirSync(CHARACTERS_DIR).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    if (file.includes(`-${name}.json`)) {
      const raw = readFileSync(join(CHARACTERS_DIR, file), "utf-8");
      return JSON.parse(raw) as CharacterProfile;
    }
  }

  throw new Error(
    `Character "${name}" not found. Run "fairstack reel character list" to see available characters.`
  );
}

export function getCharacterImagePath(
  product: string,
  name: string
): string {
  return join(CHARACTERS_DIR, `${product}-${name}.png`);
}

// ── Voice Storage ──

function voicePath(name: string): string {
  return join(VOICES_DIR, `${name}.json`);
}

export function voiceExists(name: string): boolean {
  return existsSync(voicePath(name));
}

export function saveVoice(profile: VoiceProfile): void {
  ensureDir(VOICES_DIR);
  const filePath = voicePath(profile.name);
  writeFileSync(filePath, JSON.stringify(profile, null, 2) + "\n");
}

export function listSavedVoices(): VoiceProfile[] {
  ensureDir(VOICES_DIR);
  const files = readdirSync(VOICES_DIR).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const raw = readFileSync(join(VOICES_DIR, file), "utf-8");
    return JSON.parse(raw) as VoiceProfile;
  });
}

export function loadVoice(name: string): VoiceProfile {
  ensureDir(VOICES_DIR);
  const filePath = voicePath(name);

  if (!existsSync(filePath)) {
    throw new Error(
      `Voice "${name}" not found. Run "fairstack reel voice list" to see saved voices.`
    );
  }

  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as VoiceProfile;
}

// ── Temp Files ──

const TMP_DIR = join(REEL_DIR, ".tmp");

export function ensureTmpDir(): string {
  ensureDir(TMP_DIR);
  return TMP_DIR;
}

export function tmpPath(filename: string): string {
  return join(TMP_DIR, filename);
}
