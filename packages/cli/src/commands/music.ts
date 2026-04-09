import { Command } from "commander";
import { generateMusic } from "../api.js";
import {
  handleError,
  isQuote,
  printGeneration,
  printQuote,
} from "../output.js";
import type { GenerationResponse, QuoteResponse } from "../api.js";

export const musicCommand = new Command("music")
  .description("Generate music from a text prompt")
  .argument("<prompt>", "Description of the music to generate")
  .option("-m, --model <model>", "Model ID (e.g. mureka-bgm, suno-generate)")
  .option("-d, --duration <seconds>", "Duration in seconds", parseInt)
  .option("--lyrics <text>", "Lyrics for vocal tracks")
  .option("--tags <tags>", "Style tags (comma-separated)")
  .option("--instrumental", "Generate instrumental only (no vocals)")
  .option("--estimate", "Show cost estimate without generating")
  .option("-w, --wait <seconds>", "Max seconds to wait (default: 180)", parseInt)
  .option("--raw", "Output full JSON response")
  .action(async (prompt: string, opts) => {
    try {
      const res = await generateMusic(prompt, {
        model: opts.model,
        duration: opts.duration,
        lyrics: opts.lyrics,
        tags: opts.tags,
        instrumental: opts.instrumental || undefined,
        confirm: !opts.estimate,
        wait: opts.wait || 180,
      });

      if (isQuote(res)) {
        printQuote(res as QuoteResponse, opts.raw);
      } else {
        printGeneration(res as GenerationResponse, opts.raw);
      }
    } catch (err) {
      handleError(err);
    }
  });
