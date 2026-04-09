---
name: product-hunt-launch
description: "Generate Product Hunt launch assets with AI via FairStack. Covers gallery images, logo, thumbnail, OG image. Triggers: product hunt, product hunt launch, ph launch, launch assets, product hunt gallery, product hunt thumbnail"
---

# Product Hunt Launch Assets

Generate all visual assets needed for a Product Hunt launch.

## Asset Checklist

### 1. Thumbnail (240x240)

```bash
fairstack image "App icon style, clean minimal logo mark, vibrant gradient, centered on white, square format" \
  --model ideogram-v3-t2i
```

### 2. Gallery Images (1270x760)

```bash
# Image 1: Hero shot
fairstack image "Product screenshot mockup on laptop, clean minimal desk, hero marketing shot, landscape" \
  --model gpt-image-1.5-t2i --aspect-ratio landscape_16_9

# Image 2: Feature showcase
fairstack image "Clean UI screenshot with annotation arrows, feature highlight, modern design" \
  --model ideogram-v3-t2i --aspect-ratio landscape_16_9

# Image 3: Before/After
fairstack image "Split before/after comparison, dramatic improvement, clean professional" \
  --model seedream-4.5-t2i --aspect-ratio landscape_16_9
```

### 3. OG Image (1200x630)

```bash
fairstack image "Product Hunt launch OG image, product name and tagline space, clean modern gradient, professional" \
  --model seedream-4.5-t2i --aspect-ratio landscape_16_9
```

### 4. Maker video (optional)

```bash
fairstack voice "Hi, I'm the maker. We built this because..." --model chatterbox-turbo
fairstack image "Portrait of founder, friendly, startup vibe" --model seedream-4.5-t2i
fairstack talking-head --model musetalk-1.5 --image-url [portrait] --audio-url [voice]
```

## Cost Planning

Use `--estimate` on each step before generating:

```bash
fairstack image "test" --model ideogram-v3-t2i --estimate
fairstack image "test" --model seedream-4.5-t2i --estimate
fairstack voice "test" --model chatterbox-turbo --estimate
```

## Related Skills

- `fairstack/skills@ai-image-generation` — Image generation
- `fairstack/skills@ai-talking-head` — Maker video
- `fairstack/skills@design/og-image-design` — OG image specs
