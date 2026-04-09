/**
 * FairStack as an AI Agent Tool
 *
 * Three integration patterns for using FairStack in AI agent workflows:
 *   1. CLI tool pattern (simplest — works with any agent framework)
 *   2. Claude Code MCP tool definition
 *   3. OpenAI function calling schema
 *
 * Usage:
 *   npx tsx examples/agent-tool/agent-example.ts
 *
 * Dry run (no credits):
 *   FAIRSTACK_DRY_RUN=1 npx tsx examples/agent-tool/agent-example.ts
 */

import { execSync } from "node:child_process";

// ═══════════════════════════════════════════════════════════════════════
// PATTERN 1: CLI Tool — The simplest integration
// ═══════════════════════════════════════════════════════════════════════
//
// Call `fairstack` via shell, parse JSON output. Works with any agent
// framework that can execute shell commands.

interface FairStackResult {
  request_id: string;
  data: {
    id: string;
    type: string;
    status: string;
    model: string;
    output: { url: string; meta?: Record<string, unknown> } | null;
    cost: {
      credits_used: number;
      estimated_credits: number;
      currency: string;
    };
    created_at: string;
    completed_at: string | null;
  };
}

interface FairStackEstimate {
  data: {
    quote_id: string;
    estimated_cost: {
      cost: number;
      cost_micro: number;
      currency: string;
    };
    expires_in_sec: number;
  };
}

/**
 * Generate media using the FairStack CLI.
 *
 * This is the function your agent calls. It handles:
 * - Escaping prompts for shell execution
 * - Parsing JSON output
 * - Extracting the output URL and cost
 */
