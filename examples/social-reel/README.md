# Social Reel

Create a complete social media reel using the FairStack reel pipeline. This demonstrates the full workflow: creating a character, selecting a voice, and producing a talking-head video with background music and captions.

## What It Does

1. Creates a character portrait (AI-generated presenter)
2. Selects a voice from the FairStack voice library
3. Generates a complete reel — voice narration, talking head, background music, captions
4. Outputs a ready-to-post video file

## Usage

```bash
# Dry run first — see the full pipeline without spending credits
bash examples/social-reel/create-reel.sh --dry-run

# Full production run
bash examples/social-reel/create-reel.sh
```

## Pipeline

```
Character portrait ──┐
                     ├── Talking Head ──┐
Voice narration ─────┘                  ├── FFmpeg composite ── reel.mp4
Background music ───────────────────────┘
```

## Reel Pipeline Commands

The FairStack CLI has a dedicated `reel` subcommand for video production:

```bash
# Create a character (one-time, saved locally)
fairstack reel character create --name alex --product demo --prompt "..."

# Select a voice (one-time, saved locally)
fairstack reel voice select --name narrator --voice-id internal_marco

# Browse available voices
fairstack reel voice list --library

# Generate the reel
fairstack reel create \
  --character alex \
  --voice narrator \
  --script "Your narration text..." \
  --output reel.mp4 \
  --music "upbeat corporate background" \
  --captions
```

## Prerequisites

- `fairstack` CLI installed (`npm install -g fairstack`)
- `ffmpeg` installed (used for final compositing)
- FairStack API key configured
