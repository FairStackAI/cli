---
name: ai-automation-workflows
description: "Automate content generation workflows with FairStack API. Covers scripting, batch processing, scheduled generation, CI/CD integration. Triggers: automation, automated content, scheduled generation, content automation, batch processing, ci cd ai, automated workflow"
---

# AI Automation Workflows

Automate content generation with scripts, cron jobs, and CI/CD pipelines.

## Bash Automation

```bash
#!/bin/bash
# Daily social media image generator
TOPICS=("productivity tips" "ai news" "developer tools" "startup advice" "tech trends")
TODAY=$(date +%A)
TOPIC=${TOPICS[$((RANDOM % ${#TOPICS[@]}))]}

fairstack image "Clean modern illustration about ${TOPIC}, social media style, vibrant colors" \
  --model flux-schnell --aspect-ratio landscape_16_9

echo "Generated ${TODAY}'s social image about: ${TOPIC}"
```

## JavaScript Automation

```javascript
// Generate weekly content batch
const topics = ["AI trends", "Productivity", "Developer tools"];

for (const topic of topics) {
  const res = await fetch("https://fairstack.ai/v1/image/generate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FAIRSTACK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: `Social media image about ${topic}`,
      model: "flux-schnell",
    }),
  });
  console.log(await res.json());
}
```

## CLI Batch

```bash
# Generate 10 images in parallel
for i in $(seq 1 10); do
  fairstack image "Variant $i of product shot" --model flux-schnell &
done
wait
```

## Related Skills

- `fairstack/skills@workflow/batch-generation` — Batch generation patterns
- `fairstack/skills@developer/api-integration` — API integration guide
