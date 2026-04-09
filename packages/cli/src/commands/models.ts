import { Command } from "commander";
import { listModels, getModelDetail } from "../api.js";
import { handleError, printJson, printTable } from "../output.js";

export const modelsCommand = new Command("models")
  .description("List available AI models")
  .option(
    "-t, --modality <type>",
    "Filter by modality: image, video, voice, talkingHead, music"
  )
  .option("--detail <id>", "Get detailed info for a specific model")
  .option("--raw", "Output full JSON response")
  .action(async (opts) => {
    try {
      if (opts.detail) {
        const res = await getModelDetail(opts.detail);
        printJson(res.data, opts.raw);
        return;
      }

      const res = await listModels();
      const data = res.data;

      const modalities: string[] = opts.modality
        ? [opts.modality]
        : ["image", "video", "voice", "talkingHead", "music"];

      for (const mod of modalities) {
        const models =
          (data as Record<string, unknown>)[mod] as Array<{
            id: string;
            name: string;
            type: string;
            price: number;
          }>;
        if (!models || !Array.isArray(models) || models.length === 0) continue;

        if (opts.raw) {
          printJson(models, true);
          continue;
        }

        console.log(
          `\n${mod.toUpperCase()} (${models.length} models)`
        );
        console.log("─".repeat(70));

        const rows = models.map((m) => [
          m.id,
          m.name,
          m.type,
          `$${m.price.toFixed(4)}`,
        ]);
        printTable(["ID", "Name", "Type", "Price"], rows);
      }
    } catch (err) {
      handleError(err);
    }
  });
