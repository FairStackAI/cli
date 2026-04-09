---
name: video-pipeline
description: "Produce finished narrated videos from a sequence of scenes via FairStack. One API call: submit scenes with images/text/audio at any mix of detail levels, get back a composed video with voiceover, text overlays, transitions, and optional background music. Three input levels per scene (provide everything, provide images + narration text, provide text descriptions only). Per-scene tracking, partial failure recovery, scene-level retry. Use for: daily video series, narrated explainers, history videos, educational content, news recaps, automated video production, content pipelines, script-to-video, multi-scene video, video automation, batch video. Triggers: video pipeline, scene video, narrated video, multi-scene, script to video, compose video, daily video, video series, video from scenes, stitch video, video with voiceover, automated video, content pipeline video, pipeline api"
---

# Video Pipeline

One API call takes a sequence of scenes and produces a finished video with voiceover, text overlays, transitions, and optional background music. No FFmpeg. No orchestrating 4 services. One request, one video URL back.

**The problem it solves:** Producing a narrated multi-scene video today requires N image generation calls + N voice generation calls + local FFmpeg stitching + uploading the result. The Video Pipeline replaces all of that with a single POST. Submit your scenes, poll for progress, get a video URL.

**Real-world example:** TodayIn History generates 366 daily videos (one per day of the year). Each video: 5 historical event scenes, cinematic images, narrated voiceover, text overlays. One API call per video. ~$1-2 each.

## Three Input Levels

Every scene declares what you provide. The pipeline generates the rest. Mix levels freely within one request.

| Level | You provide | Pipeline generates |
|-------|-------------|--------------------|
| **Level 1** Full control | `image_url` + `voiceover_url` | Composes only |
| **Level 2** Voice generated | `image_url` + `narration` text | TTS voice, then composes |
| **Level 3** Zero to video | `description` + `narration` text | Image + TTS voice, then composes |

Scene 1 can be Level 1 (you supply everything), Scene 3 can be Level 3 (text only). The pipeline handles each independently.

## Quick Start (CLI)

```bash
# Install
npm install -g fairstack

# 3-scene video from text descriptions (Level 3)
fairstack video-pipeline \
  --scenes '[
    {"description": "Luna 1 spacecraft launching from Baikonur Cosmodrome, 1959", "narration": "On January 2, 1959, the Soviet Union launched Luna 1, the first spacecraft to reach the vicinity of the Moon.", "text_overlay": "January 2, 1959"},
    {"description": "Luna 1 passing near the surface of the Moon, deep space", "narration": "It missed the Moon by about 6,000 kilometers, but proved that interplanetary travel was possible.", "text_overlay": "First Lunar Flyby"},
    {"description": "Luna 1 drifting into solar orbit, becoming the first artificial planet", "narration": "Luna 1 entered orbit around the Sun, where it remains to this day — the first artificial planet.", "text_overlay": "First Artificial Planet"}
  ]' \
  --voice internal_marco \
  --image-model gpt-image-1.5-t2i \
  --search-prompt

# Poll results (CLI polls automatically, but if you need to check manually)
fairstack video-pipeline status vp_abc123

# Retry failed scenes
fairstack video-pipeline retry vp_abc123 --scenes 1,2
```

## Quick Start (curl)

