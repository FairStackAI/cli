# Agent Tool

Use FairStack as a tool for AI agents. This is the key example — it shows how Claude Code, OpenAI function calling, LangChain, and other agent frameworks can call FairStack to generate images, video, voice, and music as part of their workflows.

## Why This Matters

AI agents need to generate media — product images, voiceovers, marketing videos — but they can't call 35 different APIs with 35 different authentication schemes. FairStack gives agents a single, consistent interface to all modalities.

## What's Inside

The `agent-example.ts` file shows three integration patterns:

1. **CLI tool pattern** — The simplest approach. The agent calls `fairstack` via shell, parses JSON output.
2. **Claude Code MCP tool** — A tool definition that Claude Code agents can use directly.
3. **OpenAI function calling** — Tool definitions compatible with the OpenAI Assistants API.

## Usage

```bash
# Run the demo (works in dry-run mode)
FAIRSTACK_DRY_RUN=1 npx tsx examples/agent-tool/agent-example.ts

# Run with real API calls
npx tsx examples/agent-tool/agent-example.ts
```

## Key Concepts

### Dry-Run Mode for Testing

Agents should use `FAIRSTACK_DRY_RUN=1` during development and testing. This returns mock responses with the exact same shape as real ones, so the agent's parsing logic works correctly.

### The `--raw` Flag

Always use `--raw` when calling FairStack from code. This outputs full JSON instead of human-readable text, making it easy to parse.

```bash
# Human-readable (default)
fairstack image "a sunset" --model flux-schnell
# Output: https://media.fairstack.ai/image/... (plus status, cost, etc.)

# Machine-readable (for agents)
fairstack image "a sunset" --model flux-schnell --raw
# Output: {"request_id":"...","data":{"id":"...","output":{"url":"..."},"cost":{...}}}
```

### Cost Awareness

Agents should estimate costs before generating, especially in autonomous loops. Use `--estimate` to get a cost quote without spending credits:

```bash
fairstack estimate image "a sunset" --model flux-schnell --raw
```

## Tool Schema

The core tool schema that any agent framework can use:

```json
{
  "name": "fairstack_generate",
  "description": "Generate AI media (image, video, voice, music) via FairStack",
  "parameters": {
    "type": "object",
    "properties": {
      "modality": {
        "type": "string",
        "enum": ["image", "video", "voice", "music"],
        "description": "Type of media to generate"
      },
      "prompt": {
        "type": "string",
        "description": "Generation prompt or text content"
      },
      "model": {
        "type": "string",
        "description": "Model ID (e.g. flux-schnell, vidu-q3-turbo). Optional — uses default if not specified."
      }
    },
    "required": ["modality", "prompt"]
  }
}
```
