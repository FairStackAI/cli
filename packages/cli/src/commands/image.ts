import { Command } from "commander";
import { generateImage } from "../api.js";
import {
  handleError,
  isQuote,
  printGeneration,
  printQuote,
} from "../output.js";
import type { GenerationResponse, QuoteResponse } from "../api.js";

export const imageCommand = new Command("image")
  .description("Generate an image from a text prompt")
  .argument("<prompt>", "Text description of the image to generate")
  .option("-m, --model <model>", "Model ID (e.g. flux-schnell, seedream-4.5-t2i)")
  .option(
    "-a, --aspect-ratio <ratio>",
    "Aspect ratio (square, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9)"
  )
  .option("-i, --image-url <url>", "Reference image URL (for editing models)")
  .option("-n, --negative-prompt <text>", "What to avoid in the image")
  .option("-s, --seed <number>", "Seed for reproducible results", parseInt)
  .option("--estimate", "Show cost estimate without generating")
  .option("-w, --wait <seconds>", "Max seconds to wait for sync response", parseInt)
  .option("--raw", "Output full JSON response")
  .action(async (prompt: string, opts) => {
    try {
      const res = await generateImage(prompt, {
        model: opts.model,
        aspect_ratio: opts.aspectRatio,
        image_url: opts.imageUrl,
        negative_prompt: opts.negativePrompt,
        seed: opts.seed,
        confirm: !opts.estimate,
        wait: opts.wait || 60,
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
