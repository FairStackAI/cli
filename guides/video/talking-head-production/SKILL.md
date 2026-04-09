---
name: talking-head-production
description: "Talking head video production with AI via FairStack. Covers portrait requirements, audio quality, model selection, long-form segmentation, combining TTS with avatar. Use for: spokesperson videos, course content, social media, presentations, product demos. Triggers: talking head, avatar video, lipsync, lip sync, ai spokesperson, virtual presenter, talking avatar, ai presenter"
---

# Talking Head Production

Create talking head videos from portrait images and audio.

## Full Workflow

### Step 1: Generate or Prepare Audio

```bash
# Generate speech
fairstack voice "Welcome to our product tour. Today I will show you three powerful features." \
  --model chatterbox-turbo
```

### Step 2: Generate or Prepare Portrait

```bash
# Generate a professional portrait
fairstack image "Professional headshot, friendly person, soft studio lighting, clean grey background, head and shoulders, direct eye contact" \
  --model seedream-4.5-t2i --aspect-ratio portrait_4_3
```

### Step 3: Create Talking Head

```bash
fairstack talking-head --model musetalk-1.5 \
  --image-url [portrait-url] --audio-url [voice-url]
```

## Model Selection

```bash
# Browse all talking head models with current pricing
fairstack models --modality talkingHead

# Get details for a specific model
fairstack models --detail musetalk-1.5
fairstack models --detail kling-avatar-std
```

## Portrait Requirements

- Center-framed face, head and shoulders
- Eyes looking at camera
- Neutral/slight smile expression
- No sunglasses or face obstructions
- Clear lighting, no harsh shadows
- Minimum 512x512 face region

## Long-Form Content (>30s)

Split into segments:

```bash
# Generate audio segments
fairstack voice "Segment one script..." --model chatterbox-turbo
fairstack voice "Segment two script..." --model chatterbox-turbo
fairstack voice "Segment three script..." --model chatterbox-turbo

# Generate talking head for each (same portrait)
fairstack talking-head --model musetalk-1.5 --image-url [portrait] --audio-url [seg1-audio]
fairstack talking-head --model musetalk-1.5 --image-url [portrait] --audio-url [seg2-audio]
fairstack talking-head --model musetalk-1.5 --image-url [portrait] --audio-url [seg3-audio]
```

## Cost Planning

Use `--estimate` on each step:

```bash
fairstack voice "your script" --model chatterbox-turbo --estimate
fairstack image "portrait" --model seedream-4.5-t2i --estimate
fairstack estimate talking-head --model musetalk-1.5 --image-url URL --audio-url URL
```

## Related Skills

- `fairstack/skills@ai-talking-head` — Full model reference
- `fairstack/skills@ai-voice-generation` — Generate speech audio
- `fairstack/skills@voice-library` — Browse voices
