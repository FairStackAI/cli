---
name: explainer-video
description: "Create explainer videos with AI via FairStack. Covers storyboarding, scene generation, narration, assembly. Triggers: explainer video, how it works video, tutorial video, product explainer, feature walkthrough, onboarding video"
---

# Explainer Video Guide

Build explainer videos scene-by-scene with AI generation.

## Workflow

1. **Script** -> 2. **Storyboard** (image per scene) -> 3. **Animate** (video per scene) -> 4. **Narrate** (voice per scene) -> 5. **Assemble**

## Example: 60s Product Explainer

### Scene 1: Problem (15s)

```bash
fairstack voice "Have you ever spent hours formatting reports that nobody reads?" --model chatterbox-turbo
fairstack image "Frustrated office worker at messy desk, papers everywhere, dramatic lighting" --model seedream-4.5-t2i
fairstack video "Camera slowly pushes in on frustrated worker" --model seedance-v1-5-pro-i2v --image-url [image]
```

### Scene 2: Solution (15s)

```bash
fairstack voice "Meet ReportAI. Generate beautiful reports in seconds." --model chatterbox-turbo
fairstack image "Clean modern dashboard on laptop, bright organized workspace" --model gpt-image-1.5-t2i
fairstack video "Smooth transition to organized workspace, clean bright" --model seedance-v1-5-pro-i2v --image-url [image]
```

### Scene 3: Feature (15s)

```bash
fairstack voice "Just paste your data, choose a template, and click generate." --model chatterbox-turbo
fairstack image "Close-up of hand clicking button on screen, modern UI" --model seedream-4.5-t2i
```

### Scene 4: CTA (15s)

```bash
fairstack voice "Try ReportAI free today. Link in the description." --model chatterbox-turbo
fairstack music "Upbeat outro jingle, 15 seconds" --model mureka-bgm
```

## Cost Planning

Use `--estimate` on each step:

```bash
fairstack voice "test" --model chatterbox-turbo --estimate
fairstack image "test" --model seedream-4.5-t2i --estimate
fairstack video "test" --model seedance-v1-5-pro-i2v --estimate
```

## Related Skills

- `fairstack/skills@ai-video-generation` — Video generation
- `fairstack/skills@ai-voice-generation` — Narration
- `fairstack/skills@workflow/multi-modal-workflow` — Pipeline patterns
