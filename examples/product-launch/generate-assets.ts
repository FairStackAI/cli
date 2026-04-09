/**
 * Product Launch Asset Generator
 *
 * Generates every creative asset for a product launch in one script:
 *   - Hero image (product shot)
 *   - Social media variations (square, portrait, landscape)
 *   - Voiceover for explainer video
 *   - Background music
 *   - Explainer video
 *
 * Usage:
 *   npx tsx examples/product-launch/generate-assets.ts
 *
 * Dry run (no credits):
 *   FAIRSTACK_DRY_RUN=1 npx tsx examples/product-launch/generate-assets.ts
 */

import { execSync } from "node:child_process";

// ── Product Configuration ─────────────────────────────────────────────

const PRODUCT = "FairStack CLI v2.0";
const TAGLINE = "35 AI models. One CLI. Fair prices.";
const DESCRIPTION =
  "FairStack gives developers access to image, video, voice, music, and " +
  "talking-head generation through a single command-line tool. No vendor " +
  "lock-in, no per-seat pricing — just transparent, usage-based costs.";

// ── Models ────────────────────────────────────────────────────────────

const IMAGE_MODEL = "seedream-4.5-t2i";
const VIDEO_MODEL = "vidu-q3-turbo";
const VOICE_MODEL = "chatterbox-turbo";
const MUSIC_MODEL = "mureka-bgm";
const VOICE_ID = "internal_marco";

// ── Helpers ───────────────────────────────────────────────────────────

interface GenerationResult {
  data: {
    output: { url: string } | null;
    cost: { credits_used: number; estimated_credits: number };
    status: string;
  };
}

interface QuoteResult {
  data: {
    estimated_cost: { cost: number; cost_micro: number };
  };
}

function fairstack(command: string): string {
  return execSync(`fairstack ${command}`, {
    encoding: "utf-8",
    timeout: 300_000,
  }).trim();
}