```bash
# Submit pipeline
curl -X POST https://fairstack.ai/v1/video-pipeline \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "scenes": [
      {
        "description": "Luna 1 spacecraft launching from Baikonur Cosmodrome, 1959",
        "narration": "On January 2, 1959, the Soviet Union launched Luna 1, the first spacecraft to reach the vicinity of the Moon.",
        "style": "Cinematic still, deep amber and gold lighting, honey-amber color grading",
        "text_overlay": "January 2, 1959",
        "animation": "ken_burns"
      },
      {
        "description": "Luna 1 passing near the surface of the Moon, deep space",
        "narration": "It missed the Moon by about 6,000 kilometers, but proved that interplanetary travel was possible.",
        "text_overlay": "First Lunar Flyby",
        "animation": "zoom_in"
      },
      {
        "description": "Luna 1 drifting into solar orbit, becoming the first artificial planet",
        "narration": "Luna 1 entered orbit around the Sun, where it remains to this day — the first artificial planet.",
        "text_overlay": "First Artificial Planet",
        "animation": "pan_right"
      }
    ],
    "voice": "internal_marco",
    "image_model": "gpt-image-1.5-t2i",
    "search_prompt": true,
    "transition": "cross_dissolve",
    "output": { "format": "mp4", "resolution": "1080p" }
  }'

# Response (202 Accepted):
# {
#   "data": {
#     "pipeline_id": "vp_abc123",
#     "status": "pending",
#     "estimated_cost": {
#       "total_usd": 0.73,
#       "breakdown": {
#         "image_generation": { "scenes": [0, 1, 2], "total_usd": 0.21 },
#         "voice_generation": { "scenes": [0, 1, 2], "total_usd": 0.006 },
#         "search": { "queries": 3, "total_usd": 0.027 },
#         "composition": { "total_usd": 0.16 }
#       },
#       "credits_micro": 730000
#     },
#     "scenes": 3,
#     "poll_url": "/v1/video-pipeline/vp_abc123"
#   }
# }

# Poll for progress
curl https://fairstack.ai/v1/video-pipeline/vp_abc123 \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY"

# Response shows per-scene status:
# {
#   "data": {
#     "pipeline_id": "vp_abc123",
#     "status": "generating",
#     "progress": 40,
#     "current_phase": "generating",
#     "scenes": [
#       { "index": 0, "status": "completed", "image_url": "https://...", "voiceover_url": "https://...", "duration": 7.2 },
#       { "index": 1, "status": "generating_voice", "image_url": "https://..." },
#       { "index": 2, "status": "generating_image" }
#     ],
#     "cost": { "incurred_usd": 0.22, "estimated_total_usd": 0.73 },
#     "video_url": null
#   }
# }

# Final response when complete:
# {
#   "data": {
#     "pipeline_id": "vp_abc123",
#     "status": "completed",
#     "progress": 100,
#     "video_url": "https://media.fairstack.ai/video/vp_abc123/output.mp4",
#     "scenes": [ ... ],
#     "cost": { "incurred_usd": 0.71, "estimated_total_usd": 0.73 },
#     "started_at": "2026-03-22T10:00:00Z",
#     "completed_at": "2026-03-22T10:02:34Z"
#   }
# }

# Retry failed scenes (only re-runs what failed)
curl -X POST https://fairstack.ai/v1/video-pipeline/vp_abc123/retry \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "scenes": [1] }'
```

## API Reference

### POST /v1/video-pipeline

Submit a scene sequence. Returns a pipeline ID and cost estimate.

