---
name: style-explore
description: "Explore visual styles at scale via FairStack. One API call generates all permutations of prompts x styles x models. Visual brand exploration, style testing, model-style comparison. Returns a grid with dimensional indices for side-by-side display. Use for: visual branding, style exploration, finding the right look, batch style testing, model-style comparison, brand visual identity, art direction, style audit. Triggers: style explore, style exploration, style test, visual exploration, brand exploration, compare styles, style grid, prompt matrix, style permutations, batch style, visual matrix, find the right style, test styles, style shootout, style explorer"
---

# Style Explorer

Generate all permutations of prompts, styles, and models in one API call. Test different looks before committing to mass production.

**The problem it solves:** You have 20 subjects, 4 visual styles, and 2 models. That's 160 images. Without the Style Explorer, you'd write 160 individual generation calls. With it, you send one request and get a grid you can compare visually.

## Quick Start (CLI)

```bash
# Install
npm install -g fairstack

# Generate a 2x2x2 exploration (8 images)
fairstack style-explore \
  --prompts "Luna 1 spacecraft 1959" "Battle of Gettysburg 1863" \
  --styles "photo-cinematic" "oil painting, rich impasto texture, gallery lighting" \
  --models gpt-image-1.5-t2i seedream-v4-t2i

# Poll results (CLI polls automatically, but if you need to check manually)
fairstack style-explore status explore_abc123

# List available style presets
fairstack styles
```

## Quick Start (curl)

```bash
# Submit exploration
curl -X POST https://fairstack.ai/v1/style-explore \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompts": ["Luna 1 spacecraft 1959", "Battle of Gettysburg 1863"],
    "styles": ["photo-cinematic", "oil painting, rich impasto texture, gallery lighting"],
    "models": ["gpt-image-1.5-t2i", "seedream-v4-t2i"],
    "options": { "width": 1024, "height": 576 }
  }'

# Response includes explore_id and cost estimate:
# {
#   "explore_id": "explore_abc123",
#   "total_permutations": 8,
#   "estimated_cost": { "cost": 0.312, "cost_micro": 312000, "currency": "USD" },
#   "status": "processing"
# }

# Poll for results
curl https://fairstack.ai/v1/style-explore/explore_abc123 \
  -H "Authorization: Bearer $FAIRSTACK_API_KEY"

# Results include dimensional indices for grid display:
# {
#   "explore_id": "explore_abc123",
#   "status": "completed",
#   "results": [
#     {
#       "prompt_index": 0,
#       "style_index": 0,
#       "model_index": 0,
#       "generation_id": "gen_...",
#       "output_url": "https://...",
#       "cost_micro": 39000,
#       "status": "completed"
#     },
#     ...
#   ]
# }
```

## API Reference

**`POST /v1/style-explore`**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompts` | string[] | Yes | List of prompts (subjects) |
| `styles` | string[] | Yes | Preset IDs or raw style description strings |
| `models` | string[] | Yes | Model IDs |
| `search_prompt` | boolean | No | Enrich prompts with web search context (runs once per unique prompt) |
| `options` | object | No | Shared generation options (`width`, `height`, `aspect_ratio`, `seed`, etc.) |

**`GET /v1/style-explore/{explore_id}`** -- Poll for results.

**`GET /v1/styles`** -- List available style presets (no auth required).

**Limits:** Max 100 total permutations (prompts x styles x models). If your exploration exceeds 100, reduce one dimension.

**Headers:** `Authorization: Bearer $FAIRSTACK_API_KEY`

## How Styles Work

The `styles` array accepts two types of values:

**Preset IDs** -- Reference a curated style from the presets library. These apply prompt prefix, suffix, and negative prompt automatically.

```bash
# Browse available presets
fairstack styles

# Via API (no auth required)
curl https://fairstack.ai/v1/styles | jq '.styles[] | {id, name, description}'
```

**Raw style strings** -- Any freeform text. Prepended to your prompt as-is. Use these for custom looks.

```json
{
  "styles": [
    "photo-cinematic",
    "Cinematic still, deep amber and gold lighting, honey-amber color grading, dark chocolate shadows"
  ]
}
```

You can mix presets and raw strings in the same exploration.

## Cost Estimation

The response includes a cost estimate before generations begin. Always check the estimate on large explorations.

```bash
# Check per-model pricing
fairstack models --detail gpt-image-1.5-t2i
fairstack models --detail seedream-v4-t2i

# Estimate a single generation
fairstack estimate image "test prompt" --model gpt-image-1.5-t2i

