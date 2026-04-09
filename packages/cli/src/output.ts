import type { GenerationResponse, QuoteResponse } from "./api.js";

// ── Formatting helpers ─────────────────────────────────────────────────

export function formatCost(microDollars: number): string {
  const dollars = microDollars / 1_000_000;
  if (dollars < 0.001) return `$${dollars.toFixed(6)}`;
  if (dollars < 0.01) return `$${dollars.toFixed(4)}`;
  return `$${dollars.toFixed(3)}`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function printGeneration(res: GenerationResponse, raw: boolean): void {
  if (raw) {
    console.log(JSON.stringify(res, null, 2));
    return;
  }

  const d = res.data;
  const lines: string[] = [];

  if (d.status === "succeeded" && d.output?.url) {
    lines.push(d.output.url);
  }

  lines.push("");
  lines.push(`Status:  ${d.status}`);
  lines.push(`Model:   ${d.model}`);
  lines.push(`Type:    ${d.type}`);
  lines.push(
    `Cost:    ${formatCost(d.cost?.credits_used || d.cost?.estimated_credits || 0)}`
  );

  if (d.completed_at && d.created_at) {
    const elapsed =
      new Date(d.completed_at).getTime() - new Date(d.created_at).getTime();
    lines.push(`Time:    ${formatDuration(elapsed)}`);
  }

  lines.push(`ID:      ${d.id}`);

  console.log(lines.join("\n"));
}

export function printQuote(res: QuoteResponse, raw: boolean): void {
  if (raw) {
    console.log(JSON.stringify(res, null, 2));
    return;
  }

  const d = res.data;
  console.log(`Estimated cost: $${d.estimated_cost.cost.toFixed(4)}`);
  console.log(`Quote ID:       ${d.quote_id}`);
  console.log(`Expires in:     ${d.expires_in_sec}s`);
}

export function isQuote(res: unknown): res is QuoteResponse {
  const r = res as Record<string, unknown>;
  return (
    r.data !== undefined &&
    typeof r.data === "object" &&
    r.data !== null &&
    "quote_id" in (r.data as Record<string, unknown>)
  );
}

export function printJson(data: unknown, raw: boolean): void {
  if (raw) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  console.log(JSON.stringify(data, null, 2));
}

export function printTable(
  headers: string[],
  rows: string[][],
  widths?: number[]
): void {
  const computedWidths =
    widths ||
    headers.map((h, i) =>
      Math.max(h.length, ...rows.map((r) => (r[i] || "").length))
    );

  const pad = (s: string, w: number) => s.padEnd(w);
  const sep = computedWidths.map((w) => "-".repeat(w));

  console.log(headers.map((h, i) => pad(h, computedWidths[i])).join("  "));
  console.log(sep.join("  "));
  for (const row of rows) {
    console.log(
      row.map((c, i) => pad(c || "", computedWidths[i])).join("  ")
    );
  }
}

export function handleError(err: unknown): never {
  if (err instanceof Error) {
    console.error(`Error: ${err.message}`);
  } else {
    console.error("Unknown error:", err);
  }
  process.exit(1);
}