**Scene fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image_url` | string | No | Pre-made image URL. If omitted, `description` is required. |
| `voiceover_url` | string | No | Pre-made audio URL. If omitted, `narration` is required for voice gen. |
| `description` | string | No | Text prompt for image generation. Required when no `image_url`. |
| `narration` | string | No | Text for TTS generation. Required when no `voiceover_url`. |
| `style` | string | No | Style suffix appended to the image generation prompt. |
| `duration` | number | No | Scene duration in seconds. Default: auto (narration audio length + 0.5s pad). |
| `text_overlay` | string | No | Text burned onto the video frame. |
| `text_overlay_position` | enum | No | `top`, `center`, `bottom`. Default: `bottom`. |
| `animation` | enum | No | `ken_burns`, `pan_left`, `pan_right`, `zoom_in`, `zoom_out`, `static`. Default: `ken_burns`. |

**Top-level fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `scenes` | array | Yes | 1-50 scenes. |
| `voice` | string | No | Voice ID for TTS. Required if any scene uses `narration`. Browse with `GET /v1/voices`. |
| `image_model` | string | No | Default image model for scenes with `description`. Default: `gpt-image-1.5-t2i`. |
| `search_prompt` | boolean | No | Web search grounding for image prompts. Runs once per unique description. Default: false. |
| `music_url` | string | No | Background music audio URL. Mixed at `music_volume`. |
| `music_volume` | number | No | 0.0-1.0. Default: 0.15. |
| `transition` | enum | No | `cut`, `cross_dissolve`, `fade_black`. Default: `cut`. Applied between all scenes. |
| `output.format` | enum | No | `mp4` (default), `webm`. |
| `output.resolution` | enum | No | `720p`, `1080p` (default), `4k`. |
| `output.aspect_ratio` | enum | No | `16:9` (default), `9:16`, `1:1`. |
| `output.fps` | number | No | 24, 30 (default), 60. |
| `webhook_url` | string | No | POST notification on completion/failure. |
| `idempotency_key` | string | No | Dedup key. Same key within 24h returns existing pipeline_id. |

### GET /v1/video-pipeline/{pipeline_id}

Poll for progress. Returns per-scene status, asset URLs, cost tracking, and the final video URL when complete.

**Scene statuses:** `pending` -> `generating_image` -> `generating_voice` -> `completed` | `failed`

**Pipeline statuses:** `pending` -> `generating` -> `composing` -> `completed` | `failed`

### POST /v1/video-pipeline/{pipeline_id}/retry

Retry failed scenes without re-running successful ones. Triggers a new composition with all scenes (original successes + retried scenes).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `scenes` | number[] | No | Scene indices to retry. Omit to retry all failed scenes. |

**Headers:** All endpoints require `Authorization: Bearer $FAIRSTACK_API_KEY`

## How It Works

```
POST /v1/video-pipeline
  -> Validate scenes, estimate cost, deduct credits
  -> Return pipeline_id (202 Accepted)

Phase 1: GENERATE (parallel, 8 scenes at a time)
  For each scene:
    - No image_url? Generate image (+ web search if search_prompt)
    - No voiceover_url? Generate TTS from narration text
    - Upload assets to R2

Phase 2: COMPOSE
  - Gather all scene assets (images, audio, overlays, timings)
  - Apply animation (ken burns / pan / zoom) to each image
  - Apply transitions between scenes
  - Mix background music if provided
  - Render final video via Remotion
  - Upload to R2

Phase 3: FINALIZE
  - Reconcile cost (refund delta if actual < estimate)
  - Fire webhook if configured
  - Return video URL
```

Animation is Ken Burns / pan / zoom (image-based motion), not full image-to-video model generation. This keeps each scene at ~$0.01-0.07 instead of ~$0.26+ for i2v.

## Cost Estimation

Cost depends on what each scene needs. Use `fairstack estimate` for current per-model pricing -- nothing is hardcoded here.

```bash
# Check current image model pricing
fairstack estimate image "test" --model gpt-image-1.5-t2i

# Check current voice pricing
fairstack estimate voice "test narration" --model chatterbox-turbo

