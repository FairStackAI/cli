/**
 * Dry-run mock infrastructure.
 *
 * When FAIRSTACK_DRY_RUN=1 is set, all API requests are intercepted:
 * the full request (method, url, headers, body) is printed as JSON and
 * a mock response is returned so the CLI can complete without errors.
 *
 * This is used by the test suite to validate every CLI command without
 * making real API calls or spending credits.
 */

// ── Dry Run Detection ─────────────────────────────────────────────────

export function isDryRun(): boolean {
  return process.env.FAIRSTACK_DRY_RUN === "1";
}

// ── Request Output ────────────────────────────────────────────────────

function maskApiKey(key: string): string {
  if (key.length <= 10) return key.slice(0, 4) + "***";
  return key.slice(0, 8) + "***" + key.slice(-3);
}

export function buildDryRunOutput(
  method: string,
  url: string,
  headers: Record<string, string>,
  body?: Record<string, unknown>
): Record<string, unknown> {
  const masked = { ...headers };
  if (masked["Authorization"]) {
    masked["Authorization"] = `Bearer ${maskApiKey(masked["Authorization"].replace("Bearer ", ""))}`;
  }

  const output: Record<string, unknown> = { method, url, headers: masked };
  if (body) output.body = body;
  return output;
}

// ── Mock Responses ────────────────────────────────────────────────────

/**
 * Mock responses that match the EXACT shapes observed in production.
 * Each endpoint returns its real format -- no invented fields.
 *
 * Key difference: image submit is FLAT, video/voice/music/talking-head
 * submit is WRAPPED inside a `data` object. The generate() parser
 * handles both via separate code paths.
 */

// Permanent test assets on our CDN (real generations, won't 404)
const MOCK_IMAGE_URL = "https://media.fairstack.ai/image/122efc51-35ed-4ac6-aeae-26960429c3cd/78dffe77-9569-4445-8223-9e6da3a96ddb.png";
const MOCK_VOICE_URL = "https://media.fairstack.ai/voice/122efc51-35ed-4ac6-aeae-26960429c3cd/dfb31ad3-dc48-4bbc-a75c-3f4e3cdd4f4a.wav";

