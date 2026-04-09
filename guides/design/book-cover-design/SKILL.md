---
name: book-cover-design
description: "Generate AI book covers and ebook covers via FairStack. Covers genre conventions, typography, composition, spine requirements. Use for: book covers, ebook covers, audiobook covers, report covers, whitepaper covers. Triggers: book cover, ebook cover, cover design, book design, novel cover, audiobook cover, report cover, whitepaper cover"
---

# Book Cover Design

Generate book cover concepts with AI. Match genre conventions and composition standards.

## Genre Conventions

| Genre | Visual Style | Colors |
|-------|-------------|--------|
| Thriller | Dark, atmospheric, single figure | Black, red, navy |
| Romance | Warm, dreamy, couple/nature | Pink, gold, sunset |
| Sci-fi | Futuristic, space, technology | Blue, neon, dark |
| Fantasy | Epic landscapes, magic, creatures | Rich colors, gold |
| Business | Clean, professional, minimal | Blue, white, black |
| Self-help | Bright, uplifting, simple | Yellow, teal, white |

## Quick Generate

```bash
# Thriller
fairstack image "Dark atmospheric book cover, lone figure walking down rain-soaked alley, neon reflections, noir mood, dramatic shadows, vertical composition" \
  --model seedream-4.5-t2i --aspect-ratio portrait_4_3

# Business/Non-fiction
fairstack image "Clean minimal book cover, abstract geometric shapes, professional blue and white gradient, modern typography space, vertical composition" \
  --model ideogram-v3-t2i --aspect-ratio portrait_4_3

# Fantasy
fairstack image "Epic fantasy book cover, ancient castle on cliff overlooking misty valley, dramatic clouds, golden sunset light, rich detailed landscape" \
  --model imagen-4 --aspect-ratio portrait_4_3
```

## Dimensions

| Format | Size |
|--------|------|
| Print (6x9) | 1800x2700px |
| Kindle | 1600x2560px |
| Audiobook | 3200x3200px (square) |

Use `portrait_4_3` for vertical covers, `square` for audiobook.

## Composition

- Leave upper 1/3 for title
- Leave lower 1/6 for author name
- Central visual element in middle 1/2
- Spine area (left edge) should have simple background

## Related Skills

- `fairstack/skills@ai-image-generation` — Full model reference
- `fairstack/skills@compare-models` — Test cover concepts
