---
name: landing-page-hero
description: "Generate landing page hero images and backgrounds with AI via FairStack. Covers composition for text overlay, responsive considerations, visual hierarchy. Triggers: landing page, hero image, website header, hero background, landing page design, above the fold, website hero"
---

# Landing Page Hero Images

Generate hero images optimized for landing pages.

## Quick Generate

```bash
# Abstract tech hero
fairstack image "Abstract flowing gradient background, blue to purple, subtle particle effects, modern tech aesthetic, wide composition with negative space for text on left" \
  --model seedream-4.5-t2i --aspect-ratio landscape_16_9

# Product hero
fairstack image "Product floating on clean gradient, dramatic lighting, depth of field, premium feel, space for text on right side" \
  --model gpt-image-1.5-t2i --aspect-ratio landscape_16_9
```

## Composition Rules

- **50% negative space** for headline + CTA overlay
- Key visual on one side, text space on the other
- Test at both desktop (16:9) and mobile (9:16) crops
- Avoid detail in areas that will be behind text

## Related Skills

- `fairstack/skills@ai-image-generation` — Full reference
