---
name: ai-content-pipeline
description: "Build AI content pipelines chaining image, video, voice, and music via FairStack. Complete workflow from concept to published content. Triggers: content pipeline, ai workflow, content creation, content automation, media pipeline, production pipeline, content factory"
---

# AI Content Pipeline

Build automated content creation pipelines combining multiple AI modalities.

## Pipeline Templates

### Blog Post to Video

```
Script -> Voice (TTS) -> Image (per section) -> Video (animate) -> Music (background)
```

```bash
# For each blog section:
fairstack voice "Section text..." --model chatterbox-turbo
fairstack image "Visual for this section..." --model seedream-4.5-t2i
fairstack video "Animate the visual" --model seedance-v1-5-pro-i2v --image-url [image]

# Add background music
fairstack music "Calm ambient, podcast style" --model mureka-bgm
```

### Product Launch Content Set

```bash
# Hero image
fairstack image "Product hero, dramatic lighting" --model imagen-4

# Social media variants
fairstack image "Product, square format, Instagram" --model seedream-4.5-t2i
fairstack image "Product, vertical, Stories" --model seedream-4.5-t2i --aspect-ratio portrait_16_9

# Video ad
fairstack video "Product animation" --model seedance-v1-5-pro-i2v --image-url [hero]

# Voiceover
fairstack voice "Introducing..." --model elevenlabs-turbo-2-5
```

## Cost Planning

Use `--estimate` on each step before generating:

```bash
fairstack voice "test" --model chatterbox-turbo --estimate
fairstack image "test" --model seedream-4.5-t2i --estimate
fairstack video "test" --model seedance-v1-5-pro-i2v --estimate
fairstack music "test" --model mureka-bgm --estimate
```

## Related Skills

- `fairstack/skills@workflow/multi-modal-workflow` — Detailed pipeline patterns
- `fairstack/skills@workflow/batch-generation` — Scale up
