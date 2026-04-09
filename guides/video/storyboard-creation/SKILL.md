---
name: storyboard-creation
description: "Create visual storyboards with AI via FairStack. Generate scene-by-scene visuals for video planning. Triggers: storyboard, video storyboard, scene planning, pre-production, shot list, visual script"
---

# Storyboard Creation

Generate scene-by-scene visual storyboards for video pre-production.

## Quick Storyboard

```bash
# Generate consistent scenes for a 4-panel storyboard
fairstack image "Storyboard panel: wide shot of city skyline at dawn, establishing shot, cinematic" --model flux-schnell &
fairstack image "Storyboard panel: medium shot of person walking into office building, morning" --model flux-schnell &
fairstack image "Storyboard panel: close-up of hands typing on laptop keyboard" --model flux-schnell &
fairstack image "Storyboard panel: wide shot of team meeting in modern conference room" --model flux-schnell &
wait
```

## Cost Planning

```bash
fairstack image "test" --model flux-schnell --estimate
```

Multiply per-image cost by number of storyboard frames.

## Storyboard Notation

Add camera direction to your prompts:

| Shot Type | Prompt Prefix |
|-----------|--------------|
| Establishing | "Wide shot of..." |
| Medium | "Medium shot of..." |
| Close-up | "Close-up of..." |
| Over-the-shoulder | "Over the shoulder shot of..." |
| POV | "First person point of view of..." |
| Aerial | "Overhead drone shot of..." |

## From Storyboard to Video

Once you approve storyboard frames, animate them:

```bash
fairstack video "Camera slowly pushes in" --model seedance-v1-5-pro-i2v --image-url [storyboard-frame]
```

## Related Skills

- `fairstack/skills@ai-image-generation` — Generate storyboard frames
- `fairstack/skills@ai-video-generation` — Animate frames into video
