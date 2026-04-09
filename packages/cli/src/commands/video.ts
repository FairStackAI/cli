import { Command } from "commander";
import { generateVideo } from "../api.js";
import {
  handleError,
  isQuote,
  printGeneration,
  printQuote,
} from "../output.js";
import type { GenerationResponse, QuoteResponse } from "../api.js";

export const videoCommand = new Command("video")
  .description("Generate a video from a text prompt")
  .argument("<prompt>", "Text description of the video to generate")
  .option("-m, --model <model>", "Model ID (e.g. vidu-q3-turbo-t2v, kling-3-0-std)")
  .option("-i, --image-url <url>", "Source image URL (for image-to-video models)")
  .option("-v, --video-url <url>", "Source video URL (for video-to-video models)")
  .option("-d, --duration <seconds>", "Duration in seconds", parseInt)
  .option("-a, --aspect-ratio <ratio>", "Aspect ratio (16:9, 9:16, 1:1)")
  .option("--estimate", "Show cost estimate without generating")
  .option("-w, --wait <seconds>", "Max seconds to wait (default: 300)", parseInt)
  .option("--raw", "Output full JSON response")
  .action(async (prompt: string, opts) => {
    try {
      const res = await generateVideo(prompt, {
        model: opts.model,
        image_url: opts.imageUrl,
        video_url: opts.videoUrl,
        duration: opts.duration,
        aspect_ratio: opts.aspectRatio,
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
