# Smoke Test Results

Tested against production (https://fairstack.ai) on 2026-03-21.

## CLI Commands

| Command | Status | Notes |
|---------|--------|-------|
| `fairstack --help` | PASS | All 13 commands listed |
| `fairstack models` | PASS | 81 models across 5 modalities (26 image, 18 video, 10 voice, 10 talkingHead, 17 music) |
| `fairstack models --modality image` | PASS | 26 image models listed with pricing |
| `fairstack models --detail flux-schnell` | PASS | Full model detail with parameters, pricing, competitors |
| `fairstack voices` | PASS | 168 total voices, pagination working |
| `fairstack voices --gender male` | PASS | 125 male voices |
| `fairstack voices --archetype narrator` | PASS | 26 narrator voices |
| `fairstack balance` | PASS | Shows account, plan, balance, monthly spend |
| `fairstack estimate image "test" --model flux-schnell` | PASS | $0.0036 quote |
| `fairstack estimate voice "test" --model chatterbox-turbo` | PASS | $0.0036 quote |
| `fairstack estimate video "test" --model vidu-q3-turbo-t2v` | PASS | $0.0420 quote |
| `fairstack estimate music "test" --model mureka-bgm` | PASS | $0.0360 quote |
| `fairstack image "red circle" --model flux-schnell` | PASS | Succeeded in 1.5s, $0.0036, URL returned |
| `fairstack image "test" --model gpt-image-1-mini --estimate` | PASS | $0.0060 quote |
| `fairstack voice "hello world" --model chatterbox-turbo` | PASS | Succeeded in 18.9s, $0.0018 |
| `fairstack compare image "star" --models flux-schnell,gpt-image-1-mini` | PASS | Both succeeded, side-by-side results |
| `fairstack status {id}` | PASS | Shows generation status, URL, cost, timing |

## API Endpoints Verified

| Endpoint | Auth | Status | Response Format |
|----------|------|--------|-----------------|
| `GET /v1/models` | No | PASS | `{request_id, data: {image: [...], video: [...], ...}}` |
| `GET /v1/models/:id` | No | PASS | `{request_id, data: {id, displayName, pricing, parameters, ...}}` |
| `GET /v1/voices` | No | PASS | `{voices: [...], pagination: {total: 168, ...}}` |
| `GET /v1/voices?gender=male` | No | PASS | Filtering works |
| `GET /v1/voices?archetype=narrator` | No | PASS | Filtering works |
| `GET /v1/account` | Yes | PASS | `{request_id, data: {credits, spending_cap, plan, ...}}` |
| `POST /v1/image/generate` | Yes | PASS | `{status, generation_id, poll_url, ...}` |
| `POST /v1/image/generate` (confirm=false) | Yes | PASS | `{request_id, data: {quote_id, estimated_cost, ...}}` |
| `POST /v1/voice/generate` | Yes | PASS | Same pattern as image |
| `POST /v1/video/generate` (confirm=false) | Yes | PASS | Quote flow works |
| `POST /v1/music/generate` (confirm=false) | Yes | PASS | Quote flow works |
| `POST /v1/generations/:type` | Yes | PASS | `{request_id, data: {id, status, ...}}` (different from modality-specific) |
| `GET /v1/generations/:id` | Yes | PASS | `{request_id, data: {status, output: {url}, cost, ...}}` |
| `POST /v1/select-model` | No | FAIL | Returns "Model recommendation temporarily unavailable" |

## Known Issues

1. **Voice library voice IDs**: Using `--voice internal_marco` with ref-audio-based models (qwen-3-tts, indextts2) fails because the voice sample URL returns 404. Chatterbox-turbo works without a voice param. ElevenLabs models need specific ElevenLabs voice IDs.
2. **Select model endpoint**: Returns provider_error "temporarily unavailable" — may be dependent on a specific AI service being up.
3. **Response format inconsistency**: Modality-specific endpoints (`/v1/image/generate`) return flat `{status, generation_id}`, while unified endpoint (`/v1/generations/:type`) returns `{request_id, data: {id, status}}`. CLI handles both.

## Generation Costs Incurred

| Generation | Model | Cost |
|-----------|-------|------|
| Image (red circle) | flux-schnell | $0.0036 |
| Voice (hello world) | chatterbox-turbo | $0.0018 |
| Image (star - compare A) | flux-schnell | $0.0036 |
| Image (star - compare B) | gpt-image-1-mini | $0.006 |
| Image (blue square - API test) | flux-schnell | $0.0036 |
| **Total** | | **$0.0186** |
