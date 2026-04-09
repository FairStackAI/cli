---
name: character-design-sheet
description: "Generate character design sheets and concept art with AI via FairStack. Covers character turnarounds, expression sheets, style consistency. Triggers: character design, character sheet, concept art, character turnaround, expression sheet, character concept, game character, avatar design"
---

# Character Design Sheet

Generate character concepts and design sheets for games, animation, and branding.

## Quick Generate

```bash
# Character turnaround
fairstack image "Character design sheet, front/side/back views of a friendly robot mascot, clean white background, consistent design, concept art style" \
  --model gpt-image-1.5-t2i

# Expression sheet
fairstack image "Character expression sheet, same cartoon cat face showing: happy, sad, surprised, angry, confused, sleeping, six expressions in grid layout" \
  --model ideogram-v3-t2i

# Use FLUX Kontext for consistency across multiple generations
fairstack image "Friendly robot character, teal and silver, round body, big eyes, waving, concept art" \
  --model flux-kontext-pro
```

## Consistency Tips

- Use FLUX Kontext Pro for character consistency across multiple images
- Include detailed visual descriptions in every prompt
- Use seed values for reproducible starting points: `--seed 42`
- Generate reference sheet first, then reference it for I2I variations

## Related Skills

- `fairstack/skills@ai-image-generation` — Full model reference
- `fairstack/skills@compare-models` — Test character styles across models
