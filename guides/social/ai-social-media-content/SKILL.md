---
name: ai-social-media-content
description: "Generate social media content (images, videos, carousels) with AI via FairStack. Covers platform-specific dimensions, content types, batch generation for content calendars. Triggers: social media content, social media images, social media videos, content creation, social post, instagram content, tiktok content, social media marketing"
---

# AI Social Media Content

Generate platform-optimized visual content for social media.

## Platform Quick Reference

| Platform | Image Size | Video Aspect | Video Duration |
|----------|-----------|-------------|---------------|
| Instagram Feed | 1080x1080 | 1:1 or 4:5 | <60s |
| Instagram Reels | 1080x1920 | 9:16 | <90s |
| TikTok | 1080x1920 | 9:16 | <60s |
| Twitter/X | 1200x675 | 16:9 | <140s |
| LinkedIn | 1200x627 | 16:9 or 1:1 | <10min |
| Facebook | 1200x630 | 16:9 or 1:1 | <240min |

## Content Calendar Batch

```bash
# Monday: product shot
fairstack image "Clean product photo, white background" --model seedream-4.5-t2i

# Wednesday: behind-the-scenes
fairstack image "Modern creative workspace, warm lighting, candid style" --model gpt-image-1.5-t2i

# Friday: motivational quote
fairstack image "Motivational poster with text 'BUILD SOMETHING GREAT', bold modern typography, dark gradient background" \
  --model ideogram-v3-t2i
```

## Video Content

```bash
# Instagram Reel (vertical)
fairstack video "Product in use, energetic, vertical format" --model vidu-q3-turbo-t2v --aspect-ratio 9:16

# YouTube Short (vertical)
fairstack video "Quick tutorial, screen recording feel" --model vidu-q3-turbo-t2v --aspect-ratio 9:16
```

## Related Skills

- `fairstack/skills@ai-image-generation` — Image generation
- `fairstack/skills@ai-video-generation` — Video generation
- `fairstack/skills@social/social-media-carousel` — Carousel posts
