---
name: product-changelog
description: "Generate changelog and release note visuals with AI via FairStack. Covers feature announcement images, version release graphics. Triggers: changelog, release notes, feature announcement, version release, product update, what's new, release visual"
---

# Product Changelog Visuals

Generate images for changelog entries and release announcements.

## Feature Announcement

```bash
fairstack image "Modern clean feature announcement graphic, abstract representation of [feature], teal gradient, with space for text overlay, product update style" \
  --model seedream-4.5-t2i --aspect-ratio landscape_16_9
```

## Version Release Banner

```bash
fairstack image "Version release banner with text 'v2.0', bold modern typography, dark gradient with glowing teal accents, tech product style" \
  --model ideogram-v3-t2i --aspect-ratio landscape_16_9
```

## Consistent Series

```bash
# Monthly release images with consistent style
for version in "2.1" "2.2" "2.3"; do
  fairstack image "Product release v${version}, clean modern graphic, consistent teal and dark theme, tech product" \
    --model ideogram-v3-t2i --aspect-ratio landscape_16_9 &
done
wait
```

## Related Skills

- `fairstack/skills@ai-image-generation` — Full reference
