---
name: press-release-writing
description: "Generate press release images with AI via FairStack. Covers product shots, executive portraits, event visuals. Triggers: press release, pr image, press release visual, media kit, press photo, announcement image"
---

# Press Release Visuals

Generate images for press releases and media kits.

## Product Announcement

```bash
fairstack image "Professional product shot, clean white background, commercial photography, high detail, press release quality" \
  --model imagen-4
```

## Executive Portrait

```bash
fairstack image "Professional executive headshot, confident expression, corporate studio lighting, clean background, press-ready" \
  --model seedream-4.5-t2i --aspect-ratio portrait_4_3
```

## Event Visual

```bash
fairstack image "Modern tech conference stage, dramatic lighting, professional event photography style" \
  --model seedream-4.5-t2i --aspect-ratio landscape_16_9
```

## Related Skills

- `fairstack/skills@ai-image-generation` — Full reference
- `fairstack/skills@photo/ai-product-photography` — Product photography guide
