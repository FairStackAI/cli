---
name: logo-design
description: "AI logo design and brand mark generation via FairStack. Covers logo types, color psychology, style prompts, iteration workflow, export considerations. Use for: logo design, brand identity, icon design, app icons, favicon generation. Triggers: logo design, logo generation, brand logo, ai logo, create logo, design logo, logo maker, brand mark, icon design, app icon"
---

# Logo Design

Generate logo concepts with AI via FairStack. Use for brainstorming and iteration — refine winners in a vector editor.

## Logo Types

| Type | Prompt Approach | Example |
|------|----------------|---------|
| Wordmark | "minimalist text logo spelling [NAME]" | Google, Coca-Cola |
| Lettermark | "single letter [X] logo, geometric" | Netflix N, Uber U |
| Icon/Symbol | "abstract symbol representing [concept]" | Apple, Twitter bird |
| Combination | "icon next to text [NAME]" | Spotify, Slack |
| Emblem | "badge/shield logo with [NAME]" | Starbucks, Harley |

## Quick Generate

```bash
# Clean modern lettermark
fairstack image "Minimalist letter F logo, geometric, clean lines, teal and white, flat design, on white background, professional" \
  --model ideogram-v3-t2i

# Abstract symbol
fairstack image "Abstract logo mark representing speed and connectivity, flowing lines, gradient blue to teal, modern, minimal, on white background" \
  --model gpt-image-1.5-t2i

# Compare styles across models
fairstack compare image "Modern tech startup logo for CloudSync, clean minimal" \
  --models ideogram-v3-t2i,gpt-image-1.5-t2i,seedream-4.5-t2i
```

## Prompting Tips

- Always include "on white background" or "on solid [color] background" for clean extraction
- Use "vector style", "flat design", "minimal" for cleaner results
- Specify "no gradients" or "no shadows" if you want pure flat
- Use Ideogram V3 for text-heavy logos (best text rendering)

## Iteration Workflow

1. Generate 10-15 concepts across models (use `--estimate` to check cost)
2. Pick top 3 directions
3. Refine with variations: `fairstack compare image "variation prompt" --models ...`
4. Export to vector editor for final refinement

## Related Skills

- `fairstack/skills@ai-image-generation` — Full model reference
- `fairstack/skills@compare-models` — A/B test logo concepts
