---
name: ai-podcast-with-voice
description: "Create AI podcasts with FairStack voice generation and voice library. Covers single-host, interview format, intro/outro music, script writing. Triggers: ai podcast, podcast creation, podcast voice, podcast generation, create podcast, podcast episode, podcast production, automated podcast"
---

# AI Podcast Production

Create podcast episodes using AI voice generation and music.

## Single Host Podcast

```bash
# 1. Intro music
fairstack music "Professional podcast intro jingle, modern, 8 seconds" --model mureka-bgm

# 2. Host narration (split into segments)
fairstack voice "Welcome to Tech Today. I am your host. In this episode, we explore the latest developments in AI generation." \
  --model chatterbox-turbo

fairstack voice "First up, let us talk about the revolution in image generation. Models like FLUX and Seedream have made it possible to create photorealistic images for less than a penny." \
  --model chatterbox-turbo

fairstack voice "That is all for today. Thank you for listening. If you enjoyed this episode, please subscribe." \
  --model chatterbox-turbo

# 3. Outro music
fairstack music "Calm podcast outro, 10 seconds" --model mureka-bgm
```

## Two-Host Format

Use different voices from the library:

```bash
# Browse voices
fairstack voices --archetype conversational

# Host A
fairstack voice "So what do you think about the latest AI developments?" \
  --model chatterbox-turbo --voice system_voice_burt

# Host B
fairstack voice "I think we are at an inflection point. The cost of generation has dropped dramatically." \
  --model chatterbox-turbo --voice internal_marco
```

## Cost Planning

Use `--estimate` to plan episode cost:

```bash
fairstack voice "your segment text" --model chatterbox-turbo --estimate
fairstack music "test" --model mureka-bgm --estimate
```

Multiply the per-segment voice cost by the number of segments, then add music.

## Script Writing Tips

- Write for the ear: short sentences, conversational tone
- Include pauses (use periods and commas)
- Spell out numbers and abbreviations
- Keep segments under 200 words for natural delivery

## Related Skills

- `fairstack/skills@ai-voice-generation` — Voice models
- `fairstack/skills@voice-library` — Browse voices
- `fairstack/skills@ai-music-generation` — Intro/outro music
