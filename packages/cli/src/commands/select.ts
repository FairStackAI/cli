import { Command } from "commander";
import { selectModel } from "../api.js";
import { handleError, printJson } from "../output.js";

export const selectCommand = new Command("select-model")
  .description("Get AI-powered model recommendation for your task")
  .argument("<task>", "Describe what you want to generate")
  .option(
    "-t, --modality <type>",
    "Modality hint: image, video, voice, music, talkingHead"
  )
  .option("--raw", "Output full JSON response")
  .action(async (task: string, opts) => {
    try {
      const res = await selectModel(task, opts.modality);
      if (res.error) {
        console.error(`Error: ${res.error.message}`);
        process.exit(1);
      }

      if (opts.raw) {
        printJson(res, true);
        return;
      }

      // Format the recommendation nicely
      const rec = (res as unknown as Record<string, unknown>).recommendation as Record<string, unknown> | undefined;
      if (rec) {
        console.log(`\nRecommended: ${rec.display_name} (${rec.model})`);
        console.log(`Cost:        $${rec.cost_per_unit} ${rec.unit}`);
        console.log(`Reasoning:   ${rec.reasoning}`);
      }

      const alts = (res as unknown as Record<string, unknown>).alternatives as Array<Record<string, unknown>> | undefined;
      if (alts?.length) {
        console.log(`\nAlternatives:`);
        for (const alt of alts) {
          console.log(`  ${alt.display_name} (${alt.model}) — $${alt.cost_per_unit}: ${alt.tradeoff}`);
        }
      }

      const cost = (res as unknown as Record<string, unknown>).cost as Record<string, unknown> | undefined;
      if (cost) {
        console.log(`\nQuery cost: $${cost.cost_usd}`);
      }
    } catch (err) {
      handleError(err);
    }
  });
