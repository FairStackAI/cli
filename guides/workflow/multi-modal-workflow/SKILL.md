---
name: multi-modal-workflow
description: "Build multi-modal AI workflows chaining image, video, voice, and music generation via FairStack. Pipeline patterns: image to video to voiceover, script to speech to talking head, product photo to animated ad with music. Use for: content pipelines, automated video production, social media content factories, marketing asset generation. Triggers: multi-modal, content pipeline, ai workflow, chain generation, image to video, voice to video, automated content, content factory, media pipeline, multi-step ai, workflow automation"
---

# Multi-Modal Workflow

Chain image, video, voice, and music generation into complete content pipelines. Each step's output feeds the next step's input.

## Pipeline Patterns

### Pattern 1: Image -> Video -> Voice Narration

```bash
# 1. Generate hero image
fairstack image "Luxury watch on marble surface, dramatic studio lighting" \
  --model seedream-4.5-t2i

# 2. Animate it
fairstack video "Slow camera orbit, light reflections dance on the surface" \
  --model seedance-v1-5-pro-i2v \
  --image-url https://media.fairstack.ai/image/xxx/step1.jpg

# 3. Generate narration
fairstack voice "Introducing the Chronos Elite. Precision engineered for those who value every second." \
  --model chatterbox-turbo
```

### Pattern 2: Script -> Speech -> Talking Head

```bash
# 1. Generate speech
fairstack voice "Welcome to our product tour. Today I will show you three features that save you hours." \
  --model chatterbox-turbo

# 2. Generate portrait
fairstack image "Professional headshot, friendly person, studio lighting, clean background" \
  --model seedream-4.5-t2i --aspect-ratio portrait_4_3

# 3. Create talking head
fairstack talking-head --model musetalk-1.5 \
  --image-url https://media.fairstack.ai/image/xxx/portrait.jpg \
  --audio-url https://media.fairstack.ai/voice/xxx/speech.wav
```

### Pattern 3: Product Photo -> Social Media Content

```bash
# 1. Product photo
fairstack image "Wireless headphones, white background, studio lighting" --model seedream-4.5-t2i

# 2. Remove background
fairstack image "" --model recraft-remove-bg --image-url [step1-url]

# 3. Animate for social
fairstack video "Product rotating slowly, clean white background" \
  --model seedance-v1-5-pro-i2v --image-url [step2-url]

# 4. Background music
fairstack music "Upbeat electronic, clean, modern, 15 seconds" --model mureka-bgm
```

### Pattern 4: Blog Post -> Audio Article

```bash
# For each section of your blog post:
fairstack voice "Section one text here..." --model chatterbox-turbo
fairstack voice "Section two text here..." --model chatterbox-turbo
fairstack voice "Section three text here..." --model chatterbox-turbo

# Add intro music
fairstack music "Professional podcast intro, 5 seconds, clean" --model mureka-bgm
```

## Cost Planning

Use `--estimate` on each step to plan total pipeline cost before generating:

```bash
fairstack image "test" --model seedream-4.5-t2i --estimate
fairstack video "test" --model seedance-v1-5-pro-i2v --estimate
fairstack voice "test" --model chatterbox-turbo --estimate
fairstack music "test" --model mureka-bgm --estimate
```

Check current model pricing:

```bash
fairstack models --modality image
fairstack models --modality video
fairstack models --modality voice
fairstack models --modality music
```

## Tips

- **Estimate each step.** Use `--estimate` before expensive steps (video, talking head).
- **Start with the most important step.** If the image is bad, the video will be bad.
- **Cache intermediate results.** Save URLs from each step to reuse if a later step fails.
- **Use cheap models for iteration.** Draft the pipeline with budget models, then upgrade.
- **Parallelize where possible.** Voice and music generation can run in parallel.

## Related Skills

- `fairstack/skills@ai-image-generation` — Step 1: Generate images
- `fairstack/skills@ai-video-generation` — Step 2: Animate or generate video
- `fairstack/skills@ai-voice-generation` — Step 3: Add narration
- `fairstack/skills@ai-music-generation` — Step 4: Add music
- `fairstack/skills@ai-talking-head` — Alternative: Talking heads
