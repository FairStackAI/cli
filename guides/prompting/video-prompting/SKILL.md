---
name: video-prompting
description: "Video prompt engineering guide for AI video generation via FairStack. Covers camera movements, shot types, style terms, model-specific tips. Triggers: video prompt, video prompting, how to prompt video, video prompt tips, t2v prompt, i2v prompt"
---

# Video Prompting Guide

Write better prompts for AI video generation.

## Prompt Structure

```
[Subject/action], [camera movement], [style/mood], [lighting], [technical]
```

## Camera Movements

| Term | Effect | Example |
|------|--------|---------|
| `static shot` | No movement | Stable product showcase |
| `slow push in` | Camera moves toward | Building tension |
| `pull back` | Camera moves away | Revealing context |
| `tracking shot` | Camera follows subject | Action scenes |
| `orbit` | Camera circles subject | Product showcase |
| `crane shot` | Camera moves up/down | Dramatic reveal |
| `drone/aerial` | Overhead perspective | Landscape establishing |
| `handheld` | Slight shake | Documentary feel |

## Shot Types

| Type | Use | Prompt Term |
|------|-----|-------------|
| Wide/establishing | Scene setting | "wide shot of..." |
| Medium | Conversation | "medium shot of..." |
| Close-up | Detail/emotion | "close-up of..." |
| Extreme close-up | Texture/detail | "macro shot of..." |
| POV | Immersion | "first person view of..." |

## Good vs. Bad

| Bad | Good |
|-----|------|
| "a sunset" | "Golden sunset over calm ocean, drone slowly descending toward the water, warm light, cinematic" |
| "product video" | "Slow orbit around luxury watch, dramatic rim lighting, dark background, studio product shot" |
| "person walking" | "Tracking shot following person walking through autumn forest, leaves falling, warm golden light" |

## Model-Specific Tips

| Model | Tip |
|-------|-----|
| Vidu Q3 Turbo | Simple, direct prompts. Short generations. |
| Kling 3.0 | Handles complex camera movements well |
| Veo 3.1 | Best with cinematic/descriptive language |
| Seedance (I2V) | Focus on motion description, not scene |

## Related Skills

- `fairstack/skills@ai-video-generation` — Full model reference
- `fairstack/skills@prompting/prompt-engineering` — General prompting
