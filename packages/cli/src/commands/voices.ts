import { Command } from "commander";
import { listVoices } from "../api.js";
import { handleError, printJson, printTable } from "../output.js";

export const voicesCommand = new Command("voices")
  .description("Browse the voice library (168 voices)")
  .option("-g, --gender <gender>", "Filter by gender: male, female")
  .option("-a, --archetype <type>", "Filter by archetype: narrator, conversational, character, ...")
  .option("-l, --language <code>", "Filter by language code: en, es, fr, ...")
  .option("-s, --search <term>", "Search voices by name")
  .option("--limit <n>", "Results per page (max 50)", parseInt)
  .option("--page <n>", "Page number", parseInt)
  .option("--raw", "Output full JSON response")
  .action(async (opts) => {
    try {
      const res = await listVoices({
        gender: opts.gender,
        archetype: opts.archetype,
        language: opts.language,
        search: opts.search,
        limit: opts.limit || 50,
        page: opts.page,
      });

      if (opts.raw) {
        printJson(res, true);
        return;
      }

      console.log(
        `Voices: ${res.pagination.total} total (showing page ${res.pagination.page}/${res.pagination.totalPages})\n`
      );

      const rows = res.voices.map((v) => [
        v.id,
        v.name,
        v.gender,
        v.archetype,
        v.accent,
        v.description.slice(0, 50),
      ]);

      printTable(
        ["ID", "Name", "Gender", "Archetype", "Accent", "Description"],
        rows,
        [25, 12, 8, 16, 16, 50]
      );
    } catch (err) {
      handleError(err);
    }
  });