# Then calculate: (per-image cost) x (total permutations) = exploration cost
# For exact cost, the POST /v1/batch response includes estimated_cost
```

## Search Enrichment

When `search_prompt` is `true`, FairStack runs a web search for each unique prompt to add factual context. This is useful for historical subjects, real people, real places, or anything where visual accuracy matters.

```json
{
  "mode": "style_explore",
  "prompts": ["Luna 1 spacecraft 1959", "Battle of Gettysburg 1863"],
  "styles": ["photo-cinematic"],
  "models": ["gpt-image-1.5-t2i"],
  "search_prompt": true
}
```

Search runs once per unique prompt, not per permutation. A 20-prompt x 4-style x 2-model exploration runs 20 searches, not 160.

## Examples

### Visual Brand Exploration

Find the right visual style for a product line before generating hundreds of assets.

```bash
fairstack style-explore \
  --prompts "wireless earbuds on marble surface" "smartwatch on wrist, urban background" \
  --styles "photo-cinematic" "photo-studio" "minimal flat illustration" "watercolor sketch" \
  --models seedream-v4-t2i gpt-image-1.5-t2i
```

16 images. Compare styles across subjects and models. Pick the winner.

### Historical Image Series

Test visual treatments before committing to a full series.

```bash
fairstack style-explore \
  --prompts \
    "Apollo 11 Moon landing 1969" \
    "Fall of the Berlin Wall 1989" \
    "First airplane flight Kitty Hawk 1903" \
    "Signing of the Declaration of Independence 1776" \
    "March on Washington 1963" \
  --styles \
    "photo-cinematic" \
    "Cinematic still, deep amber and gold lighting, honey-amber color grading" \
    "editorial photography, high contrast black and white, dramatic shadows" \
  --models gpt-image-1.5-t2i seedream-v4-t2i \
  --search-prompt
```

30 images. Search enrichment adds historical accuracy. Review the grid, pick one style + model combo, then generate the full series of 800 images with confidence.

### Model Shootout for a Specific Style

Find which model renders a specific visual style best.

```bash
fairstack style-explore \
  --prompts "a coffee shop interior, morning light" "a mountain trail at golden hour" \
  --styles "Cinematic still, anamorphic lens flare, teal and orange color grading, shallow depth of field" \
  --models flux-schnell gpt-image-1.5-t2i seedream-v4-t2i ideogram-v3-t2i
```

8 images. Same style, same prompts, four models. Pure model quality comparison.

### Thumbnail Style Testing

Find the right look for a YouTube thumbnail series.

```bash
fairstack style-explore \
  --prompts \
    "close-up face with shocked expression" \
    "split screen comparison before and after" \
  --styles \
    "vibrant saturated colors, bold text, clean background" \
    "dark moody lighting, neon accents, cinematic" \
    "bright flat design, bold outlines, minimal" \
  --models gpt-image-1.5-t2i ideogram-v3-t2i
```

12 images. Review the grid at `/app/tools/style-explore` and pick the style that pops at thumbnail size.

### Blog Post Hero Image Consistency

Test whether a style holds up across different subjects before committing to a series.

```bash
fairstack style-explore \
  --prompts \
    "abstract visualization of machine learning" \
    "developer working at a standing desk" \
    "cloud infrastructure network diagram" \
  --styles \
    "Isometric 3D illustration, soft gradients, tech startup aesthetic" \
    "editorial illustration, limited color palette, grain texture" \
  --models gpt-image-1.5-t2i
```

6 images. A style that works for one subject might fall apart on another. Test the range before committing.

## Web UI

The Style Explorer has a visual comparison page at **`/app/tools/style-explore`**. Browse results as a grid with prompts on one axis, styles on another, and a model toggle. Much faster than scrolling through URLs.

## Tips

- **Start with 2x2x2.** Validate your prompts and styles work before scaling up.
- **Mix presets and raw strings.** Use presets for well-known looks, raw strings for custom experiments.
- **Search enrichment for real subjects.** Historical events, real products, named places -- turn on `search_prompt` for accuracy.
- **Cap at 100 permutations.** If you need more, split into multiple exploration calls.
- **Check the estimate.** The response includes `estimated_cost` before any generation begins.
- **Use the grid view.** The web UI at `/app/tools/style-explore` makes comparison much faster than scrolling through URLs.
- **Pick the winner, then batch.** The Style Explorer is for exploration. Once you've chosen a style + model, use standard batch generation for the full run.

## Pricing

All prices = infrastructure cost + 20% margin. Exploration cost = sum of individual generation costs across all permutations. Run `fairstack models --modality image` for current per-model pricing.

## Related Skills

- `fairstack/skills@batch-generation` -- Scale up after picking a winner
- `fairstack/skills@compare-models` -- Simpler side-by-side (same prompt, different models)
- `fairstack/skills@cost-estimator` -- Pre-flight cost estimation
- `fairstack/skills@ai-image-generation` -- Full image generation reference
- `fairstack/skills@smart-router` -- AI model selection