function fairstackGenerate(params: {
  modality: "image" | "video" | "voice" | "music";
  prompt: string;
  model?: string;
  extraFlags?: string;
}): FairStackResult {
  const { modality, prompt, model, extraFlags = "" } = params;
  const escaped = prompt.replace(/"/g, '\\"');
  const modelFlag = model ? `--model ${model}` : "";

  const command = `fairstack ${modality} "${escaped}" ${modelFlag} ${extraFlags} --raw`;

  const output = execSync(command, {
    encoding: "utf-8",
    timeout: 300_000,
  }).trim();

  return JSON.parse(output) as FairStackResult;
}

/**
 * Estimate cost without generating. Use this in agent loops to
 * prevent runaway spending.
 */
function fairstackEstimate(params: {
  modality: "image" | "video" | "voice" | "music";
  prompt: string;
  model?: string;
}): FairStackEstimate {
  const { modality, prompt, model } = params;
  const escaped = prompt.replace(/"/g, '\\"');
  const modelFlag = model ? `--model ${model}` : "";

  const command = `fairstack estimate ${modality} "${escaped}" ${modelFlag} --raw`;

  const output = execSync(command, {
    encoding: "utf-8",
    timeout: 30_000,
  }).trim();

  return JSON.parse(output) as FairStackEstimate;
}

/**
 * Get AI-powered model recommendation. Useful when the agent doesn't
 * know which model to pick.
 */
function fairstackSelectModel(task: string): string {
  const escaped = task.replace(/"/g, '\\"');
  const output = execSync(`fairstack select-model "${escaped}" --raw`, {
    encoding: "utf-8",
    timeout: 30_000,
  }).trim();

  const result = JSON.parse(output) as Record<string, unknown>;
  const rec = result.recommendation as { model: string } | undefined;
  return rec?.model ?? "flux-schnell";
}

// ═══════════════════════════════════════════════════════════════════════
// PATTERN 2: Claude Code MCP Tool Definition
// ═══════════════════════════════════════════════════════════════════════
//
// If you're building a Claude Code skill or MCP server, define FairStack
// as a tool with this schema. Claude Code agents can then call it
// directly during conversations.

const claudeCodeToolDefinition = {
  name: "fairstack_generate",
  description:
    "Generate AI media (image, video, voice, music) using FairStack. " +
    "Returns a URL to the generated content and the cost in credits. " +
    "Always estimate cost first for expensive operations (video, music). " +
    "Use FAIRSTACK_DRY_RUN=1 env var for testing without real API calls.",
  input_schema: {
    type: "object" as const,
    properties: {
      modality: {
        type: "string" as const,
        enum: ["image", "video", "voice", "music"],
        description: "Type of media to generate",
      },
      prompt: {
        type: "string" as const,
        description:
          "For image/video/music: descriptive generation prompt. " +
          "For voice: the text to speak.",
      },
      model: {
        type: "string" as const,
        description:
          "Model ID. Common models: flux-schnell (fast image), " +
          "seedream-4.5-t2i (quality image), vidu-q3-turbo (video), " +
          "chatterbox-turbo (voice), mureka-bgm (music). " +
          "Run 'fairstack models --modality X' for the full list.",
      },
      estimate_only: {
        type: "boolean" as const,
        description:
          "If true, return a cost estimate without generating. " +
          "Recommended before expensive operations.",
      },
    },
    required: ["modality", "prompt"],
  },
};

// ═══════════════════════════════════════════════════════════════════════
// PATTERN 3: OpenAI Function Calling Schema
// ═══════════════════════════════════════════════════════════════════════
//
// Compatible with OpenAI Assistants API, LangChain, CrewAI, and any
// framework that uses the OpenAI function calling format.

const openAIFunctionDefinition = {
  type: "function" as const,
  function: {
    name: "fairstack_generate",
    description:
      "Generate AI media (image, video, voice, music) using FairStack. " +
      "Returns a URL to the generated content.",
    parameters: {
      type: "object" as const,
      properties: {
        modality: {
          type: "string" as const,
          enum: ["image", "video", "voice", "music"],
          description: "Type of media to generate",
        },
        prompt: {
          type: "string" as const,
          description: "Generation prompt or text to speak",
        },
        model: {
          type: "string" as const,
          description:
            "Model ID (e.g. flux-schnell, vidu-q3-turbo, chatterbox-turbo, mureka-bgm)",
        },
      },
      required: ["modality", "prompt"],
    },
  },
};

/**
 * Handle an OpenAI function call. This is the function you'd wire up
 * as the handler when the agent invokes the tool.
 */
function handleFunctionCall(args: {
  modality: "image" | "video" | "voice" | "music";
  prompt: string;
  model?: string;
}): string {
  const result = fairstackGenerate(args);
  const url = result.data.output?.url ?? null;
  const cost = result.data.cost?.credits_used || result.data.cost?.estimated_credits || 0;
  const costUsd = cost / 1_000_000;

  return JSON.stringify({
    url,
    model: result.data.model,
    cost_usd: costUsd,
    status: result.data.status,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// DEMO — Run all three patterns
// ═══════════════════════════════════════════════════════════════════════

console.log("FairStack Agent Tool Demo\n");
console.log("=".repeat(60));

// --- Pattern 1: Direct CLI call ---
console.log("\n--- Pattern 1: CLI Tool ---\n");

console.log("Step 1: Estimate cost before generating");
const estimate = fairstackEstimate({
  modality: "image",
  prompt: "A modern SaaS dashboard showing analytics charts, dark theme, clean UI",
  model: "flux-schnell",
});
console.log(`  Estimated cost: $${estimate.data.estimated_cost.cost.toFixed(4)}`);
console.log(`  Quote expires in: ${estimate.data.expires_in_sec}s\n`);

console.log("Step 2: Generate the image");
const result = fairstackGenerate({
  modality: "image",
  prompt: "A modern SaaS dashboard showing analytics charts, dark theme, clean UI",
  model: "flux-schnell",
});
console.log(`  URL:    ${result.data.output?.url ?? "(pending)"}`);
console.log(`  Model:  ${result.data.model}`);
console.log(`  Status: ${result.data.status}`);
const costUsd =
  (result.data.cost?.credits_used || result.data.cost?.estimated_credits || 0) / 1_000_000;
console.log(`  Cost:   $${costUsd.toFixed(4)}\n`);

console.log("Step 3: AI model recommendation");
const recommended = fairstackSelectModel(
  "photorealistic product photography for e-commerce"
);
console.log(`  Recommended model: ${recommended}\n`);

// --- Pattern 2: Claude Code MCP ---
console.log("--- Pattern 2: Claude Code MCP Tool Definition ---\n");
console.log(JSON.stringify(claudeCodeToolDefinition, null, 2));
console.log();

// --- Pattern 3: OpenAI function calling ---
console.log("--- Pattern 3: OpenAI Function Calling Schema ---\n");
console.log(JSON.stringify(openAIFunctionDefinition, null, 2));
console.log();

// --- Simulated agent loop ---
console.log("--- Simulated Agent Workflow ---\n");
console.log("The agent receives: \"Create a hero image for our landing page\"\n");

console.log("  Agent thinks: I need to generate an image. Let me check the cost first.");
const agentEstimate = fairstackEstimate({
  modality: "image",
  prompt: "Hero image for a developer tools landing page, abstract geometric shapes in electric blue and purple, dark background, modern tech aesthetic",
  model: "seedream-4.5-t2i",
});
console.log(`  Agent: Cost estimate is $${agentEstimate.data.estimated_cost.cost.toFixed(4)}. Proceeding.\n`);

console.log("  Agent calls fairstack_generate:");
const agentResult = handleFunctionCall({
  modality: "image",
  prompt: "Hero image for a developer tools landing page, abstract geometric shapes in electric blue and purple, dark background, modern tech aesthetic",
  model: "seedream-4.5-t2i",
});
console.log(`  Result: ${agentResult}\n`);

const parsed = JSON.parse(agentResult) as { url: string; cost_usd: number };
console.log(`  Agent responds: "Here's your hero image: ${parsed.url}"`);
console.log(`  (Cost: $${parsed.cost_usd.toFixed(4)})\n`);
