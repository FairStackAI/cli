# FairStack Skills

Skills for Claude Code that let AI agents generate images, video, voice, music, and more via the FairStack API and CLI.

## Principle: No Hardcoded Data

Skills contain workflow patterns, command syntax, and best practices. **All model catalogs, pricing, and counts come from the live API.** Nothing is hardcoded.

```bash
# Get live model catalog and pricing
fairstack models --modality image
fairstack models --modality video
fairstack models --modality voice
fairstack models --modality music
fairstack models --modality talkingHead

# Get model details (pricing, parameters, capabilities)
fairstack models --detail flux-schnell

# Browse voice library
fairstack voices

# Check cost before generating
fairstack estimate image "prompt" --model flux-schnell
```

## Structure

```
skills/
├── packages/cli/              # FairStack CLI (npm: fairstack)
├── tools/                     # 11 core tool skills
│   ├── ai-image-generation/   # Image generation (all models)
│   ├── ai-video-generation/   # Video generation (all models)
│   ├── ai-voice-generation/   # Voice generation (all models + voice library)
│   ├── ai-music-generation/   # Music generation (all models)
│   ├── ai-talking-head/       # Talking head generation (all models)
│   ├── smart-router/          # AI-powered model selection
│   ├── compare-models/        # Side-by-side model comparison
│   ├── cost-estimator/        # Per-request cost estimation
│   ├── style-explore/         # Style Explorer — prompts x styles x models grid
│   ├── video-pipeline/        # Video Pipeline — scenes to finished video
│   └── voice-library/         # Voice library — browse, filter
├── models/                    # Per-model skills
├── guides/                    # 41 workflow guides
│   ├── design/                # Thumbnails, logos, covers, OG images, etc.
│   ├── content/               # Pipelines, repurposing, automation
│   ├── photo/                 # Product photography
│   ├── product/               # Competitor teardown, personas, PH launch
│   ├── prompting/             # Image & video prompt engineering
│   ├── social/                # Carousels, LinkedIn, Twitter, general
│   ├── video/                 # Marketing, explainer, storyboard, ads
│   ├── voice/                 # Voiceover, podcast production
│   ├── music/                 # Music for video
│   ├── writing/               # Blog, SEO, case study, newsletter, PR
│   ├── workflow/              # Multi-modal, batch generation
│   └── developer/             # API integration guide
└── tests/smoke/               # Production smoke test results
```

**Total: 85 skills** (11 tools + 41 guides + 33 models)

## CLI

The `fairstack` CLI is the recommended way to use FairStack. Install with `npm install -g fairstack`.

```bash
fairstack image "prompt" --model flux-schnell     # Generate image
fairstack video "prompt" --model vidu-q3-turbo    # Generate video
fairstack voice "text" --model chatterbox-turbo   # Generate speech
fairstack music "prompt" --model mureka-bgm       # Generate music
fairstack talking-head --image-url X --audio-url Y # Talking head
fairstack models --modality image                  # List models + pricing
fairstack models --detail flux-schnell             # Model details + params
fairstack voices --archetype narrator              # Browse voices
fairstack compare image "prompt" --models a,b,c   # Compare models
fairstack estimate image "prompt" --model X        # Cost estimate
fairstack select-model "task description"          # AI model selection
fairstack balance                                  # Check credits
fairstack status {generation-id}                   # Check status
```

## API Base URL

Production: `https://fairstack.ai`

## Auth

All generation endpoints require: `Authorization: Bearer fs_live_xxx`
Public endpoints (models, voices, docs): no auth needed.
