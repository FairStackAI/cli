#!/usr/bin/env bash
#
# Model Showdown — Compare image models head-to-head
#
# Usage:
#   bash examples/model-showdown/compare.sh
#   bash examples/model-showdown/compare.sh --prompt "A cyberpunk cityscape" --models "flux-schnell,recraft-v4"
#
# Dry run (no credits):
#   FAIRSTACK_DRY_RUN=1 bash examples/model-showdown/compare.sh

set -euo pipefail

# ── Defaults ───────────────────────────────────────────────────────────

DEFAULT_PROMPT="A photorealistic portrait of a ceramic coffee mug on a wooden desk, morning sunlight streaming through a window, steam rising, shallow depth of field, warm tones"
DEFAULT_MODELS="flux-schnell,seedream-4.5-t2i,gpt-image-1-mini"

PROMPT="$DEFAULT_PROMPT"
MODELS="$DEFAULT_MODELS"

# ── Parse Arguments ────────────────────────────────────────────────────

while [[ $# -gt 0 ]]; do
  case $1 in
    --prompt)
      PROMPT="$2"
      shift 2
      ;;
    --models)
      MODELS="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1"
      echo "Usage: compare.sh [--prompt \"...\"] [--models \"model1,model2,...\"]"
      exit 1
      ;;
  esac
done

# ── Display ────────────────────────────────────────────────────────────

echo ""
echo "Model Showdown"
echo "Prompt: \"${PROMPT:0:80}...\""
echo ""

# ── Step 1: Check pricing before running ───────────────────────────────

echo "Checking model prices..."
echo ""

IFS=',' read -ra MODEL_ARRAY <<< "$MODELS"

for model in "${MODEL_ARRAY[@]}"; do
  model=$(echo "$model" | xargs)  # trim whitespace
  echo "  $model:"
  fairstack estimate image "$PROMPT" --model "$model" 2>/dev/null || echo "    (estimate unavailable)"
  echo ""
done

# ── Step 2: Run the comparison ─────────────────────────────────────────

echo "Running comparison..."
echo ""

fairstack compare image "$PROMPT" --models "$MODELS"

echo ""

# ── Step 3: Show tips ──────────────────────────────────────────────────

echo ""
echo "Tips:"
echo "  - Open each URL in your browser to compare quality visually"
echo "  - Run with --raw for full JSON output (scriptable)"
echo "  - Use 'fairstack select-model \"your task\"' for AI-powered recommendations"
echo ""
echo "Get AI model recommendation:"
echo "  fairstack select-model \"photorealistic product photography\""
echo ""
echo "Browse all image models with live pricing:"
echo "  fairstack models --modality image"
echo ""
