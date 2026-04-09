import { Command } from "commander";
import { getGeneration, getBatchStatus } from "../api.js";
import { handleError, printGeneration, printJson, formatCost } from "../output.js";

export const statusCommand = new Command("status")
  .description("Check the status of a generation or batch")
  .argument("<id>", "Generation ID or batch ID (gen_batch_...)")
  .option("--raw", "Output full JSON response")
  .action(async (id: string, opts) => {
    try {
      // Detect batch IDs
      if (id.startsWith("gen_batch_")) {
        const res = await getBatchStatus(id);

        if (opts.raw) {
          printJson(res, true);
          return;
        }

        const d = res.data;
        const total = d.total_prompts;
        const done = d.progress.completed;
        const failed = d.progress.failed;

        console.log(`\nBatch: ${d.batch_id}`);
        console.log(`Status: ${d.status} (${done}/${total} done, ${failed} failed)`);
        console.log(`Model: ${d.model}${d.upgrade_model ? ` (upgrade: ${d.upgrade_model})` : ""}`);
        if (d.style) console.log(`Style: ${d.style}`);
        console.log(`Cost: $${d.cost.incurred_usd.toFixed(4)} / $${d.cost.estimated_total_usd.toFixed(4)} estimated`);
        console.log();
        return;
      }

      // Regular generation ID
      const res = await getGeneration(id);
      printGeneration(res, opts.raw);
    } catch (err) {
      handleError(err);
    }
  });
