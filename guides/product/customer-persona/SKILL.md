---
name: customer-persona
description: "Generate customer persona profile images and illustrations with AI via FairStack. Covers persona portraits, environment scenes, journey map visuals. Triggers: customer persona, user persona, buyer persona, persona image, persona profile, user profile, target audience"
---

# Customer Persona Visuals

Generate persona profile images and supporting visuals.

## Persona Portrait

```bash
# Tech-savvy developer persona
fairstack image "Professional portrait of a developer in their late 20s, casual tech company style, friendly confident expression, modern office background with monitors, natural lighting" \
  --model seedream-4.5-t2i --aspect-ratio portrait_4_3

# Enterprise buyer persona
fairstack image "Professional portrait of a business executive in their 40s, tailored suit, confident composed expression, modern corporate office, clean lighting" \
  --model seedream-4.5-t2i --aspect-ratio portrait_4_3
```

## Persona Environment

```bash
# Show the persona's workspace/context
fairstack image "Modern developer workspace, dual monitors with code, standing desk, plants, warm lighting, lived-in but organized" \
  --model gpt-image-1.5-t2i --aspect-ratio landscape_16_9
```

## Batch Personas

```bash
fairstack image "Portrait: young creative designer, colorful casual, artsy workspace" --model seedream-4.5-t2i &
fairstack image "Portrait: experienced product manager, smart casual, whiteboard behind" --model seedream-4.5-t2i &
fairstack image "Portrait: startup founder, hoodie, confident, minimal office" --model seedream-4.5-t2i &
fairstack image "Portrait: enterprise CTO, professional, conference room" --model seedream-4.5-t2i &
wait
```

## Cost Planning

```bash
fairstack image "test" --model seedream-4.5-t2i --estimate
```

Multiply per-image cost by number of personas.

## Related Skills

- `fairstack/skills@ai-image-generation` — Full reference
