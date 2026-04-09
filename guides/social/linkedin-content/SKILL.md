---
name: linkedin-content
description: "Generate LinkedIn post visuals with AI via FairStack. Covers post images, article headers, carousel posts, professional imagery. Triggers: linkedin, linkedin post, linkedin image, linkedin content, professional post, linkedin visual, linkedin article"
---

# LinkedIn Content

Generate professional visuals for LinkedIn posts and articles.

## Post Image (1200x627)

```bash
fairstack image "Professional business concept, modern office, diverse team collaborating, warm natural lighting, corporate but friendly, landscape composition" \
  --model seedream-4.5-t2i --aspect-ratio landscape_16_9
```

## Article Header

```bash
fairstack image "Abstract professional background, subtle blue gradient, geometric patterns, clean modern, article header composition with text space on left" \
  --model seedream-4.5-t2i --aspect-ratio landscape_16_9
```

## Thought Leadership Post

```bash
# Generate supporting visual for data/insight post
fairstack image "Clean data visualization mockup, modern dashboard with upward trend chart, blue and teal palette, professional" \
  --model gpt-image-1.5-t2i --aspect-ratio landscape_4_3
```

## Related Skills

- `fairstack/skills@ai-image-generation` — Full reference
- `fairstack/skills@social/social-media-carousel` — LinkedIn carousels
