---
name: ai-product-photography
description: "AI product photography via FairStack. Generate studio-quality product shots, lifestyle scenes, flat lays, and packshots. Covers lighting, composition, background options. Use for: ecommerce, product listings, social media, catalogs. Triggers: product photography, product photo, product shot, ecommerce photo, product image, studio shot, packshot, product mockup, lifestyle product photo"
---

# AI Product Photography

Generate studio-quality product images without a physical studio.

## Shot Types

### Studio Shot (White Background)

```bash
fairstack image "Professional product photography of wireless headphones, centered on pure white background, soft studio lighting, subtle shadow, high detail, commercial quality" \
  --model seedream-4.5-t2i
```

### Lifestyle Shot

```bash
fairstack image "Wireless headphones on a marble desk next to a coffee cup and succulent plant, warm natural morning light, shallow depth of field, lifestyle product photo" \
  --model gpt-image-1.5-t2i
```

### Flat Lay

```bash
fairstack image "Overhead flat lay photography of tech gadgets neatly arranged, wireless earbuds, smartwatch, phone, cable, on light wood surface, symmetrical layout" \
  --model seedream-4.5-t2i
```

### Hero Shot (Dramatic)

```bash
fairstack image "Dramatic product hero shot of a luxury watch, dark background, dramatic rim lighting, floating with reflection, cinematic commercial photography" \
  --model imagen-4
```

## Background Removal

```bash
# Generate product shot, then remove background
fairstack image "Sneakers on white background, studio lighting" --model seedream-4.5-t2i
# Then:
fairstack image "" --model recraft-remove-bg --image-url [previous-url]
```

## Lighting Prompts

| Style | Prompt Addition |
|-------|----------------|
| Soft studio | "soft diffused studio lighting" |
| Dramatic | "dramatic side lighting, deep shadows" |
| Natural | "warm natural window light" |
| Commercial | "bright even commercial lighting, no harsh shadows" |
| Premium | "dramatic rim lighting, dark background, spotlight" |

## Batch Product Catalog

```bash
# Generate consistent shots for a product line
PRODUCTS=("red sneakers" "blue sneakers" "white sneakers" "black sneakers")
for product in "${PRODUCTS[@]}"; do
  fairstack image "Professional product photo of ${product}, white background, studio lighting, commercial quality" \
    --model seedream-4.5-t2i &
done
wait
```

## Cost Planning

Use `--estimate` to plan batch costs:

```bash
fairstack image "test" --model flux-schnell --estimate
fairstack image "test" --model seedream-4.5-t2i --estimate
```

Multiply per-image cost by batch size.

## Related Skills

- `fairstack/skills@ai-image-generation` — Full model reference
- `fairstack/skills@compare-models` — Test lighting and style variations
