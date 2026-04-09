---
name: app-store-screenshots
description: "Generate app store screenshots and mockups with AI via FairStack. Covers Apple App Store and Google Play dimensions, device frames, text overlay composition. Use for: app store screenshots, play store graphics, app marketing, ASO optimization. Triggers: app store screenshot, play store screenshot, app screenshot, app store optimization, aso, app marketing image, app store listing, google play graphic"
---

# App Store Screenshots

Generate app store screenshot backgrounds and marketing frames.

## Dimensions

| Platform | Portrait | Landscape |
|----------|----------|-----------|
| iPhone 6.7" | 1290x2796 | 2796x1290 |
| iPad 12.9" | 2048x2732 | 2732x2048 |
| Android phone | 1080x1920 | 1920x1080 |

Use `portrait_16_9` for phone screenshots.

## Quick Generate

```bash
# Clean gradient background for screenshot overlay
fairstack image "Clean modern gradient background, soft purple to blue, subtle geometric patterns, app screenshot background, vertical, minimal" \
  --model seedream-4.5-t2i --aspect-ratio portrait_16_9

# Lifestyle context shot
fairstack image "Person using smartphone in modern coffee shop, warm lighting, shallow depth of field, hand holding phone, casual lifestyle" \
  --model gpt-image-1.5-t2i --aspect-ratio portrait_16_9
```

## Screenshot Series (5 screens)

```bash
# Generate consistent backgrounds for a 5-screenshot series
for theme in "onboarding welcome" "feature dashboard" "social connections" "analytics insights" "settings personalization"; do
  fairstack image "App screenshot background, ${theme} concept, soft gradient, clean minimal, modern, vertical composition" \
    --model seedream-4.5-t2i --aspect-ratio portrait_16_9 &
done
wait
```

## Cost Planning

```bash
fairstack image "test" --model seedream-4.5-t2i --estimate
```

Multiply per-image cost by the number of screenshots.

## Related Skills

- `fairstack/skills@ai-image-generation` — Full reference
