import { Command } from "commander";
import {
  listStyles,
  getStyle,
  createStyle,
  deleteStyle,
} from "../api.js";
import type { StyleItem } from "../api.js";
import { handleError, printTable, printJson } from "../output.js";

export const styleCommand = new Command("style")
  .description("Manage style presets and custom styles");

// ── style list ──────────────────────────────────────────────────────

styleCommand
  .command("list")
  .description("List all styles (platform presets + your custom styles)")
  .option("--raw", "Output full JSON response")
  .action(async (opts) => {
    try {
      const res = await listStyles();

      if (opts.raw) {
        printJson(res, true);
        return;
      }

      const headers = ["Name", "Type", "Category", "Prefix (truncated)"];
      const rows = res.data.styles.map((s: StyleItem) => [
        s.name,
        s.type,
        s.category || "-",
        (s.prompt_prefix || "").slice(0, 50) + ((s.prompt_prefix || "").length > 50 ? "..." : ""),
      ]);

      console.log(`\n${res.data.preset_count} presets + ${res.data.custom_count} custom styles\n`);
      printTable(headers, rows);
    } catch (err) {
      handleError(err);
    }
  });

// ── style get ───────────────────────────────────────────────────────

styleCommand
  .command("get <name>")
  .description("Get a style by name or ID")
  .option("--raw", "Output full JSON response")
  .action(async (name: string, opts) => {
    try {
      const res = await getStyle(name);

      if (opts.raw) {
        printJson(res, true);
        return;
      }

      const s = res.data;
      console.log(`\nName:            ${s.name}`);
      console.log(`Type:            ${s.type}`);
      if (s.category) console.log(`Category:        ${s.category}`);
      if (s.prompt_prefix) console.log(`Prefix:          ${s.prompt_prefix}`);
      if (s.prompt_suffix) console.log(`Suffix:          ${s.prompt_suffix}`);
      if (s.negative_prompt) console.log(`Negative:        ${s.negative_prompt}`);
      if (s.recommended_models?.length) {
        console.log(`Models:          ${s.recommended_models.join(", ")}`);
      }
      if (s.id) console.log(`ID:              ${s.id}`);
      console.log();
    } catch (err) {
      handleError(err);
    }
  });

// ── style save ──────────────────────────────────────────────────────

styleCommand
  .command("save <name>")
  .description("Save a custom style")
  .requiredOption("--prefix <text>", "Prompt prefix (prepended to user prompt)")
  .option("--suffix <text>", "Prompt suffix (appended to user prompt)")
  .option("--negative <text>", "Negative prompt (what to avoid)")
  .option("--models <models>", "Recommended model IDs (comma-separated)")
  .option("--raw", "Output full JSON response")
  .action(async (name: string, opts) => {
    try {
      const res = await createStyle({
        name,
        prompt_prefix: opts.prefix,
        prompt_suffix: opts.suffix,
        negative_prompt: opts.negative,
        recommended_models: opts.models ? opts.models.split(",").map((m: string) => m.trim()) : undefined,
      });

      if (opts.raw) {
        printJson(res, true);
        return;
      }

      console.log(`\nStyle "${res.data.name}" saved (${res.data.id})`);
      console.log(`Use it with: --style ${name}\n`);
    } catch (err) {
      handleError(err);
    }
  });

// ── style delete ────────────────────────────────────────────────────

styleCommand
  .command("delete <name>")
  .description("Delete a custom style")
  .option("--raw", "Output full JSON response")
  .action(async (name: string, opts) => {
    try {
      // First resolve the name to an ID
      const styleRes = await getStyle(name);
      const styleId = styleRes.data.id;

      if (styleRes.data.type === "preset") {
        console.error("Error: Platform presets cannot be deleted.");
        process.exit(1);
      }

      const res = await deleteStyle(styleId);

      if (opts.raw) {
        printJson(res, true);
        return;
      }

      console.log(`\nStyle "${res.data.name}" deleted.\n`);
    } catch (err) {
      handleError(err);
    }
  });
