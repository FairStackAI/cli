import { Command } from "commander";
import {
  generateImage,
  generateVideo,
  generateVoice,
  generateMusic,
  generateTalkingHead,
} from "../api.js";
import { handleError, printQuote, isQuote } from "../output.js";
import type { QuoteResponse } from "../api.js";

export const estimateCommand = new Command("estimate")
  .description("Estimate cost before generating (no credits charged)")
  .argument("<modality>", "Modality: image, video, voice, music, talking-head")
  .argument("[prompt]", "Prompt or text (not needed for talking-head)")
  .option("-m, --model <model>", "Model ID")
  .option("--voice <id>", "Voice ID (for voice)")
  .option("--image-url <url>", "Image URL (for i2v or talking-head)")
  .option("--audio-url <url>", "Audio URL (for talking-head)")
  .option("--raw", "Output full JSON response")
  .action(async (modality: string, prompt: string | undefined, opts) => {
    try {
      let res;

      switch (modality) {
        case "image":
          if (!prompt) {
            console.error("Prompt required for image estimation");
            process.exit(1);
          }
          res = await generateImage(prompt, {
            model: opts.model,
            confirm: false,
          });
          break;
        case "video":
          if (!prompt) {
            console.error("Prompt required for video estimation");
            process.exit(1);
          }
          res = await generateVideo(prompt, {
            model: opts.model,
            image_url: opts.imageUrl,
            confirm: false,
          });
          break;
        case "voice":
          if (!prompt) {
            console.error("Text required for voice estimation");
            process.exit(1);
          }
          res = await generateVoice(prompt, {
            model: opts.model,
            voice: opts.voice,
            confirm: false,
          });
          break;
        case "music":
          if (!prompt) {
            console.error("Prompt required for music estimation");
            process.exit(1);
          }
          res = await generateMusic(prompt, {
            model: opts.model,
            confirm: false,
          });
          break;
        case "talking-head":
          res = await generateTalkingHead({
            model: opts.model,
            image_url: opts.imageUrl,
            audio_url: opts.audioUrl,
            confirm: false,
          });
          break;
        default:
          console.error(
            `Unknown modality: ${modality}. Use: image, video, voice, music, talking-head`
          );
          process.exit(1);
      }

      if (isQuote(res)) {
        printQuote(res as QuoteResponse, opts.raw);
      } else {
        console.log(JSON.stringify(res, null, 2));
      }
    } catch (err) {
      handleError(err);
    }
  });
