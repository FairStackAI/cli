# Today in History

Generate a "Today in History" image and voice narration for any date. This is a real workflow that FairStack powers — daily historical content for social media, newsletters, or educational platforms.

## What It Does

1. Takes a date and a historical event as input
2. Generates an image depicting the event (using Seedream for photorealism)
3. Generates a voice narration describing what happened
4. Outputs both files with a cost breakdown

## Usage

```bash
# Run with real API calls
npx tsx examples/today-in-history/generate.ts

# Test without credits
FAIRSTACK_DRY_RUN=1 npx tsx examples/today-in-history/generate.ts

# Custom date and event
npx tsx examples/today-in-history/generate.ts \
  --date "July 20, 1969" \
  --event "Apollo 11 lands on the Moon"
```

## Output

```
Today in History — July 20, 1969
Event: Apollo 11 lands on the Moon

[1/3] Estimating costs...
      Image: ~$0.039  (seedream-4.5-t2i)
      Voice: ~$0.012  (chatterbox-turbo)
      Total: ~$0.051

[2/3] Generating image...
      https://media.fairstack.ai/image/...

[3/3] Generating narration...
      https://media.fairstack.ai/voice/...

Done.
  Image URL:  https://media.fairstack.ai/image/...
  Audio URL:  https://media.fairstack.ai/voice/...
  Total cost: $0.048
```

## Customization

- Change the image model to `gpt-image-1-mini` or `ideogram-v3` for different styles
- Use `--voice` to pick a specific narrator from the voice library
- Add `--aspect-ratio landscape_16_9` for YouTube thumbnails
