---
name: ai-music-generation
description: "Generate AI music and songs via FairStack. Capabilities: text-to-music, song generation, instrumental, lyrics-to-song, music extension, mashup, vocal/instrumental separation, covers, MIDI export, lyric generation. Use for: background music, jingles, soundtracks, social media, podcasts, game audio, ads, royalty-free music, karaoke. Triggers: music generation, ai music, generate song, ai composer, text to music, song generator, create music, suno alternative, udio alternative, ai soundtrack, ai jingle, beat generator, background music, generate instrumental, lyrics to song, song cover, stem separation, ai singer"
---

![AI Music Generation](https://media.fairstack.ai/image/122efc51-35ed-4ac6-aeae-26960429c3cd/9741e295-cb5c-4ddc-ad1e-9915330f1c9d.jpg)

# AI Music Generation

Generate music, songs, and audio via the FairStack CLI or REST API. Full song generation, instrumentals, mashups, covers, stem separation, lyric generation, and more.

## Discover Models and Pricing

```bash
# List all music models with current pricing
fairstack models --modality music

# Get full details for a specific model
fairstack models --detail mureka-bgm
fairstack models --detail suno-generate
```

```bash
# Via API (no auth required)
curl -s https://fairstack.ai/v1/models?modality=music | jq '.models[] | {id, name, price: .pricing}'
```

## Quick Start (CLI)

```bash
fairstack music "Upbeat lo-fi hip hop beat, warm piano, vinyl crackle, 90 BPM" --model mureka-bgm

# Check cost first
fairstack music "Epic orchestral soundtrack" --model suno-generate --estimate

# Compare models
fairstack compare music "Chill acoustic guitar" --models mureka-bgm,suno-generate
```

## Quick Start (curl)

```bash
curl -s -X POST https://fairstack.ai/v1/music/generate \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Upbeat lo-fi hip hop beat, warm piano, vinyl crackle",
    "model": "mureka-bgm"
  }'
```

## API Reference

**`POST /v1/music/generate`**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Description of the music |
| `model` | string | No | Model ID |
| `duration` | number | No | Duration in seconds |
| `lyrics` | string | No | Lyrics for vocal tracks |
| `tags` | string | No | Style tags |
| `instrumental` | boolean | No | Instrumental only |
| `confirm` | boolean | No | `false` for cost quote |

## Examples

### Background Music

```bash
fairstack music "Calm lo-fi hip hop, warm piano chords, soft drums, vinyl crackle, 85 BPM" --model mureka-bgm
```

### Full Song with Lyrics

```bash
fairstack music "Pop song about summer adventures" --model mureka-v8 --lyrics "Walking down the shore with sand between my toes, sun is shining bright and everybody knows"
```

### Podcast Intro Jingle

```bash
fairstack music "Short upbeat podcast intro, tech themed, modern synths, 10 seconds" --model mureka-bgm --duration 10
```

### Game Soundtrack

```bash
fairstack music "Epic fantasy RPG battle theme, orchestral with drums and choir" --model suno-generate
```

### Stem Separation (Isolate Vocals)

```bash
curl -s -X POST https://fairstack.ai/v1/music/generate \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "suno-stem-separation", "audio_url": "https://example.com/song.mp3"}'
```

### Generate Lyrics

```bash
curl -s -X POST https://fairstack.ai/v1/music/generate \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write lyrics for an upbeat pop song about coding all night", "model": "suno-lyrics"}'
```

## Prompt Tips

**Genre:** pop, rock, electronic, jazz, classical, hip-hop, lo-fi, ambient, orchestral, R&B, folk, country, metal
**Mood:** happy, sad, energetic, calm, dramatic, epic, mysterious, uplifting, melancholic, aggressive
**Instruments:** piano, guitar, synth, drums, strings, brass, choir, bass, violin, saxophone
**Structure:** intro, verse, chorus, bridge, outro, loop

## Error Handling

| Error | Meaning | Fix |
|-------|---------|-----|
| `validation_error` | Missing/invalid params | Check prompt and model |
| `insufficient_credits` | Balance too low | Add credits |
| `provider_unavailable` | Model temporarily down | Try different model |

## Tips

- **Music generation is slow.** Takes 1-3 minutes. The CLI polls automatically.
- **Be specific about genre, tempo, instruments.** More detail = better results.
- **Use `--estimate` before generating.** Check cost first.
- **Combine with voice.** Generate music, then layer speech on top for podcast-style content.
- **Check available models.** `fairstack models --modality music` shows all music models and pricing.

## Pricing

All prices = infrastructure cost + 20% margin. Run `fairstack models --modality music` for current pricing.

## Related Skills

- `fairstack/skills@ai-voice-generation` — Add narration over music
- `fairstack/skills@ai-video-generation` — Create music videos
- `fairstack/skills@cost-estimator` — Estimate before generating
