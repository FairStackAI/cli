#!/usr/bin/env bash
#
# Social Reel — Full video reel production pipeline
#
# Usage:
#   bash examples/social-reel/create-reel.sh             # Full run
#   bash examples/social-reel/create-reel.sh --dry-run    # Preview the pipeline
#
# Prerequisites:
#   - fairstack CLI installed (npm install -g fairstack)
#   - ffmpeg installed
#   - FAIRSTACK_API_KEY set or fairstack login completed
#
# For testing without API calls:
#   FAIRSTACK_DRY_RUN=1 bash examples/social-reel/create-reel.sh

set -euo pipefail

# ── Configuration ──────────────────────────────────────────────────────

CHARACTER_NAME="alex"
PRODUCT_NAME="demo"
VOICE_NAME="narrator"
VOICE_ID="internal_marco"
OUTPUT_FILE="reel.mp4"

# The script for our reel — a 30-second product launch announcement
SCRIPT="Introducing the next generation of AI-powered content creation. \
With FairStack, you get access to thirty-five models across five modalities — \
image, video, voice, music, and talking head — all through a single CLI. \
No vendor lock-in. No per-seat pricing. Just fair, transparent costs \
based on what you actually use. Try it free today."

CHARACTER_PROMPT="Professional tech presenter, mid-30s, confident smile, \
wearing a dark navy blazer over a light gray t-shirt, clean modern office \
background with soft natural lighting, headshot portrait, photorealistic, \
high detail"

MUSIC_PROMPT="Upbeat corporate background music, modern and energetic, \
light electronic beats, inspiring, 30 seconds, no vocals"

# ── Parse flags ────────────────────────────────────────────────────────

DRY_RUN=""
for arg in "$@"; do
  case $arg in
    --dry-run) DRY_RUN="--dry-run" ;;
  esac
done

# ── Functions ──────────────────────────────────────────────────────────

header() {
  echo ""
  echo "============================================"
  echo "  FairStack Reel Pipeline"
  echo "============================================"
  echo ""
}

step() {
  echo "[$1] $2"
}

# ── Main ───────────────────────────────────────────────────────────────

header

# Step 1: Create the character (idempotent — skips if already exists)
step "1/4" "Setting up character: $CHARACTER_NAME"
echo "      Prompt: ${CHARACTER_PROMPT:0:60}..."
echo ""

# Check if character already exists by listing characters
if fairstack reel character list 2>/dev/null | grep -q "$PRODUCT_NAME/$CHARACTER_NAME"; then
  echo "      Character already exists, skipping creation."
else
  echo "      Creating character portrait..."
  fairstack reel character create \
    --name "$CHARACTER_NAME" \
    --product "$PRODUCT_NAME" \
    --prompt "$CHARACTER_PROMPT"
fi
echo ""

# Step 2: Select the voice (idempotent — skips if already exists)
step "2/4" "Setting up voice: $VOICE_NAME"

if fairstack reel voice list 2>/dev/null | grep -q "$VOICE_NAME"; then
  echo "      Voice already selected, skipping."
else
  echo "      Selecting voice: $VOICE_ID"
  fairstack reel voice select \
    --name "$VOICE_NAME" \
    --voice-id "$VOICE_ID"
fi
echo ""

# Step 3: Preview with dry run
if [ -n "$DRY_RUN" ]; then
  step "3/4" "Pipeline preview (dry run)"
  echo ""
  fairstack reel create \
    --character "$CHARACTER_NAME" \
    --voice "$VOICE_NAME" \
    --script "$SCRIPT" \
    --output "$OUTPUT_FILE" \
    --music "$MUSIC_PROMPT" \
    --captions \
    --dry-run
  echo ""
  echo "To run for real, remove the --dry-run flag."
  exit 0
fi

# Step 3: Generate the reel (real run)
step "3/4" "Generating reel..."
echo "      Character:  $CHARACTER_NAME"
echo "      Voice:      $VOICE_NAME"
echo "      Music:      yes"
echo "      Captions:   yes"
echo "      Format:     9:16 (vertical)"
echo "      Output:     $OUTPUT_FILE"
echo ""

fairstack reel create \
  --character "$CHARACTER_NAME" \
  --voice "$VOICE_NAME" \
  --script "$SCRIPT" \
  --output "$OUTPUT_FILE" \
  --music "$MUSIC_PROMPT" \
  --captions \
  --format "9:16"

# Step 4: Summary
step "4/4" "Done"
echo ""
echo "      Output: $OUTPUT_FILE"
echo ""
echo "  Post this reel to:"
echo "    - Instagram Reels (9:16 vertical)"
echo "    - TikTok"
echo "    - YouTube Shorts"
echo ""
echo "  To create a landscape version for YouTube/LinkedIn:"
echo "    fairstack reel create \\"
echo "      --character $CHARACTER_NAME \\"
echo "      --voice $VOICE_NAME \\"
echo "      --script \"...\" \\"
echo "      --output reel-landscape.mp4 \\"
echo "      --format 16:9"
echo ""
