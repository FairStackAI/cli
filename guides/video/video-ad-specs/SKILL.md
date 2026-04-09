---
name: video-ad-specs
description: "Video ad specifications for all platforms. Covers YouTube, Instagram, TikTok, Facebook, LinkedIn, Twitter dimensions and duration limits. Triggers: video ad specs, ad dimensions, video dimensions, platform specs, social media video size, ad format, video requirements"
---

# Video Ad Specs

Platform specifications for video ads generated with FairStack.

## Platform Specs

| Platform | Aspect | Resolution | Max Duration | Max Size |
|----------|--------|------------|-------------|----------|
| YouTube pre-roll | 16:9 | 1920x1080 | 15-30s | 256MB |
| YouTube bumper | 16:9 | 1920x1080 | 6s | 256MB |
| Instagram Reels | 9:16 | 1080x1920 | 60s | 250MB |
| Instagram Stories | 9:16 | 1080x1920 | 15s | 250MB |
| Instagram Feed | 1:1 or 4:5 | 1080x1080 | 60s | 250MB |
| TikTok | 9:16 | 1080x1920 | 60s | 287MB |
| Facebook Feed | 1:1 or 4:5 | 1080x1080 | 120s | 4GB |
| LinkedIn | 16:9 or 1:1 | 1920x1080 | 30-90s | 200MB |
| Twitter | 16:9 | 1920x1080 | 140s | 512MB |

## Quick Generate by Platform

```bash
# Instagram Reel (9:16, vertical)
fairstack video "Product demo, vertical format" --model vidu-q3-turbo-t2v --aspect-ratio 9:16

# YouTube ad (16:9, horizontal)
fairstack video "Brand commercial, cinematic" --model kling-3-0-std --aspect-ratio 16:9

# Square (Instagram/Facebook feed)
fairstack video "Product showcase, square format" --model vidu-q3-turbo-t2v --aspect-ratio 1:1
```

## Related Skills

- `fairstack/skills@ai-video-generation` — Video generation
- `fairstack/skills@ai-marketing-videos` — Marketing video workflows
