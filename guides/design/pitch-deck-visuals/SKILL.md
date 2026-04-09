---
name: pitch-deck-visuals
description: "Generate pitch deck and presentation visuals with AI via FairStack. Covers slide types, visual styles, data visualization backgrounds, team photos, product mockups. Use for: pitch decks, investor presentations, keynotes, sales decks, conference talks. Triggers: pitch deck, presentation visuals, slide design, deck visuals, investor deck, keynote visuals, presentation images, slide images, sales deck"
---

# Pitch Deck Visuals

Generate presentation visuals with AI. Cover slides, hero images, concept art, backgrounds, and product mockups.

## Slide Types & Prompts

### Title Slide

```bash
fairstack image "Abstract minimal background, gradient from dark navy to teal, subtle geometric shapes, clean modern, presentation slide background" \
  --model seedream-4.5-t2i --aspect-ratio landscape_16_9
```

### Problem/Solution

```bash
fairstack image "Split composition, left side chaotic tangled wires in red lighting, right side clean organized cables in blue lighting, contrast between chaos and order" \
  --model flux-2-t2i --aspect-ratio landscape_16_9
```

### Market Opportunity

```bash
fairstack image "Abstract visualization of global connected network, glowing nodes and lines on dark background, data visualization aesthetic, blue and teal" \
  --model seedream-4.5-t2i --aspect-ratio landscape_16_9
```

### Team Slide (Portraits)

```bash
fairstack image "Professional headshot, friendly business person, soft studio lighting, clean neutral background, shoulders visible" \
  --model seedream-4.5-t2i --aspect-ratio portrait_4_3
```

### Product Mockup

```bash
fairstack image "MacBook Pro displaying a clean SaaS dashboard, on a minimal desk, soft warm lighting, shallow depth of field" \
  --model gpt-image-1.5-t2i --aspect-ratio landscape_16_9
```

## Style Consistency

Use the same model and similar prompt structure across all slides for visual consistency:

```bash
# Generate all backgrounds with same model and color scheme
for slide in "technology abstract" "growth upward" "global network" "team collaboration"; do
  fairstack image "Minimal ${slide} background, dark navy to teal gradient, subtle, presentation style" \
    --model seedream-4.5-t2i --aspect-ratio landscape_16_9
done
```

## Cost Planning

```bash
fairstack image "test" --model seedream-4.5-t2i --estimate
fairstack image "test" --model flux-schnell --estimate
```

Multiply per-image cost by the number of slides.

## Related Skills

- `fairstack/skills@ai-image-generation` — Full generation reference
- `fairstack/skills@compare-models` — Test visual styles
