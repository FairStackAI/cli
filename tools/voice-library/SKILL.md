---
name: voice-library
description: "Browse and search FairStack's voice library. Filter by gender, archetype, accent, language. Each voice has preview audio and avatar image. Archetypes: narrator, conversational, character, professional, expressive. No auth required. Use for: finding voices for TTS, voiceover casting, voice selection, browsing available voices. Triggers: voice library, browse voices, find voice, voice catalog, available voices, voice list, narrator voice, female voice, male voice, voice preview, voice selection, voice casting, tts voices"
---

![Voice Library](https://media.fairstack.ai/image/122efc51-35ed-4ac6-aeae-26960429c3cd/4d4b9d18-3999-439c-8480-d09fba7124ef.jpg)

# Voice Library

Browse and search pre-built voices. Filter by gender, archetype, accent, and language. Each voice includes preview audio and avatar image. No auth required.

## Quick Start (CLI)

```bash
# Browse all voices
fairstack voices

# Filter by gender
fairstack voices --gender female

# Filter by archetype
fairstack voices --archetype narrator

# Search by name
fairstack voices --search marco

# Combine filters
fairstack voices --gender male --archetype conversational --limit 10
```

## Quick Start (curl)

```bash
# Browse voices (no auth needed)
curl -s https://fairstack.ai/v1/voices | jq '.voices[:5] | .[] | {id, name, gender, archetype}'

# Filter by archetype
curl -s "https://fairstack.ai/v1/voices?archetype=narrator" | jq '.pagination.total'

# Search by name
curl -s "https://fairstack.ai/v1/voices?search=marco" | jq '.voices[0]'

# Get total count
curl -s https://fairstack.ai/v1/voices | jq '.pagination.total'
```

## API Reference

**`GET /v1/voices`** — No auth required

| Param | Type | Description |
|-------|------|-------------|
| `gender` | string | `male` or `female` |
| `archetype` | string | `narrator`, `conversational`, `character`, `professional`, `expressive` |
| `language` | string | Language code (`en`, `es`, `fr`, `zh`, `ja`, etc.) |
| `search` | string | Search by name |
| `limit` | number | Results per page (default 20, max 50) |
| `page` | number | Page number |

### Voice Object

```json
{
  "id": "internal_marco",
  "name": "Marco",
  "archetype": "narrator",
  "accent": "latin-american",
  "gender": "male",
  "language": "en",
  "tags": ["warm", "internal"],
  "description": "Warm Latin narrator with a grounded, natural delivery",
  "sampleUrl": "https://media.fairstack.ai/voices/narrator/previews/internal_marco.wav",
  "avatarUrl": "https://media.fairstack.ai/voices/avatars/internal_marco.png"
}
```

## Using Voices

Once you find a voice, use its `id` with the voice generation command:

```bash
# Use a library voice
fairstack voice "Hello, this is Marco speaking." --model chatterbox-turbo --voice internal_marco

# Or via curl
curl -s -X POST https://fairstack.ai/v1/voice/generate \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world", "model": "chatterbox-turbo", "voice": "internal_marco"}'
```

## Voice Archetypes

| Archetype | Description | Best For |
|-----------|-------------|----------|
| **narrator** | Professional, measured delivery | Documentaries, audiobooks, tutorials |
| **conversational** | Natural, casual tone | Podcasts, social media, dialogue |
| **character** | Distinct personality | Animation, gaming, storytelling |
| **professional** | Corporate, authoritative | Business, presentations, IVR |
| **expressive** | Wide emotional range | Dramatic content, ads, entertainment |

## Tips

- **Preview before using.** Each voice has a `sampleUrl` — listen to it first.
- **No cloning needed for most use cases.** The library covers narrators, characters, professionals, and more.
- **Voice + model compatibility.** Not all voices work with all models. Chatterbox Turbo has the broadest compatibility.
- **Use the API to get live counts.** `curl -s https://fairstack.ai/v1/voices | jq '.pagination.total'`

## Related Skills

- `fairstack/skills@ai-voice-generation` — Generate speech with these voices
- `fairstack/skills@ai-talking-head` — Create talking head videos from voice audio
