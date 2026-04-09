---
name: email-design
description: "Generate email header images and marketing email visuals with AI via FairStack. Covers email dimensions, file size limits, dark mode considerations. Triggers: email design, email header, newsletter image, email banner, marketing email, email visual, email template image"
---

# Email Design

Generate header images for marketing emails and newsletters.

## Specs

| Element | Recommended |
|---------|-------------|
| Header image | 600x200px (landscape_4_3 closest) |
| Full-width image | 600x400px |
| Max file size | 1MB (optimize after) |

## Quick Generate

```bash
# Newsletter header
fairstack image "Clean modern email header banner, abstract gradient teal to blue, professional, minimal, wide format, corporate style" \
  --model flux-schnell --aspect-ratio landscape_16_9

# Product announcement
fairstack image "Product showcase, centered item on gradient background, clean minimal, email marketing style, high contrast" \
  --model gpt-image-1.5-t2i --aspect-ratio landscape_4_3
```

## Dark Mode

- Use images with built-in contrast (not relying on white background)
- Add subtle border/shadow so images don't disappear on dark backgrounds
- Test: does it look good on both white AND dark backgrounds?

## Related Skills

- `fairstack/skills@ai-image-generation` — Full reference
