---
name: smart-router
description: "AI-powered model selection via FairStack. Describe what you want to create and get the best model recommendation with reasoning, alternatives, and cost comparison. Supports all modalities: image, video, voice, music, talking head. No auth required. Use for: model selection, choosing the right AI model, optimizing cost vs quality, finding the best model for a task. Triggers: which model, best model, recommend model, select model, model recommendation, smart router, ai model selection, choose model, what model should i use, model picker, model comparison"
---

![Smart Router](https://media.fairstack.ai/image/122efc51-35ed-4ac6-aeae-26960429c3cd/5ed3d4f4-ae7c-45b8-b571-442ce1eeb308.jpg)

# Smart Router — AI Model Selection

Describe what you want to create and let AI recommend the best model. Returns the recommended model, reasoning, alternatives, and cost comparison. No auth required.

## Quick Start (CLI)

```bash
fairstack select-model "I need a photorealistic product shot of a luxury watch" --modality image

fairstack select-model "Create a 10-second social media video of a sunset timelapse"

fairstack select-model "Convert this blog post to natural-sounding speech for a podcast"
```

## Quick Start (curl)

```bash
curl -s -X POST https://fairstack.ai/v1/select-model \
  -H "Content-Type: application/json" \
  -d '{
    "task": "I need a photorealistic product shot of a luxury watch on marble",
    "modality": "image"
  }'
```

## API Reference

**`POST /v1/select-model`** — No auth required

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `task` | string | Yes | Describe what you want to create |
| `modality` | string | No | Hint: `image`, `video`, `voice`, `music`, `talkingHead` |

## How It Works

The smart router analyzes your task description and recommends the best model based on:

1. **Task decomposition** — what capabilities are needed (photorealism, text rendering, animation, etc.)
2. **Model capabilities** — which models excel at the required capabilities
3. **Cost efficiency** — balance quality vs. price for the task
4. **Alternatives** — ranked alternatives with trade-off explanations

## When to Use Smart Router vs. Direct Selection

| Scenario | Use |
|----------|-----|
| You know what model you want | Direct: `fairstack image "..." --model flux-schnell` |
| You know the modality but not the model | Smart router: `fairstack select-model "task" --modality image` |
| You don't know what modality you need | Smart router: `fairstack select-model "task"` |
| You want to compare options | Compare: `fairstack compare image "..." --models a,b,c` |

## Tips

- **Be specific about your task.** "Product photo" is better than "make an image."
- **Mention constraints.** "Budget-friendly" or "highest quality" helps narrow recommendations.
- **No auth required.** Use this to explore models before signing up.
- **Browse models directly.** `fairstack models --modality image` shows all models and pricing.

## Related Skills

- `fairstack/skills@compare-models` — Generate with multiple models and compare results
- `fairstack/skills@cost-estimator` — Check exact cost for a specific model
- `fairstack/skills@ai-image-generation` — Generate images
- `fairstack/skills@ai-video-generation` — Generate videos