function estimate(modality: string, prompt: string, model: string): number {
  const escaped = prompt.replace(/"/g, '\\"');
  const result = JSON.parse(
    fairstack(`estimate ${modality} "${escaped}" --model ${model} --raw`)
  ) as QuoteResult;
  return result.data.estimated_cost.cost;
}

function generate(
  modality: string,
  prompt: string,
  model: string,
  extraFlags = ""
): GenerationResult {
  const escaped = prompt.replace(/"/g, '\\"');
  return JSON.parse(
    fairstack(
      `${modality} "${escaped}" --model ${model} ${extraFlags} --raw`
    )
  ) as GenerationResult;
}

function formatCost(microDollars: number): string {
  const dollars = microDollars / 1_000_000;
  if (dollars < 0.01) return `$${dollars.toFixed(4)}`;
  return `$${dollars.toFixed(3)}`;
}

function getUrl(result: GenerationResult): string {
  return result.data.output?.url ?? "(pending)";
}

function getCost(result: GenerationResult): number {
  return result.data.cost?.credits_used || result.data.cost?.estimated_credits || 0;
}

// ── Main ──────────────────────────────────────────────────────────────

console.log(`\nProduct Launch Asset Generator`);
console.log(`Product: ${PRODUCT}\n`);

// ── Prompts ───────────────────────────────────────────────────────────

const heroPrompt =
  `Clean, modern SaaS product hero image for "${PRODUCT}". ` +
  `Minimalist dark background with subtle gradient, floating terminal window ` +
  `showing CLI output, glowing accent colors in electric blue and violet, ` +
  `professional tech aesthetic, no text overlays, 8k quality.`;

const socialPromptBase =
  `Social media graphic for "${PRODUCT}" launch. Modern tech aesthetic, ` +
  `dark theme with electric blue accents, abstract geometric patterns ` +
  `representing AI and automation, clean and bold, no text.`;

const voiceoverScript =
  `Introducing ${PRODUCT}. ${DESCRIPTION} ` +
  `Ship faster. Spend less. Start free today at fairstack dot ai.`;

const musicPrompt =
  "Modern tech product launch music, inspiring and forward-looking, " +
  "light electronic beats with subtle synth pads, builds momentum, " +
  "30 seconds, instrumental only";

const videoPrompt =
  `Product launch explainer: smooth camera push into a glowing terminal ` +
  `screen showing command-line output, particles of light representing ` +
  `AI generation flowing across the screen, dark modern environment, ` +
  `cinematic lighting, tech startup aesthetic.`;

// Step 1: Estimate total cost
console.log("[1/6] Estimating costs...");

const heroEst = estimate("image", heroPrompt, IMAGE_MODEL);
const socialEst = estimate("image", socialPromptBase, IMAGE_MODEL);
const voiceEst = estimate("voice", voiceoverScript, VOICE_MODEL);
const musicEst = estimate("music", musicPrompt, MUSIC_MODEL);
const videoEst = estimate("video", videoPrompt, VIDEO_MODEL);
const totalEst = heroEst + socialEst * 3 + voiceEst + musicEst + videoEst;

console.log(`      Hero image:    ~$${heroEst.toFixed(4)}`);
console.log(`      Social (3x):   ~$${(socialEst * 3).toFixed(4)}`);
console.log(`      Voiceover:     ~$${voiceEst.toFixed(4)}`);
console.log(`      Music:         ~$${musicEst.toFixed(4)}`);
console.log(`      Video:         ~$${videoEst.toFixed(4)}`);
console.log(`      ${"─".repeat(30)}`);
console.log(`      Total estimate: ~$${totalEst.toFixed(4)}\n`);

let totalCost = 0;
const assets: Array<{ name: string; url: string }> = [];

// Step 2: Hero image
console.log("[2/6] Generating hero image...");
const heroResult = generate("image", heroPrompt, IMAGE_MODEL);
const heroUrl = getUrl(heroResult);
totalCost += getCost(heroResult);
assets.push({ name: "Hero image", url: heroUrl });
console.log(`      ${heroUrl}\n`);

// Step 3: Social variations
console.log("[3/6] Generating social variations...");

const socialVariations: Array<{ label: string; ratio: string }> = [
  { label: "Square (1:1)", ratio: "square" },
  { label: "Portrait (4:3)", ratio: "portrait_4_3" },
  { label: "Landscape (16:9)", ratio: "landscape_16_9" },
];

for (const variant of socialVariations) {
  const result = generate(
    "image",
    socialPromptBase,
    IMAGE_MODEL,
    `--aspect-ratio ${variant.ratio}`
  );
  const url = getUrl(result);
  totalCost += getCost(result);
  assets.push({ name: `Social ${variant.label}`, url });
  console.log(`      ${variant.label.padEnd(20)} ${url}`);
}
console.log();

// Step 4: Voiceover
console.log("[4/6] Generating voiceover...");
const voiceResult = generate(
  "voice",
  voiceoverScript,
  VOICE_MODEL,
  `--voice ${VOICE_ID}`
);
const voiceUrl = getUrl(voiceResult);
totalCost += getCost(voiceResult);
assets.push({ name: "Voiceover", url: voiceUrl });
console.log(`      ${voiceUrl}\n`);

// Step 5: Background music
console.log("[5/6] Generating background music...");
const musicResult = generate("music", musicPrompt, MUSIC_MODEL, "--duration 30");
const musicUrl = getUrl(musicResult);
totalCost += getCost(musicResult);
assets.push({ name: "Background music", url: musicUrl });
console.log(`      ${musicUrl}\n`);

// Step 6: Explainer video
console.log("[6/6] Generating explainer video...");
const videoResult = generate(
  "video",
  videoPrompt,
  VIDEO_MODEL,
  "--aspect-ratio 16:9"
);
const videoUrl = getUrl(videoResult);
totalCost += getCost(videoResult);
assets.push({ name: "Explainer video", url: videoUrl });
console.log(`      ${videoUrl}\n`);

// Summary
console.log("Launch Kit Complete.");
console.log(`  ${assets.length} assets generated`);
console.log(`  Total cost: ${formatCost(totalCost)}\n`);

console.log("Assets:");
for (const asset of assets) {
  console.log(`  ${asset.name.padEnd(22)} ${asset.url}`);
}
console.log();
