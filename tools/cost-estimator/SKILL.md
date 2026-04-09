---
name: cost-estimator
description: "Estimate AI generation costs before spending credits via FairStack. Get exact cost quotes for any model and modality without being charged. Supports image, video, voice, music, talking head. Use for: budgeting, cost planning, comparing model prices, pre-flight cost check. Triggers: cost estimate, how much, price check, estimate cost, generation cost, model pricing, budget, how much does it cost, pricing, cost calculator, check price, cost before generating"
---

![Cost Estimator](https://media.fairstack.ai/image/122efc51-35ed-4ac6-aeae-26960429c3cd/ca84dd77-cf2f-40da-86a9-3ced89683457.jpg)

# Cost Estimator

Check exact generation cost before spending credits. Returns a binding quote valid for 60 seconds. Works for all modalities. No credits charged.

## Quick Start (CLI)

```bash
# Estimate image generation cost
fairstack estimate image "A mountain landscape" --model seedream-4.5-t2i

# Estimate video cost
fairstack estimate video "Ocean waves" --model kling-3-0-std

# Estimate voice cost
fairstack estimate voice "A long paragraph of narration text" --model elevenlabs-turbo-2-5

# Estimate music cost
fairstack estimate music "Lo-fi hip hop" --model suno-generate

# Or use --estimate flag on any generation command
fairstack image "test prompt" --model flux-schnell --estimate
```

## Quick Start (curl)

```bash
# Set confirm=false to get a quote without generating
curl -s -X POST https://fairstack.ai/v1/image/generate \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A mountain landscape",
    "model": "seedream-4.5-t2i",
    "confirm": false
  }'

# Response:
# {
#   "data": {
#     "quote_id": "...",
#     "estimated_cost": { "cost": 0.039, "cost_micro": 39000, "currency": "USD" },
#     "expires_at": "...",
#     "expires_in_sec": 60
#   }
# }
```

## How It Works

1. Send a normal generation request with `"confirm": false`
2. FairStack validates the request and returns a cost quote
3. Quote is valid for 60 seconds
4. No credits are charged
5. Use the `quote_id` to execute if you want (optional)

## Browse All Pricing

```bash
# See current pricing for all models by modality
fairstack models --modality image
fairstack models --modality video
fairstack models --modality voice
fairstack models --modality music
fairstack models --modality talkingHead

# Get detailed pricing for a specific model
fairstack models --detail flux-schnell

# Via API (no auth required)
curl -s https://fairstack.ai/v1/models | jq '.models[] | {id, modality, price: .pricing}'
```

## Tips

- **Always estimate before expensive operations.** Video and talking head models can cost significantly more than image models.
- **Voice cost may vary by text length** for per-character models.
- **Quotes expire in 60 seconds.** They reflect current pricing and are binding if executed.
- **No charge for estimates.** You can check costs unlimited times.

## Related Skills

- `fairstack/skills@compare-models` — Compare models with actual generation
- `fairstack/skills@smart-router` — Get model recommendation
