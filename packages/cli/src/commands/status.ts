import { Command } from "commander";
import { getGeneration } from "../api.js";
import { handleError, printGeneration } from "../output.js";

export const statusCommand = new Command("status")
  .description("Check the status of a generation")
  .argument("<id>", "Generation ID")
  .option("--raw", "Output full JSON response")
  .action(async (id: string, opts) => {
    try {
      const res = await getGeneration(id);
      printGeneration(res, opts.raw);
    } catch (err) {
      handleError(err);
    }
  });
