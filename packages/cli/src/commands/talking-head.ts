import { Command } from "commander";
import { generateTalkingHead } from "../api.js";
import {
  handleError,
  isQuote,
  printGeneration,
  printQuote,
} from "../output.js";
import type { GenerationResponse, QuoteResponse } from "../api.js";

export const talkingHeadCommand = new Command("talking-head")
  .description("Generate a talking head video from an image and audio")
  .option("-m, --model <model>", "Model ID (e.g. musetalk-1.5, kling-avatar-std)")
  .option("-i, --image-url <url>", "Portrait image URL (required)")
  .option("-a, --audio-url <url>", "Audio URL (required)")
  .option("--estimate", "Show cost estimate without generating")
  .option("-w, --wait <seconds>", "Max seconds to wait (default: 300)", parseInt)
  .option("--raw", "Output full JSON response")
  .action(async (opts) => {
    try {
      if (!opts.imageUrl) {
        console.error("Error: --image-url is required");
        process.exit(1);
      }
      if (!opts.audioUrl) {
        console.error("Error: --audio-url is required");
        process.exit(1);
      }

      const res = await generateTalkingHead({
        model: opts.model,
        image_url: opts.imageUrl,
        audio_url: opts.audioUrl,
        confirm: !opts.estimate,
        wait: opts.wait || 300,
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
