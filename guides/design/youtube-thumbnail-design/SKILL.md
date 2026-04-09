---
name: youtube-thumbnail-design
description: "YouTube thumbnail design with AI image generation via FairStack. Covers dimensions, safe zones, color psychology, text placement, face expressions, A/B testing, mobile preview. Use for: YouTube thumbnails, video covers, CTR optimization. Triggers: youtube thumbnail, thumbnail design, video thumbnail, ctr, youtube cover, thumbnail maker, video preview image"
---

# YouTube Thumbnail Design

Generate high-CTR YouTube thumbnails with AI via FairStack.

## Specs

| Spec | Value |
|------|-------|
| Dimensions | 1280x720 min, 1920x1080 recommended |
| Aspect ratio | 16:9 |
| Max file size | 2MB |

## Quick Generate

```bash
# Reaction/surprise thumbnail
fairstack image "YouTube thumbnail, close-up surprised face, vibrant blue and orange, dramatic lighting, high contrast, 1280x720" \
  --model ideogram-v3-t2i --aspect-ratio landscape_16_9

# Tutorial thumbnail
fairstack image "Overhead flat lay workspace with laptop, colorful sticky notes, coffee, clean bright background, tutorial style" \
  --model seedream-4.5-t2i --aspect-ratio landscape_16_9

# Before/After split
fairstack image "Split composition, left dark messy desk, right bright organized workspace, dramatic contrast, clear center divider" \
  --model flux-2-t2i --aspect-ratio landscape_16_9
```

## Safe Zones

Avoid bottom-right (timestamp) and bottom-left (chapter markers). Keep key elements center and upper.

## Color Strategy

| Combination | Best For |
|-------------|----------|
| Yellow + Black | Tech, business |
| Red + White | Entertainment |
| Blue + Orange | Education |
| Green + White | Finance |

## Face Rules

Faces with surprise/excitement get highest CTR. Face should fill 30-50% of frame. Eyes toward text or camera.

## A/B Testing

```bash
fairstack compare image "thumbnail variant with yellow bg..." \
  --models flux-schnell,seedream-4.5-t2i,ideogram-v3-t2i
```

## Related Skills

- `fairstack/skills@ai-image-generation` — Full image generation reference
- `fairstack/skills@compare-models` — A/B test thumbnail variants
