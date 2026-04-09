/**
 * Today in History — Generate a historical image + voice narration
 *
 * Usage:
 *   npx tsx examples/today-in-history/generate.ts
 *   npx tsx examples/today-in-history/generate.ts --date "July 20, 1969" --event "Apollo 11 lands on the Moon"
 *
 * Dry run (no credits):
 *   FAIRSTACK_DRY_RUN=1 npx tsx examples/today-in-history/generate.ts
 */

import { execSync } from "node:child_process";

// ── Configuration ─────────────────────────────────────────────────────

const IMAGE_MODEL = "seedream-4.5-t2i"; // Photorealistic historical scenes
const VOICE_MODEL = "chatterbox-turbo"; // Natural-sounding narration
const VOICE_ID = "internal_marco"; // Warm, authoritative narrator

// ── Parse Arguments ───────────────────────────────────────────────────

const args = process.argv.slice(2);
function getArg(name: string, fallback: string): string {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const date = getArg("date", "March 12, 1989");
const event = getArg(
  "event",
  "Tim Berners-Lee proposes the World Wide Web at CERN"
);

// ── Helpers ───────────────────────────────────────────────────────────

interface GenerationResult {
  data: {
    output: { url: string } | null;
    cost: { credits_used: number; estimated_credits: number };
    model: string;
    status: string;
  };
}

interface QuoteResult {
  data: {
    quote_id: string;
    estimated_cost: { cost: number; cost_micro: number };
  };
}

function fairstack(command: string): string {
  const env = { ...process.env };
  return execSync(`fairstack ${command}`, {
    encoding: "utf-8",
    env,
    timeout: 120_000,
  }).trim();
}

function formatCost(microDollars: number): string {
  const dollars = microDollars / 1_000_000;
  if (dollars < 0.01) return `$${dollars.toFixed(4)}`;
  return `$${dollars.toFixed(3)}`;
}

// ── Main ──────────────────────────────────────────────────────────────

console.log(`\nToday in History -- ${date}`);
console.log(`Event: ${event}\n`);

// Step 1: Estimate costs before generating
console.log("[1/3] Estimating costs...");

const imagePrompt = `Historical photograph, ${date}: ${event}. Cinematic lighting, documentary style, photorealistic, 8k detail. No text, no watermarks.`;
const narrationText = `On this day, ${date}, ${event}. This moment would go on to change the course of history, reshaping how we think about technology, communication, and the flow of information across the world.`;

const imageEstimate = JSON.parse(
  fairstack(
    `estimate image "${imagePrompt.replace(/"/g, '\\"')}" --model ${IMAGE_MODEL} --raw`
  )
) as QuoteResult;

const voiceEstimate = JSON.parse(
  fairstack(
    `estimate voice "${narrationText.replace(/"/g, '\\"')}" --model ${VOICE_MODEL} --raw`
  )
) as QuoteResult;

const imageCostEst = imageEstimate.data.estimated_cost.cost;
const voiceCostEst = voiceEstimate.data.estimated_cost.cost;

console.log(
  `      Image: ~$${imageCostEst.toFixed(4)}  (${IMAGE_MODEL})`
);
console.log(
  `      Voice: ~$${voiceCostEst.toFixed(4)}  (${VOICE_MODEL})`
);
console.log(
  `      Total: ~$${(imageCostEst + voiceCostEst).toFixed(4)}\n`
);

// Step 2: Generate the image
console.log("[2/3] Generating image...");

const imageResult = JSON.parse(
  fairstack(
    `image "${imagePrompt.replace(/"/g, '\\"')}" --model ${IMAGE_MODEL} --raw`
  )
) as GenerationResult;

const imageUrl = imageResult.data.output?.url ?? "(pending)";
console.log(`      ${imageUrl}\n`);

// Step 3: Generate the voice narration
console.log("[3/3] Generating narration...");

const voiceResult = JSON.parse(
  fairstack(
    `voice "${narrationText.replace(/"/g, '\\"')}" --model ${VOICE_MODEL} --voice ${VOICE_ID} --raw`
  )
) as GenerationResult;

const audioUrl = voiceResult.data.output?.url ?? "(pending)";
console.log(`      ${audioUrl}\n`);

// Summary
const totalCost =
  (imageResult.data.cost?.credits_used || imageResult.data.cost?.estimated_credits || 0) +
  (voiceResult.data.cost?.credits_used || voiceResult.data.cost?.estimated_credits || 0);

console.log("Done.");
console.log(`  Image URL:  ${imageUrl}`);
console.log(`  Audio URL:  ${audioUrl}`);
console.log(`  Total cost: ${formatCost(totalCost)}\n`);