# The pipeline POST response includes a full cost breakdown before work begins
```

**What gets charged per scene:**
- **Image generation** (Level 3 only): depends on `image_model`
- **TTS generation** (Level 2 and 3): depends on narration length and voice model
- **Search grounding** (if `search_prompt: true`): per unique scene description

**Global charges:**
- **Composition**: base cost + per-scene compute
- **Platform fee**: 20% on total infrastructure cost

**Ballpark for a 5-scene Level 3 video** (text descriptions + narration, GPT Image 1.5, search enabled): ~$0.70-1.50 total. Run `fairstack estimate` for exact current pricing.

## Examples

### Daily History Video (TIH Pattern)

5 historical events with existing images. Voice generated from narration text (Level 2).

```bash
fairstack video-pipeline \
  --scenes '[
    {"image_url": "https://media.todayinhistory.app/events/1959-cuban-revolution.webp", "narration": "On January 1st, 1959, Fidel Castro marched into Havana. Batista had fled at midnight with 300 million dollars in stolen money.", "text_overlay": "1959", "duration": 12},
    {"image_url": "https://media.todayinhistory.app/events/1863-emancipation.webp", "narration": "The Emancipation Proclamation took effect. It freed no one on the morning it was signed. Not one person.", "text_overlay": "1863", "duration": 12},
    {"image_url": "https://media.todayinhistory.app/events/1801-ceres.webp", "narration": "Giuseppe Piazzi discovered Ceres, the largest object in the asteroid belt. He thought it was a comet.", "text_overlay": "1801", "duration": 10},
    {"image_url": "https://media.todayinhistory.app/events/1502-brazil.webp", "narration": "Portuguese explorers sailed into Guanabara Bay and named it Rio de Janeiro — River of January.", "text_overlay": "1502", "duration": 10},
    {"image_url": "https://media.todayinhistory.app/events/1983-internet.webp", "narration": "ARPANET officially adopted TCP/IP. The Internet, as we know it, was born.", "text_overlay": "1983", "duration": 8}
  ]' \
  --voice internal_marco \
  --transition cross_dissolve \
  --music-url "https://example.com/cinematic-ambient.mp3" \
  --music-volume 0.12
```

### Explainer Video from Scratch (Level 3)

No pre-made assets. Text descriptions and narration only. Pipeline generates everything.

```bash
fairstack video-pipeline \
  --scenes '[
    {"description": "A single server rack in a dark data center, one green LED blinking", "narration": "Every AI image you generate runs on a GPU somewhere. That GPU has a cost.", "style": "Cinematic, teal lighting, shallow depth of field", "text_overlay": "The Real Cost of AI"},
    {"description": "Split screen: left side shows $0.04, right side shows $0.39 in large text", "narration": "The infrastructure cost for one image is about 4 cents. Most platforms charge you 40.", "style": "Clean infographic, dark background, bold white text"},
    {"description": "A transparent price tag showing cost breakdown with small margin highlighted", "narration": "We add a 20 percent margin. That is it. No hidden fees, no subscription lock-in.", "style": "Minimal, white background, one accent color"},
    {"description": "A grid of 50 diverse AI-generated images appearing one by one", "narration": "Same models. Same quality. Fair price.", "style": "Bright, energetic, grid layout", "text_overlay": "fairstack.ai"}
  ]' \
  --voice internal_marco \
  --image-model gpt-image-1.5-t2i \
  --transition cross_dissolve \
  --output '{"resolution": "1080p", "aspect_ratio": "16:9"}'
```

### Mixed Input Levels

Some scenes have pre-made assets, others need generation. Mix freely.

```bash
curl -X POST https://fairstack.ai/v1/video-pipeline \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "scenes": [
      {
        "image_url": "https://example.com/hero-shot.jpg",
        "voiceover_url": "https://example.com/intro-vo.mp3",
        "duration": 5,
        "text_overlay": "Our Story"
      },
      {
        "image_url": "https://example.com/team-photo.jpg",
        "narration": "We started with three engineers and a mission: make AI generation fair.",
        "animation": "pan_right"
      },
      {
        "description": "A world map with glowing connection lines between major cities",
        "narration": "Today, creators in 40 countries use FairStack every day.",
        "style": "Dark background, teal glow, minimal",
        "text_overlay": "40 Countries"
      }
    ],
    "voice": "internal_marco",
    "image_model": "gpt-image-1.5-t2i",
    "transition": "cross_dissolve",
    "output": { "resolution": "1080p" }
  }'
