---
name: competitor-teardown
description: "Generate visuals for competitor analysis and product teardowns with AI via FairStack. Covers comparison layouts, feature matrices, positioning maps. Triggers: competitor teardown, competitor analysis, competitive analysis, product comparison, feature comparison, competitive landscape"
---

# Competitor Teardown Visuals

Generate visuals for competitive analysis presentations and documents.

## Comparison Layout

```bash
fairstack image "Clean comparison layout, Product A versus Product B, split screen design, professional blue palette, corporate style" \
  --model ideogram-v3-t2i --aspect-ratio landscape_16_9
```

## Positioning Map Background

```bash
fairstack image "Clean 2x2 matrix background, quadrant chart, minimal grid lines, professional white background, subtle labels, strategic positioning map" \
  --model gpt-image-1.5-t2i --aspect-ratio landscape_4_3
```

## Feature Matrix Header

```bash
fairstack image "Modern comparison table header, checklist/feature matrix style, green checkmarks vs red x marks, clean design" \
  --model ideogram-v3-t2i --aspect-ratio landscape_16_9
```

## Related Skills

- `fairstack/skills@ai-image-generation` — Full reference
