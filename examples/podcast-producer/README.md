# Podcast Producer

Generate a podcast intro with AI voice narration and background music, then combine them with ffmpeg. This shows how FairStack handles multi-modal workflows where the output of one generation feeds into the next.

## What It Does

1. Browses the voice library to find the right narrator
2. Generates voice narration of the intro script
3. Generates instrumental background music
4. Combines voice + music with ffmpeg (voice at full volume, music at 20%)
5. Outputs a ready-to-use podcast intro audio file

## Usage

```bash
# Test without spending credits
FAIRSTACK_DRY_RUN=1 npx tsx examples/podcast-producer/produce.ts

# Generate for real
npx tsx examples/podcast-producer/produce.ts
```

## Prerequisites

- `fairstack` CLI installed
- `ffmpeg` installed (for audio mixing)
- FairStack API key configured

## Output

```
Podcast Intro Producer
Show: The Developer's Edge

[1/4] Browsing voice library...
      Found 168 voices. Using: internal_marco (warm narrator)

[2/4] Generating narration...
      Script: "Welcome to The Developer's Edge..."
      https://media.fairstack.ai/voice/...

[3/4] Generating background music...
      Style: ambient lo-fi, warm and inviting
      https://media.fairstack.ai/music/...

[4/4] Mixing with ffmpeg...
      Voice:  narration.mp3 (100% volume)
      Music:  music.mp3 (20% volume, fade out)
      Output: podcast-intro.mp3

Done.
  Total cost: $0.132
```

## Customization

- Browse voices with `fairstack voices --archetype narrator` to find your ideal host
- Change the music model to `suno-generate` for longer or vocal tracks
- Adjust the ffmpeg mix ratio in the script
