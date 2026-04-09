---
name: ai-voice-generation
description: "Generate AI speech and audio via FairStack with a voice library. Capabilities: text-to-speech, voice cloning, speech-to-text, sound effects, audio isolation, pre-built voices, multilingual TTS. Use for: voiceovers, narration, audiobooks, podcasts, video narration, accessibility, IVR, voice assistants, dubbing, transcription. Triggers: text to speech, tts, voice generation, ai voice, speech synthesis, voiceover, generate speech, narrator, voice cloning, ai audio, speech to text, transcription, elevenlabs alternative, voice over, podcast voice, narration, tts api"
---

![AI Voice Generation](https://media.fairstack.ai/image/122efc51-35ed-4ac6-aeae-26960429c3cd/740653e4-cfde-4c6e-afa9-9625e853acf4.jpg)

# AI Voice Generation

Generate speech via the FairStack CLI or REST API. Text-to-speech, voice cloning, speech-to-text, sound effects, and audio isolation.

## Discover Models and Pricing

```bash
# List all voice models with current pricing
fairstack models --modality voice

# Get full details for a specific model
fairstack models --detail chatterbox-turbo
fairstack models --detail elevenlabs-turbo-2-5

# Browse the voice library
fairstack voices
fairstack voices --archetype narrator
fairstack voices --gender female
```

```bash
# Via API (no auth required)
curl -s https://fairstack.ai/v1/models?modality=voice | jq '.models[] | {id, name, price: .pricing}'
curl -s https://fairstack.ai/v1/voices | jq '.voices[:5] | .[] | {id, name, archetype}'
```

## Quick Start (CLI)

```bash
# Generate speech
fairstack voice "Welcome to FairStack. AI generation at fair prices." --model chatterbox-turbo

# With a specific voice from the library
fairstack voice "Hello world" --model chatterbox-turbo --voice internal_marco

# Browse voices
fairstack voices --archetype narrator

# Check cost first
fairstack voice "A long paragraph of text" --model elevenlabs-turbo-2-5 --estimate
```

## Quick Start (curl)

```bash
# Generate speech
curl -s -X POST https://fairstack.ai/v1/voice/generate \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: wait=30" \
  -d '{"text": "Welcome to FairStack.", "model": "chatterbox-turbo"}'

# Browse voices (no auth)
curl -s https://fairstack.ai/v1/voices | jq '.voices[:5] | .[] | {id, name, archetype}'

# Cost quote
curl -s -X POST https://fairstack.ai/v1/voice/generate \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "test", "model": "chatterbox-turbo", "confirm": false}'
```

## API Reference

**`POST /v1/voice/generate`**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | Yes | Text to speak |
| `model` | string | No | Model ID |
| `voice` | string | No | Voice ID from library |
| `ref_audio_url` | string | No | Audio URL for voice cloning |
| `speed` | number | No | Speed (0.5-2.0) |
| `language` | string | No | Language code |
| `confirm` | boolean | No | `false` for cost quote |

## Voice Library

```bash
# Browse all
fairstack voices

# Narrators
fairstack voices --archetype narrator

# Female voices
fairstack voices --gender female

# Search by name
fairstack voices --search marco
```

Each voice has: `id`, `name`, `gender`, `archetype`, `accent`, `description`, `sampleUrl`, `avatarUrl`

## Examples

### Budget TTS

```bash
fairstack voice "Good morning. Today we are reviewing the quarterly results." --model indextts2
```

### Premium Multilingual

```bash
fairstack voice "Bonjour et bienvenue. Nous allons explorer les nouvelles fonctionnalites." \
  --model elevenlabs-multilingual-v2 --language fr
```

### Voice Cloning

```bash
fairstack voice "This is my cloned voice." --model qwen-3-tts \
  --ref-audio https://example.com/my-voice-sample.wav
```

### Sound Effects

```bash
fairstack voice "Thunderstorm with heavy rain and distant lightning" --model elevenlabs-sfx
```

## Recommended: Custom Narrator Workflow

The preferred approach for professional narration is a two-step pipeline: **Qwen 3 TTS for voice design/cloning, then IndexTTS2 for emotional delivery.**

**Why two models:** Qwen 3 TTS excels at voice design — you describe a voice ("deep, velvety male bass, 60s, calm omniscient narrator") and it creates a unique anchor voice from scratch. IndexTTS2 excels at emotional control — it clones any voice and renders it with specific emotions (sad, angry, calm, afraid, happy). Together they give you a custom voice with emotional range that neither model achieves alone.

**Step 1: Design or clone the voice with Qwen 3 TTS**

```bash
# Design a new voice from a description
fairstack voice "The Mongol Empire began not with conquest, but with a boy named Temujin." \
  --model qwen-3-tts \
  --voice-description "Deep, velvety male bass voice, 60s, calm omniscient narrator, measured pace"

# Or clone from a reference sample
fairstack voice "The Mongol Empire began not with conquest, but with a boy named Temujin." \
  --model qwen-3-tts \
  --ref-audio https://example.com/narrator-sample.wav
```

Save the output — this is your **anchor voice**. It defines the character.

**Step 2: Render with emotion via IndexTTS2**

```bash
# Clone the anchor voice and add emotional delivery
fairstack voice "He stood alone on the steppe, watching his father's killers ride away." \
  --model indextts2 \
  --ref-audio <anchor-voice-url-from-step-1> \
  --emotion sad

fairstack voice "The walls of Baghdad fell. The Tigris ran black with ink from the libraries." \
  --model indextts2 \
  --ref-audio <anchor-voice-url-from-step-1> \
  --emotion afraid
```

**This is how we built the Mongol Empire documentary** — 10 characters, each with a designed anchor voice and emotional variants. The narrator alone had calm, sad, and dramatic deliveries from the same base voice.

**For a full voice cast:**
1. Design each character's anchor voice with Qwen 3 TTS (unique voice per character)
2. Render every line with IndexTTS2, choosing the right emotion per scene
3. The anchor stays consistent — IndexTTS2 preserves the voice identity while adding emotion

## Tips

- **Browse voices first.** Use `fairstack voices` to browse the library — usually no need to clone.
- **For narration: Qwen 3 TTS + IndexTTS2.** Design the voice with Qwen, deliver with emotion via IndexTTS2.
- **Chatterbox Turbo is the most versatile** — works with most voices, fast, natural. Good for conversational content.
- **ElevenLabs for premium quality** — noticeably better for professional content where budget allows.
- **Combine with talking heads.** Generate speech, then use the URL with a talking head model.
- **Check pricing.** `fairstack models --modality voice` shows current pricing for all voice models.

## Pricing

All prices = infrastructure cost + 20% margin. Run `fairstack models --modality voice` for current pricing.

## Related Skills

- `fairstack/skills@voice-library` — Browse all voices
- `fairstack/skills@ai-talking-head` — Talking head from voice audio
- `fairstack/skills@ai-video-generation` — Add voice to video
- `fairstack/skills@ai-music-generation` — Background music
