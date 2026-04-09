/**
 * Reel production commands.
 *
 * Subcommands:
 *   fairstack reel character create  --name <n> --product <p> --prompt "..."
 *   fairstack reel character list
 *   fairstack reel voice select      --name <n> --voice-id <id>
 *   fairstack reel voice list        [--library]
 *   fairstack reel create            --character <n> --voice <n> --script "..." --output <path>
 *
 * Uses the CLI's existing api.ts for all FairStack API calls.
 * Character and voice profiles are stored locally at ~/.fairstack/reel/.
 */

import { Command } from "commander";
import { createWriteStream, statSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import {
  generateImage,
  generateVoice,
  generateTalkingHead,
  generateMusic,
  listVoices,
} from "../../api.js";
import type { GenerationResponse } from "../../api.js";
import { formatCost, handleError } from "../../output.js";
import {
  characterExists,
  saveCharacter,
  listCharacters,
  loadCharacter,
  getCharacterImagePath,
  voiceExists,
  saveVoice,
  listSavedVoices,
  loadVoice,
  ensureTmpDir,
  tmpPath,
} from "./storage.js";
import {
  composite,
  generateSrt,
  writeSrtFile,
  cleanupSrtFile,
} from "./ffmpeg.js";
import type {
  CharacterProfile,
  VoiceProfile,
  AspectFormat,
  CostBreakdown,
} from "./types.js";

// ── Helpers ──

/**
 * Download a file from a URL to a local path using Node streams.
 */
async function downloadFile(url: string, destPath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Download failed: ${res.status} ${res.statusText}`);
  }
  if (!res.body) {
    throw new Error("Download failed: no response body");
  }
  const readable = Readable.fromWeb(res.body as import("node:stream/web").ReadableStream);
  const writable = createWriteStream(destPath);
  await pipeline(readable, writable);
}

/**
 * Extract the generation data from the CLI api response.
 * The CLI's generate* functions return GenerationResponse which wraps data.
 */
function getOutputUrl(res: GenerationResponse): string {
  const url = res.data.output?.url;
  if (!url) {
    throw new Error("Generation succeeded but no output URL returned");
  }
  return url;
}

function getCost(res: GenerationResponse): number {
  return res.data.cost?.credits_used || res.data.cost?.estimated_credits || 0;
}

function truncate(s: string, maxLen: number): string {
  return s.length <= maxLen ? s : s.slice(0, maxLen - 3) + "...";
}

// ── Character Commands ──

const characterCommand = new Command("character").description(
  "Manage character portraits for reels"
);

characterCommand
  .command("create")
  .description("Generate and save a character portrait")
  .requiredOption("--name <name>", "Character name")
  .requiredOption("--product <product>", "Product name (e.g., fairstack)")
  .requiredOption("--prompt <prompt>", "Portrait generation prompt")
  .option("-m, --model <model>", "Image model", "flux-kontext-max")
  .action(async (opts) => {
    try {
      const { name, product, prompt, model } = opts;

      if (characterExists(product, name)) {
        console.log(
          `Character "${name}" already exists for product "${product}".`
        );
        console.log(`Delete the profile file to recreate.`);
        return;
      }

      console.log(`[1/2] Generating character portrait (${model})...`);

      const res = (await generateImage(prompt, {
        model,
        aspect_ratio: "square",
        confirm: true,
        wait: 120,
      })) as GenerationResponse;

      const outputUrl = getOutputUrl(res);

      // Download the image locally
      const localImage = getCharacterImagePath(product, name);
      console.log(`[2/2] Downloading portrait...`);
      await downloadFile(outputUrl, localImage);

      const profile: CharacterProfile = {
        name,
        product,
        imageUrl: outputUrl,
        localImage,
        prompt,
        model,
        createdAt: new Date().toISOString(),
      };

      saveCharacter(profile);

      console.log(`      Character saved.`);
      console.log(`      Image: ${localImage}`);
      console.log(`      Cost: ${formatCost(getCost(res))}`);
    } catch (err) {
      handleError(err);
    }
  });

characterCommand
  .command("list")
  .description("List saved characters")
  .action(() => {
    try {
      const characters = listCharacters();

      if (characters.length === 0) {
        console.log("No characters found.");
        console.log(
          `  Create one: fairstack reel character create --name <name> --product <product> --prompt "..."`
        );
        return;
      }

      console.log(`Characters (${characters.length}):\n`);

      for (const c of characters) {
        console.log(`  ${c.product}/${c.name}`);
        console.log(`    Model:   ${c.model}`);
        console.log(`    Image:   ${c.localImage}`);
        console.log(`    Created: ${c.createdAt}`);
        console.log(`    Prompt:  ${truncate(c.prompt, 80)}`);
        console.log();
      }
    } catch (err) {
      handleError(err);
    }
  });

// ── Voice Commands ──

const reelVoiceCommand = new Command("voice").description(
  "Manage voice profiles for reels"
);

reelVoiceCommand
  .command("select")
  .description("Save a voice from the FairStack library")
  .requiredOption("--name <name>", "Local name for this voice")
  .requiredOption("--voice-id <id>", "Voice ID from the library")
  .option("-m, --model <model>", "TTS model", "qwen-3-tts")
  .action(async (opts) => {
    try {
      const { name, voiceId, model } = opts;

      if (voiceExists(name)) {
        console.log(`Voice "${name}" already exists. Delete the profile file to recreate.`);
        return;
      }

      const profile: VoiceProfile = {
        name,
        type: "library",
        model,
        voiceId,
        createdAt: new Date().toISOString(),
      };

      saveVoice(profile);
      console.log(`Voice saved.`);
      console.log(`  Model:    ${model}`);
      console.log(`  Voice ID: ${voiceId}`);
    } catch (err) {
      handleError(err);
    }
  });

reelVoiceCommand
  .command("list")
  .description("List saved voices or browse the FairStack voice library")
  .option("--library", "Browse the FairStack voice library instead")
  .action(async (opts) => {
    try {
      if (opts.library) {
        console.log("Fetching voices from FairStack library...\n");

        const result = await listVoices({ limit: 50 });
        const voices = result.voices;

        if (voices.length === 0) {
          console.log("No voices returned from the library.");
          return;
        }

        console.log(`Library voices (showing ${voices.length}):\n`);
        console.log(
          "  ID                          Gender    Language  Description"
        );
        console.log("  " + "-".repeat(80));

        for (const v of voices) {
          const id = v.id.padEnd(28);
          const gender = (v.gender || "-").padEnd(10);
          const lang = (v.language || "-").padEnd(10);
          const desc = truncate(v.description || v.name || "-", 40);
          console.log(`  ${id}${gender}${lang}${desc}`);
        }

        console.log(
          `\nTo use a voice: fairstack reel voice select --name <local-name> --voice-id <id>`
        );
      } else {
        const voices = listSavedVoices();

        if (voices.length === 0) {
          console.log("No saved voices.");
          console.log(
            `  Select one:  fairstack reel voice select --name <name> --voice-id <id>`
          );
          console.log(
            `  Browse lib:  fairstack reel voice list --library`
          );
          return;
        }

        console.log(`Saved voices (${voices.length}):\n`);

        for (const v of voices) {
          console.log(`  ${v.name} (${v.type})`);
          console.log(`    Model:   ${v.model}`);
          if (v.voiceId) console.log(`    Voice:   ${v.voiceId}`);
          if (v.referenceAudioUrl)
            console.log(`    Ref:     ${v.referenceAudioUrl}`);
          console.log(`    Created: ${v.createdAt}`);
          console.log();
        }
      }
    } catch (err) {
      handleError(err);
    }
  });

// ── Create Pipeline ──

function buildVoiceOpts(
  voice: VoiceProfile,
  script: string
): { text: string; opts: Record<string, unknown> } {
  if (voice.type === "cloned" && voice.referenceAudioUrl) {
    return {
      text: script,
      opts: {
        model: voice.model || "indextts2",
        ref_audio_url: voice.referenceAudioUrl,
        confirm: true,
        wait: 120,
      },
    };
  }

  return {
    text: script,
    opts: {
      model: voice.model || "qwen-3-tts",
      voice: voice.voiceId || "narrator_aria",
      confirm: true,
      wait: 120,
    },
  };
}

function formatDimensions(format: string): string {
  const map: Record<string, string> = {
    "9:16": "1080x1920",
    "16:9": "1920x1080",
    "1:1": "1080x1080",
  };
  return map[format] || format;
}

const createCommand = new Command("create")
  .description("Generate a complete reel (the main pipeline)")
  .requiredOption("--character <name>", "Character to use (must be created first)")
  .requiredOption("--voice <name>", "Voice to use (must be selected first)")
  .requiredOption("--script <text>", "Narration text")
  .requiredOption("--output <path>", "Output video path (e.g., ./reel.mp4)")
  .option(
    "--format <ratio>",
    "Aspect ratio: 9:16, 16:9, or 1:1",
    "9:16"
  )
  .option("--music <prompt>", "Generate background music with this prompt")
  .option("--captions", "Burn SRT captions into the video")
  .option(
    "--talking-head-model <model>",
    "Talking-head model",
    "musetalk-1.5"
  )
  .option("--dry-run", "Walk through the pipeline showing what would happen without calling APIs")
  .action(async (opts) => {
    try {
      const format = opts.format as AspectFormat;
      const validFormats: AspectFormat[] = ["9:16", "16:9", "1:1"];
      if (!validFormats.includes(format)) {
        console.error(
          `Invalid format: "${format}". Must be one of: ${validFormats.join(", ")}`
        );
        process.exit(1);
      }

      // ── Dry Run Mode ──
      if (opts.dryRun) {
        const hasMusic = !!opts.music;
        const totalSteps = hasMusic ? 5 : 4;
        let step = 1;

        console.log("\n=== FairStack Reel Pipeline (DRY RUN) ===\n");

        // Step 1: Load Assets
        console.log(`[${step}/${totalSteps}] Load assets`);
        console.log(`      Character: ${opts.character}`);
        console.log(`      Voice:     ${opts.voice}`);
        step++;

        // Step 2: Voice generation
        const scriptPreview = opts.script.length > 60
          ? opts.script.slice(0, 57) + "..."
          : opts.script;
        console.log(`[${step}/${totalSteps}] Generate narration`);
        console.log(`      Endpoint: POST /v1/voice/generate`);
        console.log(`      Script:   "${scriptPreview}"`);
        console.log(`      Words:    ${opts.script.split(/\s+/).filter(Boolean).length}`);
        step++;

        // Step 3: Talking head
        console.log(`[${step}/${totalSteps}] Generate talking head`);
        console.log(`      Endpoint: POST /v1/talking-head/generate`);
        console.log(`      Model:    ${opts.talkingHeadModel}`);
        step++;

        // Step 4: Music (optional)
        if (hasMusic) {
          console.log(`[${step}/${totalSteps}] Generate background music`);
          console.log(`      Endpoint: POST /v1/music/generate`);
          console.log(`      Prompt:   "${opts.music}"`);
          console.log(`      Model:    suno-generate`);
          step++;
        }

        // Final: Composite
        console.log(`[${step}/${totalSteps}] FFmpeg composite`);
        console.log(`      Format:   ${format} (${formatDimensions(format)})`);
        console.log(`      Captions: ${opts.captions ? "yes" : "no"}`);
        console.log(`      Output:   ${opts.output}`);

        console.log("\n  Pipeline steps: " + totalSteps);
        console.log("  API calls:     " + (hasMusic ? 3 : 2));
        console.log("  No credits charged (dry run)\n");
        return;
      }

      // ── Real Execution ──

      ensureTmpDir();
      const runId = Date.now();
      const costs: CostBreakdown = {
        voice: 0,
        talkingHead: 0,
        music: 0,
        total: 0,
      };
      const hasMusic = !!opts.music;
      const totalSteps = hasMusic ? 5 : 4;
      let step = 1;

      console.log("\n=== FairStack Reel Pipeline ===\n");

      // Step 1: Load Assets
      console.log(`[${step}/${totalSteps}] Loading assets...`);
      const character = loadCharacter(opts.character);
      console.log(
        `      Character: ${character.name} (${character.product})`
      );
      console.log(`      Image URL: ${character.imageUrl}`);
      const voice = loadVoice(opts.voice);
      console.log(
        `      Voice: ${voice.name} - ${voice.model} (${voice.type})`
      );
      if (voice.voiceId) console.log(`      Voice ID: ${voice.voiceId}`);
      step++;

      // Step 2: Generate Narration
      console.log(
        `[${step}/${totalSteps}] Generating narration (${voice.model})...`
      );
      const { text, opts: voiceOpts } = buildVoiceOpts(voice, opts.script);
      const voiceRes = (await generateVoice(
        text,
        voiceOpts
      )) as GenerationResponse;

      const narrationUrl = getOutputUrl(voiceRes);
      const narrationPath = tmpPath(`narration-${runId}.mp3`);
      await downloadFile(narrationUrl, narrationPath);
      costs.voice = getCost(voiceRes);
      console.log(`      Audio downloaded: ${narrationPath}`);
      console.log(`      Cost: ${formatCost(costs.voice)}`);
      step++;

      // Step 3: Generate Talking Head
      console.log(
        `[${step}/${totalSteps}] Generating talking head (${opts.talkingHeadModel})...`
      );
      const thRes = (await generateTalkingHead({
        model: opts.talkingHeadModel,
        image_url: character.imageUrl,
        audio_url: narrationUrl,
        confirm: true,
        wait: 300,
      })) as GenerationResponse;

      const talkingHeadUrl = getOutputUrl(thRes);
      const talkingHeadPath = tmpPath(`talking-head-${runId}.mp4`);
      await downloadFile(talkingHeadUrl, talkingHeadPath);
      costs.talkingHead = getCost(thRes);
      console.log(`      Video downloaded: ${talkingHeadPath}`);
      console.log(`      Cost: ${formatCost(costs.talkingHead)}`);
      step++;

      // Step 4 (optional): Generate Music
      let musicPath: string | undefined;

      if (hasMusic) {
        console.log(
          `[${step}/${totalSteps}] Generating background music...`
        );
        const musicRes = (await generateMusic(opts.music, {
          model: "suno-generate",
          duration: 60,
          confirm: true,
          wait: 180,
        })) as GenerationResponse;

        const musicUrl = getOutputUrl(musicRes);
        musicPath = tmpPath(`music-${runId}.mp3`);
        await downloadFile(musicUrl, musicPath);
        costs.music = getCost(musicRes);
        console.log(`      Music downloaded: ${musicPath}`);
        console.log(`      Cost: ${formatCost(costs.music)}`);
        step++;
      }

      // Final Step: Composite
      console.log(`[${step}/${totalSteps}] Compositing final reel...`);

      let captionsPath: string | undefined;
      if (opts.captions) {
        const srt = generateSrt(opts.script);
        captionsPath = writeSrtFile(srt);
        console.log(`      Captions: ${captionsPath}`);
      }

      await composite({
        talkingHeadVideo: talkingHeadPath,
        musicAudio: musicPath,
        format,
        captions: captionsPath,
        output: opts.output,
      });

      // Summary
      costs.total = costs.voice + costs.talkingHead + costs.music;

      const fileSizeMb = (
        statSync(opts.output).size /
        (1024 * 1024)
      ).toFixed(1);

      console.log(`\n      Output: ${opts.output}`);
      console.log(
        `      Format: ${format} (${formatDimensions(format)})`
      );
      console.log(`      Size: ${fileSizeMb}MB`);
      console.log(`\n  Total cost: ${formatCost(costs.total)}`);
      console.log(`    Voice:        ${formatCost(costs.voice)}`);
      console.log(`    Talking head: ${formatCost(costs.talkingHead)}`);
      if (hasMusic) {
        console.log(`    Music:        ${formatCost(costs.music)}`);
      }
      console.log();

      // Clean up temp SRT
      if (captionsPath) {
        cleanupSrtFile(captionsPath);
      }
    } catch (err) {
      handleError(err);
    }
  });

// ── Export ──

export const reelCommand = new Command("reel")
  .description("Produce marketing video reels using FairStack generation")
  .addCommand(characterCommand)
  .addCommand(reelVoiceCommand)
  .addCommand(createCommand);
