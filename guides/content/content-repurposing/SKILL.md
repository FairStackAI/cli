---
name: content-repurposing
description: "Repurpose content across formats using AI via FairStack. Turn blog posts into videos, podcasts into clips, articles into social media. Triggers: content repurposing, repurpose content, blog to video, article to podcast, content recycling, cross-platform content"
---

# Content Repurposing

Turn one piece of content into multiple formats using AI generation.

## Blog Post -> 5 Formats

```bash
# 1. Blog -> Audio article
fairstack voice "Blog text here..." --model chatterbox-turbo

# 2. Blog -> Social media images (key quotes)
fairstack image "Quote card: 'Key insight from blog', clean design" --model ideogram-v3-t2i

# 3. Blog -> Video summary (30s)
fairstack image "Visual for blog topic" --model seedream-4.5-t2i
fairstack video "Animate" --model seedance-v1-5-pro-i2v --image-url [image]
fairstack voice "30-second summary of the blog post" --model chatterbox-turbo

# 4. Blog -> Podcast segment
fairstack voice "Expanded discussion of blog topic..." --model chatterbox-turbo
fairstack music "Podcast background, subtle" --model mureka-bgm

# 5. Blog -> Carousel (key points as slides)
for point in "Point 1" "Point 2" "Point 3" "CTA"; do
  fairstack image "Carousel slide: ${point}, consistent style" --model ideogram-v3-t2i &
done
wait
```

## Cost Planning

Use `--estimate` on each step to plan total cost:

```bash
fairstack voice "your text" --model chatterbox-turbo --estimate
fairstack image "test" --model ideogram-v3-t2i --estimate
fairstack video "test" --model seedance-v1-5-pro-i2v --estimate
fairstack music "test" --model mureka-bgm --estimate
```

## Related Skills

- `fairstack/skills@workflow/multi-modal-workflow` — Pipeline patterns
- `fairstack/skills@workflow/batch-generation` — Scale up
