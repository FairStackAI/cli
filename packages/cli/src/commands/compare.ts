import { Command } from "commander";
import {
  generateImage,
  generateVideo,
  generateVoice,
  generateMusic,
  pollUntilDone,
} from "../api.js";
import { handleError, printGeneration, formatCost } from "../output.js";
import type { GenerationResponse } from "../api.js";

export const compareCommand = new Command("compare")
  .description("Compare models by generating the same prompt across multiple models")
  .argument(
    "<modality>",
    "Modality: image, video, voice, music"
  )
  .argument("<prompt>", "The prompt or text to generate")
  .requiredOption(
    "--models <models>",
    "Comma-separated model IDs (e.g. flux-schnell,seedream-4.5-t2i)"
  )
  .option("--voice <id>", "Voice ID (for voice comparison)")
  .option("--raw", "Output full JSON response")
  .action(async (modality: string, prompt: string, opts) => {
    try {
      const modelList = opts.models.split(",").map((m: string) => m.trim());
      if (modelList.length < 2) {
        console.error("Provide at least 2 models to compare");
        process.exit(1);
      }
      if (modelList.length > 4) {
        console.error("Maximum 4 models for comparison");
        process.exit(1);
      }

      console.log(
        `Comparing ${modelList.length} models for ${modality}: ${modelList.join(", ")}\n`
      );

      // Launch all generations in parallel
      const generateFn = {
        image: (model: string) =>
          generateImage(prompt, { model, confirm: true, wait: 0 }),
        video: (model: string) =>
          generateVideo(prompt, { model, confirm: true, wait: 0 }),
        voice: (model: string) =>
          generateVoice(prompt, {
            model,
            voice: opts.voice,
            confirm: true,
            wait: 0,
          }),
        music: (model: string) =>
          generateMusic(prompt, { model, confirm: true, wait: 0 }),
      }[modality];

      if (!generateFn) {
        console.error(
          `Unknown modality: ${modality}. Use: image, video, voice, music`
        );
        process.exit(1);
      }

      // Submit all
      const submissions = await Promise.allSettled(
        modelList.map((model: string) => generateFn(model))
      );

      // Poll all
      const results: Array<{
        model: string;
        result?: GenerationResponse;
        error?: string;
      }> = [];

      for (let i = 0; i < modelList.length; i++) {
        const sub = submissions[i];
        const model = modelList[i];

        if (sub.status === "rejected") {
          results.push({ model, error: sub.reason?.message || "Failed to submit" });
          continue;
        }

        const genRes = sub.value as GenerationResponse;
        if (genRes.data?.id) {
          try {
            console.log(`  Waiting for ${model}...`);
            const final = await pollUntilDone(genRes.data.id);
            results.push({ model, result: final });
          } catch (err) {
            results.push({
              model,
              error: err instanceof Error ? err.message : "Poll failed",
            });
          }
        } else {
          results.push({ model, error: "No generation ID returned" });
        }
      }

      // Print results
      console.log("\n" + "=".repeat(60));
      console.log("COMPARISON RESULTS");
      console.log("=".repeat(60));

      for (const r of results) {
        console.log(`\n--- ${r.model} ---`);
        if (r.error) {
          console.log(`  Error: ${r.error}`);
        } else if (r.result) {
          if (opts.raw) {
            printGeneration(r.result, true);
          } else {
            const d = r.result.data;
            if (d.output?.url) console.log(`  URL:  ${d.output.url}`);
            console.log(`  Cost: ${formatCost(d.cost?.credits_used || 0)}`);
            if (d.completed_at && d.created_at) {
              const ms =
                new Date(d.completed_at).getTime() -
                new Date(d.created_at).getTime();
              console.log(`  Time: ${(ms / 1000).toFixed(1)}s`);
            }
          }
        }
      }
    } catch (err) {
      handleError(err);
    }
  });
