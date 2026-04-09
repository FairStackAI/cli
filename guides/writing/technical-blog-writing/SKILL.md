---
name: technical-blog-writing
description: "Generate visuals for technical blog posts with AI via FairStack. Covers hero images, diagrams, code screenshots, architecture illustrations. Triggers: technical blog, blog image, blog visual, tech blog, developer blog, blog illustration, blog hero image"
---

# Technical Blog Writing Visuals

Generate supporting visuals for technical blog posts.

## Hero Image

```bash
fairstack image "Abstract tech illustration, clean geometric code/data visualization, modern dark gradient with teal accents, blog hero image style" \
  --model seedream-4.5-t2i --aspect-ratio landscape_16_9
```

## Architecture Diagram Style

```bash
fairstack image "Clean isometric illustration of microservices architecture, connected boxes with arrows, blue and teal palette, modern flat design, white background" \
  --model ideogram-v3-t2i --aspect-ratio landscape_4_3
```

## Concept Illustration

```bash
fairstack image "Abstract illustration of API request flow, data packets traveling through network nodes, modern tech aesthetic, dark background" \
  --model gpt-image-1.5-t2i --aspect-ratio landscape_16_9
```

## Blog Series (Consistent Style)

```bash
for topic in "databases" "caching" "authentication" "deployment" "monitoring"; do
  fairstack image "Tech blog hero: ${topic} concept, modern abstract, consistent blue-teal palette, dark gradient" \
    --model seedream-4.5-t2i --aspect-ratio landscape_16_9 &
done
wait
```

## Related Skills

- `fairstack/skills@ai-image-generation` — Full reference
