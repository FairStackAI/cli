---
name: newsletter-curation
description: "Generate newsletter header images and section visuals with AI via FairStack. Triggers: newsletter, newsletter image, newsletter visual, email newsletter, newsletter header, weekly newsletter"
---

# Newsletter Visuals

Generate header and section images for email newsletters.

## Weekly Newsletter Header

```bash
fairstack image "Clean modern newsletter header, week of March 21, abstract geometric, brand teal and navy, professional, wide format" \
  --model flux-schnell --aspect-ratio landscape_16_9
```

## Section Dividers

```bash
# Generate themed section images
fairstack image "Abstract icon representing 'news highlights', minimal, teal accent" --model flux-schnell
fairstack image "Abstract icon representing 'product updates', minimal, teal accent" --model flux-schnell
fairstack image "Abstract icon representing 'community', minimal, teal accent" --model flux-schnell
```

## Cost Planning

```bash
fairstack image "test" --model flux-schnell --estimate
```

Multiply per-image cost by the number of newsletter images.

## Related Skills

- `fairstack/skills@design/email-design` — Email image specs
- `fairstack/skills@ai-image-generation` — Full reference
