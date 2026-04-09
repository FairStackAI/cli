---
name: twitter-thread-creation
description: "Generate visuals for Twitter/X threads with AI via FairStack. Covers image specs, visual consistency across thread posts. Triggers: twitter thread, x thread, tweet image, twitter content, x post, tweet visual"
---

# Twitter Thread Creation

Generate consistent visuals for Twitter/X threads.

## Image Spec

| Format | Size |
|--------|------|
| Single image | 1200x675 (16:9) |
| Thread banner | 1200x675 |
| In-thread image | 1200x675 |

## Thread Visual Set

```bash
# Intro image
fairstack image "Eye-catching thread opener, bold '7 AI TRENDS' text, vibrant gradient, modern design" \
  --model ideogram-v3-t2i --aspect-ratio landscape_16_9

# Supporting visuals (one per key point)
fairstack image "Concept illustration: generative AI, modern abstract, blue palette" --model flux-schnell --aspect-ratio landscape_16_9
fairstack image "Concept illustration: cost efficiency, modern abstract, blue palette" --model flux-schnell --aspect-ratio landscape_16_9
fairstack image "Concept illustration: multi-modal AI, modern abstract, blue palette" --model flux-schnell --aspect-ratio landscape_16_9
```

## Cost Planning

```bash
fairstack image "test" --model flux-schnell --estimate
```

Multiply per-image cost by number of thread images.

## Related Skills

- `fairstack/skills@ai-image-generation` — Full reference
