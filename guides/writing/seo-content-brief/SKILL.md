---
name: seo-content-brief
description: "Generate images for SEO content with AI via FairStack. Covers featured images, infographic elements, comparison images. Triggers: seo content, seo image, featured image, blog seo, content brief image, seo visual"
---

# SEO Content Visuals

Generate optimized images for SEO content.

## Featured Image

```bash
fairstack image "Professional blog featured image about [topic], clean modern design, high quality, landscape composition" \
  --model seedream-4.5-t2i --aspect-ratio landscape_16_9
```

## Comparison Image

```bash
fairstack image "Side-by-side comparison layout, Product A vs Product B, clean professional design, split composition" \
  --model ideogram-v3-t2i --aspect-ratio landscape_16_9
```

## Tips

- Use descriptive filenames (rename after download) for image SEO
- Generate at 1920x1080+ and compress for web
- Each article should have a unique featured image
- Consistent style across a blog builds brand recognition

## Related Skills

- `fairstack/skills@ai-image-generation` — Full reference
