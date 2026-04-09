---
name: ai-image-generation
description: "Generate AI images via FairStack. Capabilities: text-to-image, image-to-image, image editing, upscaling, background removal, face restoration, colorization, smart model routing, cost estimation, model comparison, quote before generate. Use for: AI art, product photography, concept art, social media graphics, marketing visuals, illustrations, thumbnails, hero images, mockups. Triggers: generate image, ai image, text to image, image generation, ai art, midjourney alternative, dall-e alternative, flux, seedream, ideogram, gpt image, imagen, create image, ai picture, t2i, text2img, ai illustration, product photo, concept art, image editing, remove background, upscale image, face restore, colorize"
---

![AI Image Generation](https://media.fairstack.ai/image/122efc51-35ed-4ac6-aeae-26960429c3cd/53d95505-9793-4d8d-8304-6d4ec09350fb.jpg)

# AI Image Generation

Generate images with AI via the FairStack CLI or REST API. Text-to-image, image-to-image, editing, upscaling, background removal, and more.

## Discover Models and Pricing

```bash
# List all image models with current pricing
fairstack models --modality image

# Get full details for a specific model (pricing, parameters, capabilities)
fairstack models --detail flux-schnell
fairstack models --detail seedream-4.5-t2i
```

```bash
# Via API (no auth required)
curl -s https://fairstack.ai/v1/models?modality=image | jq '.models[] | {id, name, price: .pricing}'
curl -s https://fairstack.ai/v1/models/flux-schnell | jq '{id, name, pricing, parameters}'
```

## Quick Start (CLI)

```bash
# Install
npm install -g fairstack

# Generate an image (polls automatically, returns URL)
fairstack image "A serene mountain lake at golden hour, photorealistic" --model flux-schnell

# Check cost before generating
fairstack image "A mountain lake" --model seedream-4.5-t2i --estimate

# Compare models side-by-side
fairstack compare image "A cat in a spacesuit" --models flux-schnell,gpt-image-1-mini,ideogram-v3-t2i
```

## Quick Start (curl)

```bash
# Generate (async — returns generation ID)
curl -s -X POST https://fairstack.ai/v1/image/generate \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A serene mountain lake at golden hour", "model": "flux-schnell"}'

# Poll for result
curl -s -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  https://fairstack.ai/v1/generations/{id}

# Or use sync mode (wait for completion)
curl -s -X POST https://fairstack.ai/v1/image/generate \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: wait=30" \
  -d '{"prompt": "A serene mountain lake", "model": "flux-schnell"}'

# Check cost first (no charge)
curl -s -X POST https://fairstack.ai/v1/image/generate \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A mountain lake", "model": "flux-schnell", "confirm": false}'
```

## API Reference

**`POST /v1/image/generate`**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Image description |
| `model` | string | No | Model ID |
| `aspect_ratio` | string | No | `square`, `portrait_4_3`, `landscape_16_9`, etc. |
| `image_url` | string | No | Reference image for editing models |
| `negative_prompt` | string | No | What to avoid |
| `seed` | integer | No | Reproducible results |
| `confirm` | boolean | No | `false` for cost quote only |

**Headers:** `Authorization: Bearer $FAIRSTACK_API_KEY` | `Prefer: wait=N` (sync mode) | `Idempotency-Key: xxx` (safe retry)

## Examples

### Fast Iteration

```bash
fairstack image "professional product photo of wireless earbuds, studio lighting" --model flux-schnell
```

### Photorealistic

```bash
fairstack image "cinematic portrait, golden hour, shallow depth of field, 85mm" --model seedream-4.5-t2i --aspect-ratio portrait_4_3
```

### Text in Images

```bash
fairstack image "poster with text NEVER GIVE UP in bold white on dark mountain background" --model ideogram-v3-t2i
```

### Image Editing

```bash
fairstack image "Change the background to a tropical beach" --model gpt-image-1.5-i2i --image-url https://example.com/portrait.jpg
```

### Background Removal

```bash
fairstack image "" --model recraft-remove-bg --image-url https://example.com/product.jpg
```

### Upscaling

```bash
fairstack image "" --model esrgan --image-url https://example.com/low-res.jpg
fairstack image "" --model topaz-image-upscale --image-url https://example.com/low-res.jpg
```

### Face Restoration

```bash
fairstack image "" --model codeformer --image-url https://example.com/old-photo.jpg
```

### Colorize B&W

```bash
fairstack image "" --model ddcolor --image-url https://example.com/bw-photo.jpg
```

### Quality Tiers (Auto Model Selection)

```bash
# Let FairStack choose the best model for the price tier
curl -s -X POST https://fairstack.ai/v1/image/generate \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A cat in a spacesuit", "quality": "smart"}'
```

## Smart Model Selection

```bash
fairstack select-model "I need a photorealistic product shot of a watch" --modality image
```

## Error Handling

| Error | Meaning | Fix |
|-------|---------|-----|
| `validation_error` | Missing/invalid params | Check required fields |
| `insufficient_credits` | Balance too low | `fairstack balance` then add at fairstack.ai/app/billing |
| `content_filtered` | Prompt flagged | Simplify prompt |
| `rate_limited` | Too many requests | Back off |
| `provider_unavailable` | Model down | Try different model |

## Tips

- **Start cheap, iterate up.** Use a budget model for drafts, then upgrade for finals.
- **Use `--estimate` first.** Check cost before committing credits.
- **Seed for consistency.** `--seed 42` gives reproducible results.
- **Model details.** `fairstack models --detail <model-id>` shows full parameter schema and current pricing.

## Pricing

All prices = infrastructure cost + 20% margin. No hidden fees. Run `fairstack models --modality image` for current pricing.

## Related Skills

- `fairstack/skills@ai-video-generation` — Animate images into video
- `fairstack/skills@ai-voice-generation` — Add narration
- `fairstack/skills@smart-router` — AI model selection
- `fairstack/skills@compare-models` — Side-by-side comparison
- `fairstack/skills@cost-estimator` — Cost estimation
