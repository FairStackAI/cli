---
name: ai-video-generation
description: "Generate AI videos via FairStack. Capabilities: text-to-video, image-to-video, video-to-video, first+last frame, video upscaling, video extension, video editing, cost estimation, model comparison. Use for: social media videos, marketing content, product demos, explainer videos, AI animation, music videos, ads, presentations. Triggers: generate video, ai video, text to video, image to video, video generation, ai animation, animate image, t2v, i2v, v2v, veo, kling, runway, sora alternative, pika alternative, video from text, video from image, create video, ai video maker, video editing"
---

![AI Video Generation](https://media.fairstack.ai/image/122efc51-35ed-4ac6-aeae-26960429c3cd/dc7cafcb-81d8-438d-9c44-50752727ced2.jpg)

# AI Video Generation

Generate videos with AI via the FairStack CLI or REST API. Text-to-video, image-to-video, video-to-video, and video upscaling.

## Discover Models and Pricing

```bash
# List all video models with current pricing
fairstack models --modality video

# Get full details for a specific model
fairstack models --detail vidu-q3-turbo-t2v
fairstack models --detail kling-3-0-std
```

```bash
# Via API (no auth required)
curl -s https://fairstack.ai/v1/models?modality=video | jq '.models[] | {id, name, price: .pricing}'
```

## Quick Start (CLI)

```bash
# Text-to-video
fairstack video "A drone shot over a misty mountain forest at sunrise" --model vidu-q3-turbo-t2v

# Image-to-video (animate still image)
fairstack video "Gentle camera push in, leaves rustling" --model seedance-v1-5-pro-i2v \
  --image-url https://example.com/landscape.jpg

# Check cost first
fairstack video "Ocean waves" --model kling-3-0-std --estimate

# Compare models
fairstack compare video "Sunset timelapse" --models vidu-q3-turbo-t2v,seedance-1-pro
```

## Quick Start (curl)

```bash
# Text-to-video
curl -s -X POST https://fairstack.ai/v1/video/generate \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A drone shot over a misty forest", "model": "vidu-q3-turbo-t2v"}'

# Poll for result (video takes 30s-5min)
curl -s -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  https://fairstack.ai/v1/generations/{id}

# Cost quote
curl -s -X POST https://fairstack.ai/v1/video/generate \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test", "model": "kling-3-0-std", "confirm": false}'
```

## API Reference

**`POST /v1/video/generate`**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Video description |
| `model` | string | No | Model ID |
| `image_url` | string | No | Source image for I2V |
| `video_url` | string | No | Source video for V2V |
| `duration` | number | No | Duration in seconds |
| `aspect_ratio` | string | No | `16:9`, `9:16`, `1:1` |
| `confirm` | boolean | No | `false` for cost quote |

## Examples

### Budget T2V

```bash
fairstack video "Coffee cup with steam rising, warm morning light" --model vidu-q3-turbo-t2v
```

### Animate Product Photo (I2V)

```bash
# Generate product image, then animate it
fairstack image "Luxury watch on marble, studio lighting" --model seedream-4.5-t2i
# Use output URL as image_url:
fairstack video "Slow camera orbit, light reflections" --model seedance-v1-5-pro-i2v \
  --image-url https://media.fairstack.ai/image/xxx/yyy.jpg
```

### Video Restyling (V2V)

```bash
fairstack video "Transform to anime style, vibrant colors" --model runway-aleph \
  --video-url https://example.com/original.mp4
```

## Tips

- **Video is expensive.** Always check cost with `--estimate` first.
- **Image-to-video is more controllable.** Start with a great image.
- **Use a budget T2V model for drafts**, then upgrade for finals.
- **Be patient.** Video takes 30s-5min. CLI handles polling automatically.
- **Check available models.** `fairstack models --modality video` shows current options and pricing.

## Pricing

All prices = infrastructure cost + 20% margin. Run `fairstack models --modality video` for current pricing.

## Related Skills

- `fairstack/skills@ai-image-generation` — Generate source images for I2V
- `fairstack/skills@ai-voice-generation` — Add narration
- `fairstack/skills@ai-talking-head` — Talking head / lipsync
- `fairstack/skills@ai-music-generation` — Background music
- `fairstack/skills@cost-estimator` — Estimate before generating
