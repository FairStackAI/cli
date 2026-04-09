# Product Launch

Generate every creative asset for a product launch in one script. This shows how FairStack replaces an entire creative pipeline — hero images, explainer video, voiceover, background music, and social media variations — all from a single command.

## What It Does

1. Estimates total cost before generating anything
2. Generates a hero image (product shot)
3. Generates social media variations (square, portrait, landscape)
4. Generates a voiceover for the explainer video
5. Generates background music
6. Generates an explainer video
7. Prints a summary with all URLs and total cost

## Usage

```bash
# Test the full pipeline without spending credits
FAIRSTACK_DRY_RUN=1 npx tsx examples/product-launch/generate-assets.ts

# Generate all assets for real
npx tsx examples/product-launch/generate-assets.ts
```

## Output

```
Product Launch Asset Generator
Product: FairStack CLI v2.0

[1/6] Estimating costs...
      Hero image:    ~$0.039
      Social (3x):   ~$0.117
      Voiceover:     ~$0.012
      Music:         ~$0.120
      Video:         ~$0.084
      ─────────────────────
      Total estimate: ~$0.372

[2/6] Generating hero image...
      https://media.fairstack.ai/image/...

[3/6] Generating social variations...
      Square (1:1):     https://media.fairstack.ai/image/...
      Portrait (4:3):   https://media.fairstack.ai/image/...
      Landscape (16:9): https://media.fairstack.ai/image/...

[4/6] Generating voiceover...
      https://media.fairstack.ai/voice/...

[5/6] Generating background music...
      https://media.fairstack.ai/music/...

[6/6] Generating explainer video...
      https://media.fairstack.ai/video/...

Launch Kit Complete.
  6 assets generated
  Total cost: $0.358
```

## Customization

Edit the `PRODUCT` and `TAGLINE` constants at the top of `generate-assets.ts` to generate assets for your own product.
