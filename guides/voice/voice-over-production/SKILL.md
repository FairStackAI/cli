---
name: voice-over-production
description: "Professional voiceover production with AI via FairStack. Covers model selection by use case, voice casting from voice library, script formatting, audio quality tips, multi-language voiceover, combining with video. Use for: commercial voiceover, explainer videos, e-learning narration, audiobook production, corporate training, podcast narration. Triggers: voiceover, voice over, narration, professional voice, commercial voice, explainer narration, e-learning voice, audiobook narration, corporate narration, voice production, voice recording"
---

# Voice-Over Production

Create professional voiceovers with AI. Covers model selection, voice casting, script formatting, and combining voice with video.

## Model Selection

```bash
# Browse all voice models with pricing
fairstack models --modality voice

# Get details for a specific model
fairstack models --detail chatterbox-turbo
fairstack models --detail elevenlabs-turbo-2-5
```

**By use case:**
- **Quick drafts** — Chatterbox Turbo: fast, natural, versatile
- **Commercial/professional** — ElevenLabs Turbo 2.5: premium quality
- **Multilingual** — ElevenLabs Multilingual V2: 29 languages
- **Budget long-form** — IndexTTS2: cheapest per generation
- **Voice cloning** — Qwen3-TTS: best cloning quality
- **High fidelity** — MiniMax Speech 2.8 HD: highest quality

## Voice Casting

```bash
# Browse narrator voices
fairstack voices --archetype narrator

# Browse female voices
fairstack voices --gender female --archetype professional

# Listen to samples (each voice has a sampleUrl)
fairstack voices --search marco --raw | jq '.voices[0].sampleUrl'
```

### Recommended Archetypes by Content Type

| Content | Voice Archetype | How to Find |
|---------|-----------------|-------------|
| Documentary | narrator | `fairstack voices --archetype narrator` |
| Tutorial | conversational | `fairstack voices --archetype conversational` |
| Corporate | professional | `fairstack voices --archetype professional` |
| Story/fiction | character | `fairstack voices --archetype character` |
| Ad/commercial | expressive | `fairstack voices --archetype expressive` |

## Script Formatting Tips

### Do

- Write for the ear, not the eye. Short sentences. Active voice.
- Include breathing pauses with periods and commas.
- Spell out abbreviations: "CEO" -> "C.E.O." or "chief executive officer"
- Spell out numbers: "15" -> "fifteen" for natural delivery

### Don't

- Don't use markdown or formatting characters
- Don't write overly long sentences (>25 words)
- Don't use parenthetical asides — AI voices handle them poorly

## Production Workflow

### Single Take (Short)

```bash
fairstack voice "Your script here" --model chatterbox-turbo
```

### Long-Form (Chaptered)

For content over 500 characters, split into natural sections:

```bash
fairstack voice "Chapter one. Introduction to machine learning..." --model chatterbox-turbo
fairstack voice "Chapter two. Supervised learning techniques..." --model chatterbox-turbo
fairstack voice "Chapter three. Real world applications..." --model chatterbox-turbo
```

### Multilingual

```bash
# English
fairstack voice "Welcome to our product" --model elevenlabs-multilingual-v2 --language en

# French
fairstack voice "Bienvenue sur notre produit" --model elevenlabs-multilingual-v2 --language fr

# Japanese
fairstack voice "製品へようこそ" --model elevenlabs-multilingual-v2 --language ja
```

## Combining with Video

```bash
# 1. Generate voiceover
fairstack voice "Your narration script" --model chatterbox-turbo

# 2. Create talking head (if needed)
fairstack talking-head --model musetalk-1.5 \
  --image-url [portrait-url] --audio-url [voice-url]

# Or use the audio URL directly in your video editor
```

## Cost Planning

Use `--estimate` to check cost before each generation:

```bash
fairstack voice "Your full script text here" --model chatterbox-turbo --estimate
fairstack voice "Your full script text here" --model elevenlabs-turbo-2-5 --estimate
```

## Related Skills

- `fairstack/skills@voice-library` — Browse all voices
- `fairstack/skills@ai-talking-head` — Create talking head from voiceover
- `fairstack/skills@ai-music-generation` — Background music
