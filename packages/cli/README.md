# FairStack CLI

Multi-modal AI generation from the terminal. One tool for images, video, voice, music, and talking heads.

[![npm version](https://img.shields.io/npm/v/fairstack.svg)](https://www.npmjs.com/package/fairstack)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)

Most AI generation tools cover one modality. FairStack covers five -- and chains them into real workflows. Generate a character portrait, voice a script, animate a talking head, add background music, and composite a finished video. All from a single CLI, with cost transparency on every generation.

## Install

```bash
npm install -g fairstack
```

Requires Node.js 18+.

## Quick Start

### Authentication

Get your API key at [fairstack.ai/app/api-keys](https://fairstack.ai/app/api-keys).

```bash
# Option 1: interactive login (saves to ~/.fairstack/config.json)
fairstack login

# Option 2: environment variable
export FAIRSTACK_API_KEY=fs_live_xxxxx
```

### Generate an Image

```bash
fairstack image "a mountain cabin at sunrise, oil painting style" --model flux-schnell
```

```
https://media.fairstack.ai/image/.../output.png

Status:  succeeded
Model:   flux-schnell
Type:    image
Cost:    $0.003
Time:    1.2s
ID:      gen_abc123
```

### Generate a Video

```bash
fairstack video "a timelapse of clouds over a city skyline" --model vidu-q3-turbo
```

### Generate Voice

```bash
fairstack voice "Welcome to the future of AI generation." \
  --model chatterbox-turbo \
  --voice internal_marco
```

### Generate Music

```bash
fairstack music "upbeat lo-fi chill hop, perfect for a coding session" \
  --model mureka-bgm \
  --duration 30
```

### Create a Talking Head

```bash
fairstack talking-head \
  --image-url https://example.com/portrait.png \
  --audio-url https://example.com/narration.wav \
  --model musetalk-1.5
```

## Commands

### Generation

| Command | Description |
|---------|-------------|
| `fairstack image <prompt>` | Generate an image from a text prompt |
| `fairstack video <prompt>` | Generate a video from a text prompt |
| `fairstack voice <text>` | Generate speech from text |
| `fairstack music <prompt>` | Generate music from a text prompt |
| `fairstack talking-head` | Generate a talking head video from an image and audio |

### Discovery

| Command | Description |
|---------|-------------|
| `fairstack models` | List all models across all modalities with pricing |
| `fairstack models --modality image` | Filter models by modality |
| `fairstack models --detail flux-schnell` | Get parameters and details for a specific model |
| `fairstack voices` | Browse the voice library (168 voices) |
| `fairstack voices --gender female --archetype narrator` | Filter voices |

### Utility

| Command | Description |
|---------|-------------|
| `fairstack estimate <modality> <prompt>` | Get a cost estimate without spending credits |
| `fairstack compare <modality> <prompt> --models a,b` | Run the same prompt across 2-4 models side-by-side |
| `fairstack select-model <task>` | AI-powered model recommendation for your task |
| `fairstack balance` | Check your credit balance and spending |
| `fairstack status <id>` | Check the status of any generation |
| `fairstack login` | Store your API key |

### Reel Pipeline

| Command | Description |
|---------|-------------|
| `fairstack reel character create` | Generate and save a character portrait |
| `fairstack reel character list` | List saved characters |
| `fairstack reel voice select` | Save a voice from the library |
| `fairstack reel voice list` | List saved voices or browse the library |
| `fairstack reel create` | Run the full reel production pipeline |

Every generation command supports these flags:

| Flag | Description |
|------|-------------|
| `-m, --model <id>` | Model to use |
| `--estimate` | Show cost estimate without generating |
| `--raw` | Output full JSON response |
| `-w, --wait <seconds>` | Max seconds to wait for sync response |

## Workflows

### Cost Estimation

Check the price before you generate. No credits charged.

```bash
fairstack estimate image "a sunset over mountains" --model flux-schnell
```

```
Estimated cost: $0.0036
Quote ID:       qt_8f2a...
Expires in:     60s
```

Or use the `--estimate` flag on any generation command:

```bash
fairstack video "drone footage of a coastal highway" --model kling-3-0-std --estimate
```

### Model Comparison

Run the same prompt across multiple models and compare results, cost, and speed:

```bash
fairstack compare image "a photorealistic portrait of an astronaut" \
  --models flux-schnell,seedream-4.5-t2i,ideogram-3
```

```
Comparing 3 models for image: flux-schnell, seedream-4.5-t2i, ideogram-3

  Waiting for flux-schnell...
  Waiting for seedream-4.5-t2i...
  Waiting for ideogram-3...

============================================================
COMPARISON RESULTS
============================================================

--- flux-schnell ---
  URL:  https://media.fairstack.ai/image/.../output.png
  Cost: $0.003
  Time: 1.2s

--- seedream-4.5-t2i ---
  URL:  https://media.fairstack.ai/image/.../output.png
  Cost: $0.039
  Time: 4.8s

--- ideogram-3 ---
  URL:  https://media.fairstack.ai/image/.../output.png
  Cost: $0.050
  Time: 6.1s
```

### AI Model Selection

Not sure which model to use? Describe your task and get a recommendation:

```bash
fairstack select-model "product photo of a sneaker on a white background"
```

```
Recommended: FLUX.1 Schnell (flux-schnell)
Cost:        $0.003 image
Reasoning:   Best balance of speed and quality for general image generation.

Alternatives:
  Seedream 4.5 (seedream-4.5-t2i) — $0.039: Higher quality photorealism, 10x cost
```

### Reel Production Pipeline

The `reel` command chains multiple generation steps into a finished video. This is the full workflow:

**1. Create a character** -- generate and save a portrait:

```bash
fairstack reel character create \
  --name alex \
  --product myapp \
  --prompt "Professional headshot of a friendly tech CEO, neutral background, studio lighting"
```

**2. Select a voice** -- pick from the 168-voice library:

```bash
# Browse available voices
fairstack reel voice list --library

# Save one for your reel
fairstack reel voice select --name narrator --voice-id internal_marco
```

**3. Produce the reel** -- the pipeline handles the rest:

```bash
fairstack reel create \
  --character alex \
  --voice narrator \
  --script "Welcome to our product. We built this for developers who value speed and transparency." \
  --music "Upbeat corporate background, minimal, modern" \
  --captions \
  --format 9:16 \
  --output reel.mp4
```

What happens under the hood:

1. Loads the saved character portrait and voice profile
2. Generates narration audio from the script (voice API)
3. Animates the character portrait with the narration (talking head API)
4. Generates background music from your prompt (music API)
5. Composites everything with FFmpeg -- video + music + optional captions
6. Writes the final `.mp4` to your output path

```
=== FairStack Reel Pipeline ===

[1/5] Loading assets...
      Character: alex (myapp)
      Voice: narrator - qwen-3-tts (library)
[2/5] Generating narration (qwen-3-tts)...
      Cost: $0.012
[3/5] Generating talking head (musetalk-1.5)...
      Cost: $0.096
[4/5] Generating background music...
      Cost: $0.120
[5/5] Compositing final reel...

      Output: reel.mp4
      Format: 9:16 (1080x1920)
      Size: 12.4MB

  Total cost: $0.228
    Voice:        $0.012
    Talking head: $0.096
    Music:        $0.120
```

Use `--dry-run` to preview the pipeline without making API calls or spending credits:

```bash
fairstack reel create --character alex --voice narrator --script "..." --output reel.mp4 --dry-run
```

## For AI Agents

FairStack is designed as a tool for AI coding agents (Claude Code, Cursor, OpenAI agents, Devin, etc.). The CLI has a predictable interface, structured JSON output, and a dry-run mode for testing.

### Setup

Set the API key as an environment variable in your agent's environment:

```bash
export FAIRSTACK_API_KEY=fs_live_xxxxx
```

### JSON Output

Use `--raw` on any command to get the full JSON response, suitable for parsing:

```bash
fairstack image "a product mockup" --model flux-schnell --raw
```

### Dry-Run Mode

Set `FAIRSTACK_DRY_RUN=1` to intercept all API calls. The CLI prints the full request (method, URL, headers, body) as JSON and returns a mock response. No credits charged, no network calls made.

```bash
export FAIRSTACK_DRY_RUN=1
fairstack image "test prompt" --model flux-schnell
```

This is useful for:
- Validating that your agent builds correct CLI invocations
- Testing pipelines without spending credits
- CI/CD environments

### Tool Definition

If your agent framework needs a tool schema, here is the interface:

```
fairstack image <prompt> [-m model] [-a aspect-ratio] [-i image-url] [-n negative-prompt] [-s seed] [--estimate] [--raw]
fairstack video <prompt> [-m model] [-i image-url] [-v video-url] [-d duration] [-a aspect-ratio] [--estimate] [--raw]
fairstack voice <text>   [-m model] [--voice id] [--ref-audio url] [--speed factor] [-l language] [-e emotion] [--estimate] [--raw]
fairstack music <prompt> [-m model] [-d duration] [--lyrics text] [--tags tags] [--instrumental] [--estimate] [--raw]
fairstack talking-head   [-m model] -i <image-url> -a <audio-url> [--estimate] [--raw]
fairstack models         [-t modality] [--detail id] [--raw]
fairstack voices         [-g gender] [-a archetype] [-l language] [-s search] [--raw]
fairstack estimate <modality> [prompt] [-m model] [--raw]
fairstack compare <modality> <prompt> --models a,b[,c,d] [--raw]
fairstack select-model <task> [-t modality] [--raw]
fairstack balance        [--raw]
fairstack status <id>    [--raw]
```

## Browse Models and Voices

### Models

80+ models across five modalities:

```bash
# All models
fairstack models

# By modality
fairstack models --modality image
fairstack models --modality video
fairstack models --modality voice
fairstack models --modality music
fairstack models --modality talkingHead

# Detailed info for a specific model
fairstack models --detail flux-schnell
```

### Voices

168 voices with filtering:

```bash
# Full library
fairstack voices

# Filter by gender, archetype, language, or search
fairstack voices --gender female
fairstack voices --archetype narrator
fairstack voices --language es
fairstack voices --search "warm"
```

## Configuration

### Config File

```
~/.fairstack/config.json
```

Created by `fairstack login`. Stored with `0600` permissions.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FAIRSTACK_API_KEY` | API key (overrides config file) | -- |
| `FAIRSTACK_BASE_URL` | API base URL | `https://fairstack.ai` |
| `FAIRSTACK_DRY_RUN` | Set to `1` for dry-run mode (no API calls) | -- |

### Reel Assets

Character portraits and voice profiles are stored locally:

```
~/.fairstack/reel/characters/   # Character JSON profiles + portrait images
~/.fairstack/reel/voices/       # Voice JSON profiles
~/.fairstack/reel/tmp/          # Temporary files during reel creation
```

## Links

- **Website:** [fairstack.ai](https://fairstack.ai)
- **API Keys:** [fairstack.ai/app/api-keys](https://fairstack.ai/app/api-keys)
- **Pricing:** [fairstack.ai/pricing](https://fairstack.ai/pricing)
- **Documentation:** [fairstack.ai/docs](https://fairstack.ai/docs)
- **GitHub:** [github.com/fairstackai/cli](https://github.com/fairstackai/cli)

## License

MIT
