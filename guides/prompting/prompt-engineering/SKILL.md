---
name: prompt-engineering
description: "Prompt engineering guide for AI generation via FairStack. Covers image prompts, video prompts, voice direction, music descriptions. Model-specific tips for FLUX, Seedream, Ideogram, Kling, Veo. Use for: improving AI output quality, writing better prompts, understanding model behavior. Triggers: prompt engineering, better prompts, prompt tips, how to prompt, prompt guide, prompt tutorial, improve ai output, prompting tips, write prompts"
---

# Prompt Engineering

Write better prompts for higher quality AI generations across all modalities.

## Image Prompts

### Structure: Subject + Style + Composition + Technical

```
"[Subject description], [art style], [composition/framing], [lighting/technical]"
```

### Good vs. Bad

| Bad | Good | Why |
|-----|------|-----|
| "a cat" | "Orange tabby cat sitting on a windowsill, soft morning light, shallow depth of field, cozy atmosphere" | Specificity |
| "product photo" | "Professional product photo of wireless earbuds on white background, soft studio lighting, subtle shadow, commercial quality" | Context |
| "beautiful landscape" | "Misty mountain valley at golden hour, fog rolling through pine trees, warm sunlight, cinematic wide shot" | Concrete details |

### Model-Specific Tips

| Model | Strength | Prompt Tip |
|-------|----------|------------|
| `flux-schnell` | Speed | Short, direct prompts work fine |
| `ideogram-v3-t2i` | Text rendering | Include exact text in quotes: `with text "HELLO"` |
| `seedream-4.5-t2i` | Photorealism | Add camera terms: "85mm lens", "f/2.8", "DSLR" |
| `gpt-image-1.5-t2i` | Instruction following | Be detailed about exactly what you want |

### Negative Prompts

For models that support it, specify what to avoid:

```bash
fairstack image "Professional headshot" --model flux-2-t2i --negative-prompt "blurry, watermark, text, logo, low quality"
```

## Video Prompts

### Structure: Action + Camera + Style

```
"[Subject doing action], [camera movement], [style/mood]"
```

### Camera Movements

| Term | Effect |
|------|--------|
| "dolly in" | Camera moves toward subject |
| "tracking shot" | Camera follows subject |
| "static shot" | No camera movement |
| "aerial/drone shot" | Overhead perspective |
| "slow motion" | Slowed playback |
| "timelapse" | Sped up time |

### Example

```bash
fairstack video "Golden retriever running through autumn leaves, tracking shot following the dog, slow motion, warm sunlight, cinematic depth of field" \
  --model vidu-q3-turbo-t2v
```

## Voice Prompts (Script Writing)

- Write for spoken delivery: short sentences, natural rhythm
- Use commas and periods for pacing (the model reads punctuation as pauses)
- Spell out numbers and abbreviations
- Avoid complex sentence structures

## Music Prompts

### Structure: Genre + Mood + Instruments + Tempo + Duration

```
"[genre] [mood], [instruments], [tempo] BPM, [duration]"
```

### Example

```bash
fairstack music "Lo-fi hip hop, chill relaxed mood, warm piano chords, soft vinyl crackle, mellow drums, 85 BPM, 60 seconds" \
  --model mureka-bgm
```

## Universal Tips

1. **Be specific.** "sunset" vs "golden hour sunset over Pacific ocean, warm orange and pink sky, calm water reflections"
2. **Use domain vocabulary.** Photography terms for images, cinematography for video, music theory for audio
3. **Iterate cheaply.** Start with flux-schnell (cheapest image model) to test prompts, upgrade for finals
4. **Seed for consistency.** Add `--seed 42` to reproduce good results
5. **Compare models.** Same prompt, different models: `fairstack compare image "prompt" --models a,b,c`

## Related Skills

- `fairstack/skills@ai-image-generation` — Image models and parameters
- `fairstack/skills@ai-video-generation` — Video models and parameters
- `fairstack/skills@compare-models` — Test prompts across models
