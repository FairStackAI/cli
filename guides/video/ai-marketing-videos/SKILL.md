---
name: ai-marketing-videos
description: "Create marketing videos with AI via FairStack. Covers product demos, social ads, brand videos, testimonials. From concept to final video with image, video, voice, and music. Triggers: marketing video, product video, brand video, ad video, promo video, commercial, video ad, social media video, product demo video"
---

# AI Marketing Videos

Create marketing videos from concept to delivery using AI generation.

## Video Types & Pipelines

### Product Demo (30s)

```bash
# 1. Product shot
fairstack image "Sleek smartphone on marble surface, dramatic lighting" --model seedream-4.5-t2i

# 2. Animate
fairstack video "Camera slowly orbits the phone, light reflections" --model seedance-v1-5-pro-i2v \
  --image-url [step1-url]

# 3. Narration
fairstack voice "Introducing the all-new ProPhone. Designed for those who demand the best." \
  --model chatterbox-turbo

# 4. Background music
fairstack music "Modern electronic, clean, premium feel, 30 seconds" --model mureka-bgm
```

### Social Media Ad (15s)

```bash
# Quick animated product
fairstack image "Product flat lay, colorful, energetic composition" --model flux-schnell
fairstack video "Dynamic zoom and pan" --model vidu-q3-turbo-t2v --image-url [image-url]
```

### Testimonial/Talking Head

```bash
fairstack voice "This product changed how I work. I save 3 hours every day." --model chatterbox-turbo
fairstack image "Professional headshot, friendly person" --model seedream-4.5-t2i
fairstack talking-head --model musetalk-1.5 --image-url [portrait] --audio-url [voice]
```

## Cost Planning

Use `--estimate` on each step before generating:

```bash
fairstack image "test" --model seedream-4.5-t2i --estimate
fairstack video "test" --model seedance-v1-5-pro-i2v --estimate
fairstack voice "test" --model chatterbox-turbo --estimate
fairstack music "test" --model mureka-bgm --estimate
```

## Platform Specs

| Platform | Aspect | Duration |
|----------|--------|----------|
| Instagram Reels | 9:16 | 15-60s |
| TikTok | 9:16 | 15-60s |
| YouTube Shorts | 9:16 | <60s |
| YouTube | 16:9 | Any |
| LinkedIn | 16:9 or 1:1 | 30-120s |
| Twitter | 16:9 | <140s |

## Related Skills

- `fairstack/skills@ai-video-generation` — Video models
- `fairstack/skills@ai-image-generation` — Image generation
- `fairstack/skills@ai-voice-generation` — Voiceover
- `fairstack/skills@ai-music-generation` — Background music
