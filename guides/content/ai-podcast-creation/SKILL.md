---
name: ai-podcast-creation
description: "Create full podcast episodes with AI voice, music, and sound via FairStack. Covers scripting, multi-voice, music, production. Triggers: podcast creation, create podcast, ai podcast, podcast generation, podcast production, podcast episode"
---

# AI Podcast Creation

See the dedicated podcast guide: `fairstack/skills@voice/ai-podcast-with-voice`

That guide covers single-host, two-host, music integration, scripting, and cost planning.

## Quick Start

```bash
# Intro jingle
fairstack music "Podcast intro, 8 seconds, modern" --model mureka-bgm

# Host narration
fairstack voice "Welcome to the show..." --model chatterbox-turbo

# Outro
fairstack music "Podcast outro, 10 seconds" --model mureka-bgm
```

## Related Skills

- `fairstack/skills@voice/ai-podcast-with-voice` — Full podcast guide
- `fairstack/skills@ai-voice-generation` — Voice models
- `fairstack/skills@ai-music-generation` — Music generation
