import { readFileSync } from "node:fs";
import { Command } from "commander";
import { generateAtScale, getBatchStatus } from "../api.js";
import type { BatchGenerateResponse, BatchStatusResponse } from "../api.js";
import { handleError, printJson, formatCost } from "../output.js";

export const generateCommand = new Command("generate")
  .description("Generate at scale — batch generation with style and search grounding");

// ── generate image ──────────────────────────────────────────────────

generateCommand
  .command("image")
  .description("Generate images at scale from inline prompts or a file")
  .argument("[prompts...]", "Inline prompts (one or more)")
  .requiredOption("-m, --model <model>", "Model ID (e.g. flux-schnell)")
  .option("-s, --style <style>", "Style name/ID or raw style string")
  .option("--upgrade-model <model>", "Upgrade model for per-image upgrades later")
  .option("-f, --file <path>", "Path to a prompts file (one prompt per line)")
  .option("--search", "Enable search-grounded generation")
  .option("-w, --width <n>", "Image width", parseInt)
  .option("-h, --height <n>", "Image height", parseInt)
  .option("--raw", "Output full JSON response")
  .action(async (promptArgs: string[], opts) => {
    try {
      // Resolve prompts from inline args or file
      let prompts: string[] | undefined;
      let promptsUrl: string | undefined;

      if (opts.file) {
        // Read file locally and send inline
        const content = readFileSync(opts.file, "utf-8");
        prompts = content
          .split("\n")
          .map((l: string) => l.trim())
          .filter((l: string) => l.length > 0 && !l.startsWith("#"));

        if (prompts.length === 0) {
          console.error("Error: No valid prompts found in file.");
          process.exit(1);
        }
      } else if (promptArgs.length > 0) {
        prompts = promptArgs;
      } else {
        console.error("Error: Provide prompts as arguments or use --file <path>");
        process.exit(1);
      }

      const options: Record<string, unknown> = {};
      if (opts.width) options.width = opts.width;
      if (opts.height) options.height = opts.height;

      const res = await generateAtScale({
        modality: "image",
        prompts,
        prompts_url: promptsUrl,
        style: opts.style,
        model: opts.model,
        upgrade_model: opts.upgradeModel,
        search_prompt: opts.search || false,
        options: Object.keys(options).length > 0 ? options : undefined,
      });

      if (opts.raw) {
        printJson(res, true);
        return;
      }

      const d = res.data;
      console.log(`\nBatch ${d.batch_id} started.`);
      console.log(`${d.total_prompts} images | Style: ${d.style || "none"} | Model: ${d.model}`);
      if (d.upgrade_model) {
        console.log(`Upgrade model: ${d.upgrade_model}`);
      }
      console.log(`Estimated cost: $${d.estimated_cost.total_usd.toFixed(4)}`);
      console.log(`Review: ${d.review_url}`);
      console.log(`Run \`fairstack status ${d.batch_id}\` to check progress.\n`);
    } catch (err) {
      handleError(err);
    }
  });
