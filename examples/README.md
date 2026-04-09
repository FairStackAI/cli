# FairStack CLI Examples

Real-world examples showing how to use FairStack as a **workflow platform** — not just another API wrapper. Each example is a self-contained script that solves a real problem.

## Prerequisites

```bash
# Install the CLI globally
npm install -g fairstack

# Authenticate (creates ~/.fairstack/config.json)
fairstack login

# Or set your API key directly
export FAIRSTACK_API_KEY=fs_live_xxxxx
```

Get your API key at [fairstack.ai/app/api-keys](https://fairstack.ai/app/api-keys).

## Dry-Run Mode

Every example works with `FAIRSTACK_DRY_RUN=1` — no real API calls, no credits charged. This prints the exact request that *would* be sent and returns a mock response so the full script completes.

```bash
# Test any example without spending credits
FAIRSTACK_DRY_RUN=1 npx tsx examples/today-in-history/generate.ts
```

## Examples

| Example | Description | Language |
|---------|-------------|----------|
| [today-in-history](./today-in-history/) | Generate a "Today in History" image + voice narration for any date | TypeScript |
| [social-reel](./social-reel/) | Full video reel production pipeline — character, voice, talking head, music | Shell |
| [product-launch](./product-launch/) | Generate every creative asset for a product launch in one script | TypeScript |
| [podcast-producer](./podcast-producer/) | Produce a podcast intro with voice narration and background music | TypeScript |
| [model-showdown](./model-showdown/) | Compare image models head-to-head on the same prompt | Shell |
| [batch-generation](./batch-generation/) | Batch-generate images from a prompt list with cost tracking | TypeScript |
| [agent-tool](./agent-tool/) | Use FairStack as a tool for AI agents (Claude Code, OpenAI, etc.) | TypeScript |

## How These Examples Work

The TypeScript examples call the `fairstack` CLI via `child_process.execSync`. This is the recommended pattern for scripting — the CLI handles authentication, polling, retries, and cost tracking.

```typescript
import { execSync } from "node:child_process";

// Generate an image — the CLI polls until complete and returns the URL
const output = execSync(
  'fairstack image "A mountain cabin at sunrise" --model flux-schnell --raw',
  { encoding: "utf-8" }
);
const result = JSON.parse(output);
console.log(result.data.output.url);
```

The shell examples call `fairstack` directly. Same CLI, same behavior.

## Key Flags

| Flag | What it does |
|------|-------------|
| `--raw` | Output full JSON (useful for parsing in scripts) |
| `--estimate` | Show cost estimate without generating |
| `--model <id>` | Choose a specific model |
| `--wait <sec>` | Max seconds to wait for sync response |
| `FAIRSTACK_DRY_RUN=1` | Mock all API calls (for testing) |

## Links

- [FairStack CLI documentation](../packages/cli/README.md)
- [FairStack website](https://fairstack.ai)
- [API documentation](https://fairstack.ai/docs)
- [Pricing](https://fairstack.ai/pricing)
