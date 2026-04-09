/**
 * Batch Image Generator
 *
 * Reads prompts from a text file and generates images for each one,
 * tracking costs and progress throughout.
 *
 * Usage:
 *   npx tsx examples/batch-generation/batch.ts
 *   npx tsx examples/batch-generation/batch.ts --file my-prompts.txt --model ideogram-v3
 *
 * Dry run (no credits):
 *   FAIRSTACK_DRY_RUN=1 npx tsx examples/batch-generation/batch.ts
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

// ── Parse Arguments ───────────────────────────────────────────────────

const args = process.argv.slice(2);
function getArg(name: string, fallback: string): string {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const DEFAULT_PROMPTS_FILE = join(dirname(new URL(import.meta.url).pathname), "prompts.txt");
const promptsFile = getArg("file", DEFAULT_PROMPTS_FILE);
const model = getArg("model", "flux-schnell");
const outputFile = getArg("output", "batch-results.json");

// ── Helpers ───────────────────────────────────────────────────────────

interface GenerationResult {
  data: {
    output: { url: string } | null;
    cost: { credits_used: number; estimated_credits: number };
    status: string;
    model: string;
    created_at: string;
    completed_at: string | null;
  };
}

interface QuoteResult {
  data: {
    estimated_cost: { cost: number; cost_micro: number };
  };
}

interface BatchResult {
  prompt: string;
  url: string | null;
  cost: number;
  timeMs: number;
  status: "success" | "error";
  error?: string;
}

function fairstack(command: string): string {
  return execSync(`fairstack ${command}`, {
    encoding: "utf-8",
    timeout: 120_000,
  }).trim();
}

function formatCost(microDollars: number): string {
  const dollars = microDollars / 1_000_000;
  if (dollars < 0.01) return `$${dollars.toFixed(4)}`;
  return `$${dollars.toFixed(3)}`;
}

function truncate(s: string, len: number): string {
  return s.length <= len ? s : s.slice(0, len - 3) + "...";
}

// ── Load Prompts ──────────────────────────────────────────────────────

if (!existsSync(promptsFile)) {
  // Create a default prompts file if it doesn't exist
  const defaultPrompts = [
    "# Product photography batch — one prompt per line",
    "# Lines starting with # are ignored",
    "",
    "A minimalist wireless charger on a marble surface, studio lighting, clean white background, product photography",
    "A premium leather laptop bag on a reclaimed wood desk, warm afternoon light filtering through blinds, lifestyle shot",
    "Matte black noise-cancelling headphones resting on a white marble slab, soft directional shadows, minimal aesthetic",
    "A hand-thrown ceramic plant pot with a trailing pothos, bright indirect light, cozy home office setting",
    "A brushed stainless steel water bottle on a gym bench, morning light, active lifestyle product shot",
  ].join("\n");

  writeFileSync(promptsFile, defaultPrompts + "\n");
  console.log(`Created default prompts file: ${promptsFile}\n`);
}

const rawLines = readFileSync(promptsFile, "utf-8").split("\n");
const prompts = rawLines
  .map((line) => line.trim())
  .filter((line) => line.length > 0 && !line.startsWith("#"));

if (prompts.length === 0) {
  console.error("No prompts found in file. Add one prompt per line.");
  process.exit(1);
}

// ── Main ──────────────────────────────────────────────────────────────

console.log(`\nBatch Image Generator`);
console.log(`Prompts: ${prompts.length} from ${promptsFile}`);
console.log(`Model:   ${model}\n`);

// Step 1: Estimate total cost
console.log("[1/3] Estimating total cost...");

const escaped = prompts[0].replace(/"/g, '\\"');
const singleEstimate = JSON.parse(
  fairstack(`estimate image "${escaped}" --model ${model} --raw`)
) as QuoteResult;
const perItemCost = singleEstimate.data.estimated_cost.cost;
const totalEstimate = perItemCost * prompts.length;

console.log(
  `      ${prompts.length} images x ~$${perItemCost.toFixed(4)} each`
);
console.log(`      Total estimate: ~$${totalEstimate.toFixed(4)}\n`);

// Step 2: Generate all images
console.log(`[2/3] Generating (${prompts.length} images)...`);

const results: BatchResult[] = [];
let totalCost = 0;
let totalTimeMs = 0;
let successCount = 0;

for (let i = 0; i < prompts.length; i++) {
  const prompt = prompts[i];
  const label = `[${i + 1}/${prompts.length}]`;
  const preview = truncate(prompt, 35);

  const start = Date.now();

  try {
    const escapedPrompt = prompt.replace(/"/g, '\\"');
    const result = JSON.parse(
      fairstack(`image "${escapedPrompt}" --model ${model} --raw`)
    ) as GenerationResult;

    const elapsed = Date.now() - start;
    const url = result.data.output?.url ?? null;
    const cost =
      result.data.cost?.credits_used ||
      result.data.cost?.estimated_credits ||
      0;

    totalCost += cost;
    totalTimeMs += elapsed;
    successCount++;

    results.push({
      prompt,
      url,
      cost,
      timeMs: elapsed,
      status: "success",
    });

    console.log(
      `      ${label} ${preview.padEnd(38)} ${formatCost(cost).padEnd(8)} ${(elapsed / 1000).toFixed(1)}s`
    );
  } catch (err) {
    const elapsed = Date.now() - start;
    const errorMsg = err instanceof Error ? err.message : "Unknown error";

    results.push({
      prompt,
      url: null,
      cost: 0,
      timeMs: elapsed,
      status: "error",
      error: errorMsg,
    });

    console.log(
      `      ${label} ${preview.padEnd(38)} ERROR: ${errorMsg.slice(0, 30)}`
    );
  }
}

// Step 3: Save results
console.log(`\n[3/3] Results saved to ${outputFile}`);

const output = {
  model,
  prompts_file: promptsFile,
  generated_at: new Date().toISOString(),
  summary: {
    total: prompts.length,
    succeeded: successCount,
    failed: prompts.length - successCount,
    total_cost_micro: totalCost,
    total_cost_usd: totalCost / 1_000_000,
    avg_time_ms: Math.round(totalTimeMs / prompts.length),
  },
  results,
};

writeFileSync(outputFile, JSON.stringify(output, null, 2) + "\n");

// Summary
const avgTime = totalTimeMs / prompts.length / 1000;
const successRate = Math.round((successCount / prompts.length) * 100);

console.log(`\nSummary:`);
console.log(`  Generated:  ${successCount}/${prompts.length} (${successRate}%)`);
console.log(`  Total cost: ${formatCost(totalCost)}`);
console.log(`  Avg time:   ${avgTime.toFixed(1)}s per image\n`);
