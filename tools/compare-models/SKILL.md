---
name: compare-models
description: "Compare AI models side-by-side via FairStack. Generate the same prompt across 2-4 models and see results, timing, and costs for each. Supports all modalities: image, video, voice, music. Use for: model evaluation, A/B testing, finding the best model, quality comparison, cost comparison. Triggers: compare models, model comparison, side by side, A/B test, which is better, compare ai models, model benchmark, model evaluation, test models, compare quality"
---

![Compare Models](https://media.fairstack.ai/image/122efc51-35ed-4ac6-aeae-26960429c3cd/dcbd0f3f-e929-4fa4-ae4e-e397194327dc.jpg)

# Compare Models

Generate the same prompt across 2-4 models and compare results, timing, and costs side-by-side. Works for all modalities.

## Quick Start (CLI)

```bash
# Compare image models
fairstack compare image "A cat wearing a top hat, studio photography" \
  --models flux-schnell,gpt-image-1-mini,ideogram-v3-t2i

# Compare voice models
fairstack compare voice "Welcome to our quarterly earnings call." \
  --models chatterbox-turbo,elevenlabs-turbo-2-5 --voice internal_marco

# Compare video models
fairstack compare video "Drone shot over a misty forest at sunrise" \
  --models vidu-q3-turbo-t2v,seedance-1-pro
```

## How It Works

1. The CLI submits the same prompt to all specified models in parallel
2. Polls each generation independently
3. Shows results side-by-side: output URL, cost, generation time

## Finding Models to Compare

```bash
# Browse available models by modality
fairstack models --modality image
fairstack models --modality video
fairstack models --modality voice
fairstack models --modality music
```

## Use Cases

- **Finding the best model for a use case.** Run the same prompt through 3-4 models and pick the winner.
- **Cost vs. quality evaluation.** See whether the premium model is meaningfully better than the budget one.
- **A/B testing for production.** Before committing to a model, validate on representative prompts.
- **Prompt engineering.** Same model, different prompts — compare which prompt works best.

## Tips

- **Max 4 models per comparison.** Keep it focused.
- **Use cheap models for prompt iteration.** Once the prompt is good, compare quality models.
- **Image comparisons are cheap.** Video comparisons add up fast — check pricing first with `fairstack models --modality video`.
- **Use `--raw` for machine-readable output** if feeding results into another tool.

## Related Skills

- `fairstack/skills@smart-router` — Get model recommendations before comparing
- `fairstack/skills@cost-estimator` — Estimate cost before comparing
- `fairstack/skills@ai-image-generation` — All image models
- `fairstack/skills@ai-video-generation` — All video models