export function buildMockResponse<T>(path: string, method: string, body?: Record<string, unknown>): T {
  const now = new Date().toISOString();
  const genId = `gen_mock_${Date.now().toString(36)}`;

  // ── Quote response (confirm: false) ──
  if (body && body.confirm === false) {
    return {
      mock: true,
      request_id: "req_mock_quote_001",
      data: {
        quote_id: "qt_mock_001",
        estimated_cost: { cost: 0.039, cost_micro: 39000, currency: "USD" },
        expires_at: new Date(Date.now() + 60_000).toISOString(),
        expires_in_sec: 60,
      },
    } as T;
  }

  // ── Image submit -- FLAT (no data wrapper) ──
  // Production shape: {status, generation_id, model, poll_url, dashboard_url, estimated_cost_micro}
  if (method === "POST" && /\/image\/generate/.test(path)) {
    const model = (body?.model as string) || "flux-schnell";
    return {
      mock: true,
      status: "queued",
      generation_id: genId,
      model,
      poll_url: `/v1/generations/${genId}`,
      dashboard_url: `https://fairstack.ai/app/library/${genId}`,
      estimated_cost_micro: 3600,
    } as T;
  }

  // ── Video submit -- WRAPPED (inside data) ──
  if (method === "POST" && /\/video\/generate/.test(path)) {
    return {
      mock: true,
      request_id: `req_mock_${Date.now().toString(36)}`,
      data: {
        generation_id: genId,
        job_id: genId,
        status: "queued",
        poll_url: `/v1/generations/${genId}`,
        estimated_wait_sec: 60,
        estimated_cost: 0.084,
        estimated_cost_micro: 84000,
        currency: "USD",
        created_at: now,
        dashboard_url: `https://fairstack.ai/app/generations/${genId}`,
        tags: [],
      },
    } as T;
  }

  // ── Voice submit -- WRAPPED ──
  if (method === "POST" && /\/voice\/generate/.test(path)) {
    return {
      mock: true,
      request_id: `req_mock_${Date.now().toString(36)}`,
      data: {
        generation_id: genId,
        job_id: genId,
        status: "queued",
        poll_url: `/v1/generations/${genId}`,
        estimated_wait_sec: 15,
        estimated_cost: 0.012,
        estimated_cost_micro: 12000,
        currency: "USD",
        created_at: now,
        dashboard_url: `https://fairstack.ai/app/generations/${genId}`,
        tags: [],
      },
    } as T;
  }

  // ── Music submit -- WRAPPED ──
  if (method === "POST" && /\/music\/generate/.test(path)) {
    return {
      mock: true,
      request_id: `req_mock_${Date.now().toString(36)}`,
      data: {
        generation_id: genId,
        job_id: genId,
        status: "queued",
        poll_url: `/v1/generations/${genId}`,
        estimated_wait_sec: 90,
        estimated_cost: 0.120,
        estimated_cost_micro: 120000,
        currency: "USD",
        created_at: now,
        dashboard_url: `https://fairstack.ai/app/generations/${genId}`,
        tags: [],
      },
    } as T;
  }

  // ── Talking-head submit -- WRAPPED ──
  if (method === "POST" && /\/talking-head\/generate/.test(path)) {
    return {
      mock: true,
      request_id: `req_mock_${Date.now().toString(36)}`,
      data: {
        generation_id: genId,
        job_id: genId,
        status: "queued",
        poll_url: `/v1/generations/${genId}`,
        estimated_wait_sec: 120,
        estimated_cost: 0.096,
        estimated_cost_micro: 96000,
        currency: "USD",
        created_at: now,
        dashboard_url: `https://fairstack.ai/app/generations/${genId}`,
        tags: [],
      },
    } as T;
  }

  // ── Select model ──
  if (path === "/v1/select-model") {
    return {
      mock: true,
      request_id: "req_mock_select_001",
      data: {},
      recommendation: {
        model: "flux-schnell",
        display_name: "FLUX.1 Schnell",
        cost_per_unit: 0.003,
        unit: "image",
        reasoning: "Best balance of speed and quality for general image generation.",
      },
      alternatives: [
        {
          model: "seedream-4.5-t2i",
          display_name: "Seedream 4.5",
          cost_per_unit: 0.039,
          unit: "image",
          tradeoff: "Higher quality photorealism, 10x cost",
        },
      ],
      cost: { cost_usd: 0.002 },
    } as T;
  }

  // ── Models list ──
  if (path === "/v1/models" && method === "GET") {
    const stub = [{
      id: "flux-schnell", name: "FLUX.1 Schnell", type: "t2i", price: 0.003,
      provider: "runpod", cost_per_request: 0.003, quality_tier: "standard",
      accepts_image: false, supported_params: ["prompt", "aspect_ratio", "seed"],
      parameter_options: {}, tagline: "Fast, high-quality image generation",
      best_for: ["drafts", "iteration"], competitor_price: null,
      competitor_name: null, cheapest_in_type: true,
    }];
    return {
      mock: true,
      request_id: "req_mock_models_001",
      data: {
        pricing: { note: "All prices = infrastructure cost + 20% margin" },
        image: stub, video: stub, voice: stub, talkingHead: stub, music: stub,
        threeD: [], quality_tiers: {},
      },
    } as T;
  }

  // ── Model detail ──
  if (/^\/v1\/models\//.test(path) && method === "GET") {
    const modelId = path.split("/").pop();
    return {
      mock: true,
      request_id: "req_mock_detail_001",
      data: {
        id: modelId, name: modelId, type: "t2i", provider: "runpod",
        pricing: { cost_per_request: 0.003, currency: "USD" },
        parameters: { prompt: { type: "string", required: true } },
      },
    } as T;
  }

  // ── Voices ──
  if (path.startsWith("/v1/voices")) {
    return {
      mock: true,
      voices: [{
        id: "internal_marco", name: "Marco", archetype: "narrator",
        accent: "latin-american", gender: "male", language: "en",
        tags: ["warm", "internal"],
        description: "Warm Latin narrator with a grounded, natural delivery",
        sampleUrl: MOCK_VOICE_URL,
        avatarUrl: MOCK_IMAGE_URL,
      }],
      pagination: { page: 1, limit: 50, total: 1, totalPages: 1 },
    } as T;
  }

  // ── Account / balance ──
  if (path === "/v1/account") {
    return {
      mock: true,
      request_id: "req_mock_account_001",
      data: {
        id: "usr_mock_001", name: "Test User", email: "test@fairstack.ai",
        plan: { name: "standard", description: "Standard" },
        credits: { balance_microdollars: 100_000_000, balance_usd: 100.0 },
        spending_cap: {
          monthly_microdollars: null, monthly_usd: null,
          used_this_month_microdollars: 5_200_000, used_this_month_usd: 5.2,
        },
      },
    } as T;
  }

  // ── Generation status (poll result) ──
  if (/^\/v1\/generations\//.test(path) && method === "GET") {
    const id = path.split("/").pop()!;
    const startedAt = new Date(Date.now() - 1200).toISOString();
    return {
      mock: true,
      request_id: "req_mock_status_001",
      data: {
        id,
        type: "image",
        status: "succeeded",
        model: "flux-schnell",
        input: {},
        output: { url: MOCK_IMAGE_URL, meta: {} },
        error: null,
        created_at: startedAt,
        started_at: startedAt,
        completed_at: now,
        cost: { credits_used: 3600, estimated_credits: 3600, currency: "microdollars" },
        metrics: { queue_time_ms: 45, generation_time_ms: 1100 },
        urls: {},
      },
    } as T;
  }

  // Fallback
  return { mock: true, request_id: "req_mock_fallback", data: {} } as T;
}
