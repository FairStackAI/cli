---
name: api-integration
description: "Integrate FairStack AI generation API into your application. Covers authentication, async/sync patterns, polling, webhooks, error handling, rate limits, idempotency, cost management. Language examples in JavaScript, Python, curl. Use for: API integration, building on FairStack, developer onboarding, backend integration, app development. Triggers: api integration, developer guide, integrate fairstack, api key, authentication, polling, async api, webhook, rate limit, idempotency, sdk, developer documentation, build with ai, api tutorial"
---

# API Integration Guide

Integrate FairStack's AI generation API into your application. REST API with JSON. No SDK required — standard HTTP from any language.

## Authentication

```bash
# All generation endpoints require an API key
curl -H "Authorization: Bearer fs_live_xxx" https://fairstack.ai/v1/account
```

Get your API key at [fairstack.ai/app/api-keys](https://fairstack.ai/app/api-keys).

**Key format:** `fs_live_xxx` (production) or `fs_test_xxx` (sandbox)

## Base URL

```
https://fairstack.ai
```

## Core Flow: Submit -> Poll -> Get Result

### 1. Submit a Generation

```bash
curl -s -X POST https://fairstack.ai/v1/image/generate \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A mountain lake", "model": "flux-schnell"}'
```

Response:

```json
{
  "status": "queued",
  "generation_id": "abc-123",
  "poll_url": "/v1/generations/abc-123"
}
```

### 2. Poll for Result

```bash
curl -s -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  https://fairstack.ai/v1/generations/abc-123
```

Response (when complete):

```json
{
  "request_id": "req_xxx",
  "data": {
    "id": "abc-123",
    "status": "succeeded",
    "output": { "url": "https://media.fairstack.ai/image/xxx/yyy.jpg" },
    "cost": { "credits_used": 3600, "currency": "microdollars" }
  }
}
```

### 3. Alternative: Sync Mode

Use `Prefer: wait=N` header to wait up to N seconds instead of polling:

```bash
curl -s -X POST https://fairstack.ai/v1/image/generate \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: wait=30" \
  -d '{"prompt": "A mountain lake", "model": "flux-schnell"}'
```

Returns the completed generation directly if it finishes within N seconds. Otherwise returns the queued response for manual polling.

## Endpoints by Modality

| Modality | Generate | Browse Models |
|----------|----------|---------------|
| Image | `POST /v1/image/generate` | `fairstack models --modality image` |
| Video | `POST /v1/video/generate` | `fairstack models --modality video` |
| Voice | `POST /v1/voice/generate` | `fairstack models --modality voice` |
| Music | `POST /v1/music/generate` | `fairstack models --modality music` |
| Talking Head | `POST /v1/talking-head/generate` | `fairstack models --modality talkingHead` |

## Public Endpoints (No Auth)

| Endpoint | Description |
|----------|-------------|
| `GET /v1/models` | All models with pricing |
| `GET /v1/models/:id` | Model detail with parameters |
| `GET /v1/voices` | Voice library |
| `POST /v1/select-model` | AI model recommendation |

## Cost Estimation (Quote Flow)

Check cost before generating — no credits charged:

```bash
curl -s -X POST https://fairstack.ai/v1/image/generate \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test", "model": "flux-schnell", "confirm": false}'
```

Returns:

```json
{
  "data": {
    "quote_id": "xxx",
    "estimated_cost": { "cost": 0.0036, "currency": "USD" },
    "expires_in_sec": 60
  }
}
```

## Idempotency

Prevent duplicate generations on retry:

```bash
curl -X POST https://fairstack.ai/v1/image/generate \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Idempotency-Key: my-unique-request-id-123" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "...", "model": "flux-schnell"}'
```

Same idempotency key = same response. Safe to retry on network failures.

## Rate Limits

Rate limit headers on every response:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1680000000
```

On 429: check `Retry-After` header for seconds to wait.

## Error Handling

All errors return:

```json
{
  "error": {
    "type": "validation_error",
    "code": "validation_error",
    "message": "Human-readable message"
  }
}
```

| HTTP | Type | Meaning |
|------|------|---------|
| 400 | `validation_error` | Invalid request |
| 401 | `authentication_error` | Bad or missing API key |
| 402 | `insufficient_credits` | Balance too low |
| 403 | `forbidden` | Key doesn't have required scope |
| 404 | `not_found` | Resource doesn't exist |
| 422 | `content_filtered` | Content policy violation |
| 429 | `rate_limited` | Too many requests |
| 503 | `provider_unavailable` | Model temporarily down |

## JavaScript Example

```javascript
const FAIRSTACK_API_KEY = process.env.FAIRSTACK_API_KEY;
const BASE = "https://fairstack.ai";

async function generateImage(prompt, model = "flux-schnell") {
  // Submit
  const res = await fetch(`${BASE}/v1/image/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${FAIRSTACK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, model }),
  });
  const { generation_id } = await res.json();

  // Poll
  while (true) {
    const poll = await fetch(`${BASE}/v1/generations/${generation_id}`, {
      headers: { Authorization: `Bearer ${FAIRSTACK_API_KEY}` },
    });
    const { data } = await poll.json();
    if (data.status === "succeeded") return data.output.url;
    if (data.status === "failed") throw new Error(data.error);
    await new Promise((r) => setTimeout(r, 3000));
  }
}
```

## Python Example

```python
import requests, time, os

API_KEY = os.environ["FAIRSTACK_API_KEY"]
BASE = "https://fairstack.ai"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

def generate_image(prompt, model="flux-schnell"):
    # Submit
    r = requests.post(f"{BASE}/v1/image/generate",
                      json={"prompt": prompt, "model": model}, headers=HEADERS)
    gen_id = r.json()["generation_id"]

    # Poll
    while True:
        r = requests.get(f"{BASE}/v1/generations/{gen_id}", headers=HEADERS)
        data = r.json()["data"]
        if data["status"] == "succeeded":
            return data["output"]["url"]
        if data["status"] == "failed":
            raise Exception(data["error"])
        time.sleep(3)
```

## Related Skills

- `fairstack/skills@ai-image-generation` — Image generation reference
- `fairstack/skills@ai-video-generation` — Video generation reference
- `fairstack/skills@cost-estimator` — Pre-flight cost estimation
