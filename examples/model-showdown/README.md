# Model Showdown

Compare image generation models head-to-head on the same prompt. This helps you pick the right model for your use case by seeing quality, cost, and speed side by side.

## What It Does

1. Sends the same prompt to multiple models simultaneously
2. Waits for all results
3. Shows a comparison table with URLs, costs, and generation times
4. Helps you decide which model to use in production

## Usage

```bash
# Compare three image models
bash examples/model-showdown/compare.sh

# Test without credits
FAIRSTACK_DRY_RUN=1 bash examples/model-showdown/compare.sh

# Custom prompt and models
bash examples/model-showdown/compare.sh \
  --prompt "A cyberpunk cityscape at night" \
  --models "flux-schnell,seedream-4.5-t2i,gpt-image-1-mini"
```

## Output

```
Model Showdown
Prompt: "A photorealistic portrait of a ceramic coffee mug..."

Comparing 3 models: flux-schnell, seedream-4.5-t2i, gpt-image-1-mini

  Waiting for flux-schnell...
  Waiting for seedream-4.5-t2i...
  Waiting for gpt-image-1-mini...

============================================================
COMPARISON RESULTS
============================================================

--- flux-schnell ---
  URL:  https://media.fairstack.ai/image/...
  Cost: $0.003
  Time: 1.2s

--- seedream-4.5-t2i ---
  URL:  https://media.fairstack.ai/image/...
  Cost: $0.039
  Time: 8.4s

--- gpt-image-1-mini ---
  URL:  https://media.fairstack.ai/image/...
  Cost: $0.019
  Time: 5.1s
```

## When to Use Each Model

| Model | Best For | Cost | Speed |
|-------|----------|------|-------|
| `flux-schnell` | Drafts, iteration, speed-sensitive | Lowest | Fastest |
| `seedream-4.5-t2i` | Photorealism, hero images | Medium | Medium |
| `gpt-image-1-mini` | General purpose, text in images | Medium | Medium |
| `ideogram-v3` | Typography, logos, design work | Medium | Medium |
| `recraft-v4` | Illustrations, brand-consistent | Medium | Medium |

Run `fairstack models --modality image` for the full, live model catalog with current pricing.