```

### Vertical Short (9:16)

Same pipeline, different aspect ratio. For TikTok, Reels, Shorts.

```bash
fairstack video-pipeline \
  --scenes '[
    {"description": "Close-up of a vinyl record spinning, warm tungsten light", "narration": "Three songs that changed everything.", "text_overlay": "Did You Know?", "duration": 4},
    {"description": "Concert crowd 1965, black and white, electric energy", "narration": "In 1965, Bob Dylan plugged in an electric guitar at Newport. Half the crowd booed.", "text_overlay": "1965", "duration": 8},
    {"description": "A cassette tape being inserted into a Walkman, 1980s aesthetic", "narration": "In 1979, Sony released the Walkman. Music became personal for the first time.", "text_overlay": "1979", "duration": 8}
  ]' \
  --voice internal_marco \
  --image-model gpt-image-1.5-t2i \
  --search-prompt \
  --output '{"aspect_ratio": "9:16", "resolution": "1080p"}'
```

### Webhook for Async Workflows

Fire and forget. Get notified when the video is ready.

```bash
curl -X POST https://fairstack.ai/v1/video-pipeline \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "scenes": [ ... ],
    "voice": "internal_marco",
    "webhook_url": "https://my-app.com/hooks/video-done",
    "idempotency_key": "tih-january-2-v3"
  }'

# Webhook POST to your URL on completion:
# {
#   "event": "video_pipeline.completed",
#   "pipeline_id": "vp_abc123",
#   "status": "completed",
#   "video_url": "https://media.fairstack.ai/video/vp_abc123/output.mp4",
#   "cost": { "total_usd": 0.71, "credits_micro": 710000 }
# }
```

## Partial Failure and Retry

Scenes are independent. If 1 of 5 scenes fails, the other 4 still compose into a video. The failed scene is skipped in the output.

```bash
# Check which scenes failed
fairstack video-pipeline status vp_abc123

# Retry just the failed scenes
fairstack video-pipeline retry vp_abc123 --scenes 2

# Retry all failed scenes at once
fairstack video-pipeline retry vp_abc123

# After retry, a new composition runs automatically with all scenes
```

The retry endpoint only re-generates the failed scenes. Successful scenes keep their assets. A new composition combines everything into the final video.

## Tips

- **Check the estimate.** The POST response includes `estimated_cost` before any generation begins. Large pipelines can add up.
- **Start with 3 scenes.** Validate your voice, style, and pacing before scaling to 50.
- **Use Level 2 when you have images.** Skip image generation cost by providing `image_url` directly.
- **Search enrichment for real subjects.** Historical events, real places, named people -- `search_prompt: true` adds accuracy. Runs once per unique description, not per scene.
- **Ken Burns is the default.** It looks good on most scenes. Use `pan_left`/`pan_right` for landscapes, `zoom_in` for dramatic moments, `static` for text-heavy frames.
- **Webhook for production pipelines.** Don't poll in a loop -- set `webhook_url` and get notified.
- **Idempotency for retries.** Set `idempotency_key` so resubmitting the same request returns the existing pipeline instead of creating a duplicate.
- **Voice consistency.** Use the same `voice` across all your videos. Browse options with `fairstack voices`.
- **Animation is not i2v.** The pipeline uses Ken Burns / pan / zoom (image-based motion). It does not run full image-to-video models per scene. This keeps costs low (~$0.01-0.07 per scene image vs ~$0.26+ for i2v).

## Pricing

All prices = infrastructure cost + 20% margin. Use `fairstack estimate` for current per-model pricing. The POST response includes a full cost breakdown before any generation begins.

## Related Skills

- `fairstack/skills@ai-image-generation` -- Generate images separately, then use as `image_url` in scenes
- `fairstack/skills@ai-voice-generation` -- Generate voiceover separately, then use as `voiceover_url`
- `fairstack/skills@ai-video-generation` -- Single-clip video generation (t2v, i2v, v2v)
- `fairstack/skills@ai-music-generation` -- Generate background music, then use as `music_url`
- `fairstack/skills@style-explore` -- Test visual styles before committing to a full video series
- `fairstack/skills@voice-library` -- Browse and audition voices for narration
- `fairstack/skills@cost-estimator` -- Pre-flight cost estimation for individual components
