---
name: case-study-writing
description: "Generate visuals for case studies with AI via FairStack. Covers before/after images, result visualizations, client-style mockups. Triggers: case study, case study visual, before after, success story, client story, testimonial visual"
---

# Case Study Visuals

Generate supporting visuals for case studies and success stories.

## Before/After

```bash
fairstack image "Split composition: left side dark cluttered workspace (before), right side bright organized workspace (after), dramatic contrast, professional" \
  --model seedream-4.5-t2i --aspect-ratio landscape_16_9
```

## Results/Metrics Backdrop

```bash
fairstack image "Clean professional background with subtle upward trend chart, green success theme, space for text overlay, data-driven aesthetic" \
  --model gpt-image-1.5-t2i --aspect-ratio landscape_16_9
```

## Client Industry Scene

```bash
fairstack image "Modern [industry] office environment, team collaborating, warm natural light, professional candid style" \
  --model seedream-4.5-t2i --aspect-ratio landscape_16_9
```

## Related Skills

- `fairstack/skills@ai-image-generation` — Full reference
