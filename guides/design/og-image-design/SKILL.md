---
name: og-image-design
description: "Generate Open Graph (OG) images for social media sharing via FairStack. Covers dimensions for Twitter, Facebook, LinkedIn, optimal compositions, text placement. Use for: OG images, social media preview images, link previews, meta images, share images. Triggers: og image, open graph, social preview, link preview, meta image, share image, twitter card, facebook share, linkedin preview"
---

# OG Image Design

Generate Open Graph images for social media link previews.

## Specs

| Platform | Dimensions | Aspect |
|----------|-----------|--------|
| Universal | 1200x630 | ~1.9:1 |
| Twitter large | 1200x628 | ~1.9:1 |
| LinkedIn | 1200x627 | ~1.9:1 |
| Facebook | 1200x630 | ~1.9:1 |

Use `landscape_16_9` aspect ratio (closest standard).

## Quick Generate

```bash
# Blog post OG image
fairstack image "Modern minimal illustration of AI neural network, clean geometric style, teal and navy gradient background, tech aesthetic, 1200x630 composition" \
  --model seedream-4.5-t2i --aspect-ratio landscape_16_9

# Product launch OG
fairstack image "Product hero shot of wireless headphones floating against dark gradient, dramatic lighting, premium feel, clean composition with space for text overlay" \
  --model gpt-image-1.5-t2i --aspect-ratio landscape_16_9
```

## Composition Rules

- Leave 30% of image as negative space for text overlay
- Key visual element on one side, empty space on the other
- High contrast colors (visible at small preview sizes)
- Avoid fine details (previews render at ~300px wide)

## Related Skills

- `fairstack/skills@ai-image-generation` — Full reference
