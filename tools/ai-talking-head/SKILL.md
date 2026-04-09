---
name: ai-talking-head
description: "Generate AI talking head and lipsync videos via FairStack. Capabilities: audio-driven talking heads, lipsync, avatar animation, portrait animation, spokesperson videos. Use for: course content, social media, presentations, product demos, virtual presenters, marketing videos, explainer videos. Triggers: talking head, avatar video, lipsync, lip sync, ai spokesperson, virtual presenter, ai presenter, talking avatar, video presenter, ai face video, ai talking head, presenter video, animate portrait, portrait to video, photo to video with audio"
---

![AI Talking Head](https://media.fairstack.ai/image/122efc51-35ed-4ac6-aeae-26960429c3cd/30f7e5f1-13ac-4c01-977b-681f31fe7dd0.jpg)

# AI Talking Head

Generate talking head and lipsync videos via the FairStack CLI or REST API. Turn any portrait + audio into a realistic speaking video.

## Discover Models and Pricing

```bash
# List all talking head models with current pricing
fairstack models --modality talkingHead

# Get full details for a specific model
fairstack models --detail musetalk-1.5
fairstack models --detail kling-avatar-std
```

```bash
# Via API (no auth required)
curl -s https://fairstack.ai/v1/models?modality=talkingHead | jq '.models[] | {id, name, price: .pricing}'
```

## Quick Start (CLI)

```bash
# Generate a talking head video
fairstack talking-head --model musetalk-1.5 \
  --image-url https://example.com/portrait.jpg \
  --audio-url https://example.com/speech.wav

# Check cost first
fairstack estimate talking-head --model musetalk-1.5 \
  --image-url https://example.com/portrait.jpg \
  --audio-url https://example.com/speech.wav
```

## Quick Start (curl)

```bash
curl -s -X POST https://fairstack.ai/v1/talking-head/generate \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "musetalk-1.5",
    "image_url": "https://example.com/portrait.jpg",
    "audio_url": "https://example.com/speech.wav"
  }'
```

## API Reference

**`POST /v1/talking-head/generate`**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | No | Model ID |
| `image_url` | string | Yes | Portrait image URL |
| `audio_url` | string | Yes | Speech audio URL |
| `confirm` | boolean | No | `false` for cost quote |

## Full Workflow: Text to Talking Head

### Step 1: Generate Speech

```bash
fairstack voice "Welcome to our product demo. Today I will show you three features that save hours every week." --model chatterbox-turbo
# Output URL: https://media.fairstack.ai/voice/xxx/yyy.wav
```

### Step 2: Generate Portrait (optional)

```bash
fairstack image "Professional headshot, friendly business person, soft studio lighting, clean background, direct eye contact" --model seedream-4.5-t2i --aspect-ratio portrait_4_3
# Output URL: https://media.fairstack.ai/image/xxx/yyy.jpg
```

### Step 3: Create Talking Head

```bash
fairstack talking-head --model musetalk-1.5 \
  --image-url https://media.fairstack.ai/image/xxx/yyy.jpg \
  --audio-url https://media.fairstack.ai/voice/xxx/yyy.wav
```

Use `--estimate` on each step to plan the total cost.

## Portrait Requirements

| Requirement | Why |
|-------------|-----|
| Center-framed face | Model needs face in predictable position |
| Head and shoulders visible | Natural body language |
| Eyes looking at camera | Connection with viewer |
| Neutral/slight smile | Starting point for animation |
| Clear face (no sunglasses) | Face detection needs features |
| Min 512x512 face region | Detail preservation |

## Tips

- **Start with a budget lipsync model** for drafts. Upgrade to premium for finals.
- **Audio quality matters.** Clean audio = accurate lipsync. Use TTS for best results.
- **For long content (>30s),** split into segments and generate separately, then stitch.
- **Portrait quality matters more than resolution.** Frontal, well-lit, clear face.
- **Check available models.** `fairstack models --modality talkingHead` shows current options and pricing.

## Error Handling

| Error | Meaning | Fix |
|-------|---------|-----|
| `image_url required` | No portrait provided | Add `--image-url` |
| `audio_url required` | No audio provided | Add `--audio-url` |
| `insufficient_credits` | Balance too low | Add credits |

## Pricing

All prices = infrastructure cost + 20% margin. Run `fairstack models --modality talkingHead` for current pricing.

## Related Skills

- `fairstack/skills@ai-voice-generation` — Generate speech for the audio input
- `fairstack/skills@ai-image-generation` — Generate portrait images
- `fairstack/skills@ai-video-generation` — Alternative video generation
