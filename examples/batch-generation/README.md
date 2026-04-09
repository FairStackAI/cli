# Batch Generation

Batch-generate images from a list of prompts with cost tracking. This shows how to build production workflows that process hundreds of prompts efficiently — estimate costs first, then generate with progress tracking.

## What It Does

1. Reads prompts from a text file (one per line)
2. Estimates total cost before generating anything
3. Generates all images with a progress bar
4. Outputs a results file with URLs and per-item costs
5. Prints a summary with total cost and success rate

## Usage

```bash
# Test with the included sample prompts
FAIRSTACK_DRY_RUN=1 npx tsx examples/batch-generation/batch.ts

# Generate for real
npx tsx examples/batch-generation/batch.ts

# Custom prompt file and model
npx tsx examples/batch-generation/batch.ts --file my-prompts.txt --model ideogram-v3
```

## Prompt File Format

One prompt per line. Empty lines and lines starting with `#` are skipped.

```
# Product shots for the catalog
A minimalist wireless charger on a marble surface, studio lighting
A leather laptop bag on a wooden desk, warm afternoon light
A pair of noise-cancelling headphones on a white background, soft shadows
```

## Output

```
Batch Image Generator
Prompts: 5 from prompts.txt
Model:   flux-schnell

[1/3] Estimating total cost...
      5 images x ~$0.003 each
      Total estimate: ~$0.015

[2/3] Generating (5 images)...
      [1/5] A minimalist wireless charger...    $0.003  1.1s
      [2/5] A leather laptop bag...             $0.003  1.3s
      [3/5] A pair of noise-cancelling...       $0.003  1.2s
      [4/5] A ceramic plant pot...              $0.003  0.9s
      [5/5] A stainless steel water bottle...   $0.003  1.1s

[3/3] Results saved to batch-results.json

Summary:
  Generated:  5/5 (100%)
  Total cost: $0.015
  Avg time:   1.1s per image
```
