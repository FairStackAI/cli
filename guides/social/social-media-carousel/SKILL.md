---
name: social-media-carousel
description: "Generate social media carousel images with AI via FairStack. Covers Instagram, LinkedIn carousel specs and visual consistency. Triggers: carousel, social media carousel, instagram carousel, linkedin carousel, swipe post, multi-image post"
---

# Social Media Carousel

Generate consistent carousel slide images for Instagram and LinkedIn.

## Specs

| Platform | Dimensions | Slides |
|----------|-----------|--------|
| Instagram | 1080x1080 (square) | 2-10 |
| LinkedIn | 1080x1080 or 1080x1350 | 2-20 |

## Generate a 5-Slide Carousel

```bash
# Use same model and style for consistency
fairstack image "Slide 1: Bold title 'AI in 2026', clean teal gradient, modern minimal" --model ideogram-v3-t2i &
fairstack image "Slide 2: Icon of brain with circuits, clean teal gradient, modern minimal" --model ideogram-v3-t2i &
fairstack image "Slide 3: Bar chart showing growth, clean teal gradient, modern minimal" --model ideogram-v3-t2i &
fairstack image "Slide 4: Network of connected people, clean teal gradient, modern minimal" --model ideogram-v3-t2i &
fairstack image "Slide 5: Call to action 'Follow for more', clean teal gradient, modern minimal" --model ideogram-v3-t2i &
wait
```

## Cost Planning

```bash
fairstack image "test" --model ideogram-v3-t2i --estimate
```

Multiply per-image cost by the number of slides.

## Consistency Tips

- Use the same model for all slides
- Include the same color/style keywords in every prompt
- Use Ideogram V3 for text-heavy carousels
- Use `--seed` with same base seed for style consistency

## Related Skills

- `fairstack/skills@ai-image-generation` — Full model reference
