---
name: batch-generation
description: "Generate AI content at scale with FairStack. Batch image generation, parallel video creation, bulk voice generation. Covers cost planning, parallelization, error handling for batch operations. Use for: generating multiple images, bulk content creation, automated asset generation, content at scale. Triggers: batch generation, bulk generation, generate multiple, batch images, mass generation, scale, parallel generation, batch processing, bulk create, generate at scale"
---

# Batch Generation

Generate AI content at scale. Process multiple prompts in parallel across any modality.

## CLI Batch Pattern

The FairStack CLI handles async polling automatically. Run multiple commands in parallel:

```bash
# Generate 5 product images in parallel
fairstack image "Red sneakers, studio lighting, white bg" --model flux-schnell &
fairstack image "Blue sneakers, studio lighting, white bg" --model flux-schnell &
fairstack image "Green sneakers, studio lighting, white bg" --model flux-schnell &
fairstack image "Black sneakers, studio lighting, white bg" --model flux-schnell &
fairstack image "White sneakers, studio lighting, white bg" --model flux-schnell &
wait
```

## Script Pattern (Bash)

```bash
#!/bin/bash
MODELS=("flux-schnell" "gpt-image-1-mini" "ideogram-v3-t2i")
PROMPTS=(
  "Product photo of headphones, white background"
  "Product photo of smartwatch, white background"
  "Product photo of keyboard, white background"
)

for prompt in "${PROMPTS[@]}"; do
  for model in "${MODELS[@]}"; do
    echo "Generating: $model - $prompt"
    fairstack image "$prompt" --model "$model" &
  done
done
wait
echo "All done"
```

## Cost Planning

Before running a batch, estimate the per-unit cost:

```bash
# Check cost for one generation
fairstack image "test" --model seedream-4.5-t2i --estimate

# Then multiply: 50 images x per-unit cost = total batch cost
```

Browse current pricing to pick the right model for your budget:

```bash
fairstack models --modality image
fairstack models --modality video
```

## Tips

- **Start small.** Generate 3-5 first to validate quality before scaling.
- **Use budget models for iteration.** Cheap models for testing, upgrade for finals.
- **Check your balance.** `fairstack balance` before large batches.
- **Rate limits exist.** Don't launch 100 parallel requests. 10-20 concurrent is safe.
- **Use idempotency keys** for safe retries on failures.

## Related Skills

- `fairstack/skills@cost-estimator` — Pre-flight cost estimation
- `fairstack/skills@compare-models` — Find the right model before batch
- `fairstack/skills@ai-image-generation` — Image generation
