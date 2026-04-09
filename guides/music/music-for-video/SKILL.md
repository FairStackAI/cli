---
name: music-for-video
description: "Generate AI background music for videos via FairStack. Covers mood matching, duration control, genre selection, combining music with video narration. Use for: video background music, YouTube videos, social media content, ads, presentations, podcasts. Triggers: music for video, background music, video music, soundtrack, video score, youtube music, social media music, ad music, presentation music, video soundtrack"
---

# Music for Video

Generate background music matched to your video content. Covers mood selection, duration control, and combining with narration.

## Quick Match Guide

| Video Type | Prompt Template | Suggested Model |
|-----------|----------------|----------------|
| Product demo | "Clean modern electronic, subtle, professional, [duration]s" | mureka-bgm |
| Tutorial | "Calm lo-fi, warm piano, soft, background, [duration]s" | mureka-bgm |
| Social media | "Upbeat pop, energetic, catchy, trendy, [duration]s" | mureka-bgm |
| Corporate | "Professional ambient, subtle strings, clean, [duration]s" | mureka-bgm |
| Dramatic | "Epic orchestral, cinematic, building intensity" | suno-generate |
| Podcast intro | "Short jingle, modern, professional, 8 seconds" | mureka-bgm |

## Examples

### YouTube Intro (10s)

```bash
fairstack music "Short energetic YouTube intro jingle, modern synths, upbeat, 10 seconds" \
  --model mureka-bgm --duration 10
```

### Background for Tutorial (2min)

```bash
fairstack music "Calm lo-fi hip hop, warm piano chords, soft drums, background music, 120 seconds" \
  --model mureka-bgm --duration 120
```

### Product Ad (30s)

```bash
fairstack music "Upbeat modern electronic, clean, professional, building energy, 30 seconds" \
  --model mureka-bgm --duration 30
```

### Epic Trailer

```bash
fairstack music "Cinematic orchestral trailer music, drums building, brass crescendo, epic" \
  --model suno-generate
```

## Mood-to-Genre Mapping

| Mood | Genre | Instruments |
|------|-------|-------------|
| Professional | Ambient/Corporate | Soft synths, piano, subtle strings |
| Energetic | Pop/Electronic | Synths, drums, bass, upbeat |
| Calm | Lo-fi/Ambient | Piano, soft guitar, vinyl, pads |
| Dramatic | Orchestral | Strings, brass, timpani, choir |
| Fun | Pop/Funk | Guitar, bass, drums, keys |
| Mysterious | Dark ambient | Low drones, sparse piano, reverb |

## Duration Tips

- **Short (5-15s):** Intros, outros, transitions. Use `--duration`.
- **Medium (30-60s):** Ads, social media. Match video length exactly.
- **Long (2-5min):** Tutorials, presentations. Background mood consistency.

## Combining Music with Narration

```bash
# 1. Generate narration
fairstack voice "Your script here" --model chatterbox-turbo

# 2. Generate background music (same duration as narration)
fairstack music "Calm ambient background, subtle, not distracting" --model mureka-bgm

# 3. Mix in your video editor (music at ~20% volume under voice)
```

## Cost Planning

```bash
# Check current music model pricing
fairstack models --modality music

# Estimate cost for a specific generation
fairstack music "test" --model mureka-bgm --estimate
```

Music generation is flat-rate per generation, regardless of duration.

## Related Skills

- `fairstack/skills@ai-music-generation` — Full music generation reference
- `fairstack/skills@ai-voice-generation` — Voice narration
- `fairstack/skills@ai-video-generation` — Video generation
