# FairStack Skills

AI generation skills for developers and AI agents. Generate images, video, voice, music, and talking-head videos via the [FairStack](https://fairstack.ai) API.

This repo contains **85 skills** -- ready-to-use workflows, model-specific guides, and the `fairstack` CLI.

## What's Inside

```
packages/cli/    FairStack CLI (npm: fairstack)
tools/           11 core tool skills (generation, comparison, routing, cost estimation)
guides/          41 workflow guides (design, content, video, voice, music, prompting, ...)
models/          33 model-specific skills (one per supported AI model)
tests/           Validation and smoke tests
```

### CLI

The `fairstack` CLI is the fastest way to generate from your terminal.

```bash
npm install -g fairstack
```

```bash
fairstack image "A mountain cabin at sunrise" --model flux-schnell
fairstack video "Timelapse of clouds over a city" --model vidu-q3-turbo
fairstack voice "Welcome to the future." --model chatterbox-turbo
fairstack music "Lo-fi chill hop for coding" --model mureka-bgm
fairstack talking-head --image-url IMG --audio-url AUDIO --model musetalk-1.5
```

See [`packages/cli/README.md`](packages/cli/README.md) for full documentation.

### Tool Skills

| Skill | Description |
|-------|-------------|
| `ai-image-generation` | Image generation across all models |
| `ai-video-generation` | Video generation (text-to-video, image-to-video) |
| `ai-voice-generation` | Text-to-speech with 168+ voices |
| `ai-music-generation` | Music and sound generation |
| `ai-talking-head` | Talking-head video from portrait + audio |
| `smart-router` | AI-powered model selection for any task |
| `compare-models` | Side-by-side model comparison |
| `cost-estimator` | Per-request cost estimation |
| `style-explore` | Style Explorer -- prompts x styles x models grid |
| `video-pipeline` | Multi-step video production pipeline |
| `voice-library` | Browse, filter, and preview voices |

### Workflow Guides

Guides cover end-to-end workflows organized by domain:

- **design/** -- Thumbnails, logos, covers, OG images
- **content/** -- Content pipelines, repurposing, automation
- **video/** -- Marketing videos, explainers, storyboards, ads
- **voice/** -- Voiceover production, podcast audio
- **music/** -- Background music for video
- **photo/** -- Product photography
- **prompting/** -- Image and video prompt engineering
- **social/** -- Carousels, LinkedIn, Twitter content
- **product/** -- Competitor teardown, personas, launch materials
- **writing/** -- Blog posts, SEO, case studies, newsletters
- **workflow/** -- Multi-modal generation, batch processing
- **developer/** -- API integration patterns

### Model Skills

Each supported model has a dedicated skill with parameters, pricing, best-use-cases, and example commands. See `models/` for the full list.

## Authentication

Get your API key at [fairstack.ai/app/api-keys](https://fairstack.ai/app/api-keys).

```bash
# CLI login
fairstack login

# Or set the environment variable
export FAIRSTACK_API_KEY=fs_live_xxxxx
```

Public endpoints (models, voices) require no authentication.

## Contributing

### Structure

Each skill is a `SKILL.md` file following a consistent format:

```
skills/<category>/<skill-name>/SKILL.md
```

Skills contain workflow patterns, command syntax, and best practices. All model catalogs, pricing, and voice counts come from the live API -- nothing is hardcoded.

### Development

```bash
# Build the CLI
cd packages/cli
npm install
npm run build

# Run in development mode
npm run dev -- image "test prompt"

# Run the test suite (validates all skill examples)
cd ../../tests
bun validate-skills.ts
```

### Guidelines

1. **No hardcoded data.** Model names, pricing, and counts must come from the API.
2. **Test your examples.** Every code block in a SKILL.md should work with `FAIRSTACK_DRY_RUN=1`.
3. **Keep skills focused.** One skill per workflow or model. Compose skills for complex pipelines.

## Links

- Website: [fairstack.ai](https://fairstack.ai)
- Documentation: [fairstack.ai/docs](https://fairstack.ai/docs)
- Pricing: [fairstack.ai/pricing](https://fairstack.ai/pricing)

## License

MIT -- see [`packages/cli/LICENSE`](packages/cli/LICENSE).
