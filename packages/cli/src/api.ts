import { getApiKey, getBaseUrl } from "./config.js";

// ── Types ──────────────────────────────────────────────────────────────

export interface GenerationResponse {
  request_id: string;
  data: {
    id: string;
    type: string;
    status: "queued" | "processing" | "succeeded" | "failed" | "cancelled";
    model: string;
    input: Record<string, unknown>;
    output: { url: string; meta?: Record<string, unknown> } | null;
    error: string | null;
    created_at: string;
    started_at: string | null;
    completed_at: string | null;
    cost: {
      credits_used: number;
      estimated_credits: number;
      currency: string;
    };
    metrics: {
      queue_time_ms: number | null;
      generation_time_ms: number | null;
    };
    urls: Record<string, string>;
  };
}

export interface QuoteResponse {
  request_id: string;
  data: {
    quote_id: string;
    estimated_cost: {
      cost: number;
      cost_micro: number;
      currency: string;
    };
    expires_at: string;
    expires_in_sec: number;
  };
}

export interface ModelListResponse {
  request_id: string;
  data: {
    pricing: { note: string };
    image: ModelSummary[];
    video: ModelSummary[];
    voice: ModelSummary[];
    talkingHead: ModelSummary[];
    music: ModelSummary[];
    threeD: ModelSummary[];
    quality_tiers: Record<string, unknown>;
  };
}

export interface ModelSummary {
  id: string;
  name: string;
  type: string;
  provider: string;
  price: number;
  cost_per_request: number;
  quality_tier: string | null;
  accepts_image: boolean;
  supported_params: string[];
  parameter_options: Record<string, unknown>;
  tagline: string;
  best_for: string[];
  competitor_price: number | null;
  competitor_name: string | null;
  cheapest_in_type: boolean;
}

export interface VoiceListResponse {
  voices: Voice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Voice {
  id: string;
  name: string;
  archetype: string;
  accent: string;
  gender: string;
  language: string;
  tags: string[];
  description: string;
  sampleUrl: string;
  avatarUrl: string;
}

export interface SelectModelResponse {
  request_id: string;
  data: Record<string, unknown>;
  error?: { type: string; code: string; message: string };
}

export interface ApiError {
  request_id?: string;
  error: {
    type?: string;
    code: string;
    message: string;
    details?: unknown[];
  };
}

// ── Dry Run ───────────────────────────────────────────────────────────

/**
 * When FAIRSTACK_DRY_RUN=1 is set, all API requests are intercepted:
 * the full request (method, url, headers, body) is printed as JSON and
 * a mock response is returned so the CLI can complete without errors.
 *
 * This is used by the test suite to validate every CLI command without
 * making real API calls or spending credits.
 */
export function isDryRun(): boolean {
  return process.env.FAIRSTACK_DRY_RUN === "1";
}

function maskApiKey(key: string): string {
  if (key.length <= 10) return key.slice(0, 4) + "***";
  return key.slice(0, 8) + "***" + key.slice(-3);
}

function buildDryRunOutput(
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

/**
 * Mock responses that match the EXACT shapes observed in production.
 * Each endpoint returns its real format — no invented fields.
 *
 * Key difference: image submit is FLAT, video/voice/music/talking-head
 * submit is WRAPPED inside a `data` object. The generate() parser
 * handles both via separate code paths.
 */

// Permanent test assets on our CDN (real generations, won't 404)
const MOCK_IMAGE_URL = "https://media.fairstack.ai/image/122efc51-35ed-4ac6-aeae-26960429c3cd/78dffe77-9569-4445-8223-9e6da3a96ddb.png";
const MOCK_VOICE_URL = "https://media.fairstack.ai/voice/122efc51-35ed-4ac6-aeae-26960429c3cd/dfb31ad3-dc48-4bbc-a75c-3f4e3cdd4f4a.wav";

function buildMockResponse<T>(path: string, method: string, body?: Record<string, unknown>): T {
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

  // ── Image submit — FLAT (no data wrapper) ──
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

  // ── Video submit — WRAPPED (inside data) ──
  // Production shape: {request_id, data: {generation_id, job_id, status, poll_url, estimated_wait_sec, estimated_cost, estimated_cost_micro, currency, created_at, dashboard_url, tags}}
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

  // ── Voice submit — WRAPPED ──
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

  // ── Music submit — WRAPPED ──
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

  // ── Talking-head submit — WRAPPED ──
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
  // This is the response from GET /v1/generations/:id — same shape for all modalities
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

// ── HTTP Client ────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "DELETE";
    body?: Record<string, unknown>;
    auth?: boolean;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const { method = "GET", body, auth = true, headers = {} } = options;
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}`;

  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };
  if (auth) {
    reqHeaders["Authorization"] = `Bearer ${getApiKey()}`;
  }

  // Dry run: print request and return mock response
  if (isDryRun()) {
    const dryOutput = buildDryRunOutput(method, url, reqHeaders, body);
    console.log(JSON.stringify(dryOutput, null, 2));
    return buildMockResponse<T>(path, method, body);
  }

  const res = await fetch(url, {
    method,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = (await res.json()) as T | ApiError;

  if (!res.ok) {
    const err = json as ApiError;
    const msg = err.error?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return json as T;
}

// ── Polling ────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_TIME_MS = 10 * 60 * 1000; // 10 minutes

export async function pollUntilDone(
  generationId: string,
  timeoutMs: number = MAX_POLL_TIME_MS
): Promise<GenerationResponse> {
  // In dry-run mode, return immediately with a mock succeeded response
  if (isDryRun()) {
    return buildMockResponse<GenerationResponse>(
      `/v1/generations/${generationId}`,
      "GET"
    );
  }

  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const res = await request<GenerationResponse>(
      `/v1/generations/${generationId}`
    );
    const status = res.data.status;

    if (status === "succeeded") return res;
    if (status === "failed") {
      throw new Error(
        `Generation failed: ${res.data.error || "Unknown error"}`
      );
    }
    if (status === "cancelled") {
      throw new Error("Generation was cancelled");
    }

    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error(
    `Generation timed out after ${Math.round(timeoutMs / 1000)}s`
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Generation Commands ────────────────────────────────────────────────

interface GenerateOpts {
  model?: string;
  confirm?: boolean;
  wait?: number;
  [key: string]: unknown;
}

// Response from modality-specific endpoints (e.g. /v1/image/generate)
interface SubmitResponse {
  status: string;
  generation_id: string;
  model: string;
  message?: string;
  poll_url: string;
  dashboard_url: string;
}

async function generate(
  endpoint: string,
  body: Record<string, unknown>,
  opts: GenerateOpts
): Promise<GenerationResponse | QuoteResponse> {
  const { confirm = true, wait, ...extra } = opts;

  const payload: Record<string, unknown> = { ...body };
  if (!confirm) payload.confirm = false;

  // Filter out undefined values
  for (const key of Object.keys(payload)) {
    if (payload[key] === undefined) delete payload[key];
  }

  const headers: Record<string, string> = {};
  if (wait && confirm) {
    headers["Prefer"] = `wait=${wait}`;
  }

  // The modality-specific endpoints return different response shapes
  // depending on whether it's a quote, a data-wrapped response, or a flat submit
  const raw = await request<Record<string, unknown>>(endpoint, {
    method: "POST",
    body: payload,
    headers,
  });

  // Quote response (has quote_id in data or at top level)
  if (!confirm) {
    // Quote responses from modality endpoints wrap in {data: {quote_id, ...}}
    // or from legacy endpoints may be {request_id, data: {quote_id, ...}}
    if (raw.data && typeof raw.data === "object" && "quote_id" in (raw.data as Record<string, unknown>)) {
      return raw as unknown as QuoteResponse;
    }
    return raw as unknown as QuoteResponse;
  }

  // Data-wrapped response (from unified /v1/generations/:type endpoint)
  if (raw.data && typeof raw.data === "object") {
    const d = raw.data as Record<string, unknown>;
    // Completed generation (has id + status)
    if ("id" in d) {
      const genRes = raw as unknown as GenerationResponse;
      if (genRes.data.status === "succeeded") return genRes;
      return pollUntilDone(genRes.data.id);
    }
    // Wrapped submit response (data.generation_id — from /v1/video/generate etc.)
    if ("generation_id" in d) {
      return pollUntilDone(d.generation_id as string);
    }
  }

  // Flat submit response (from /v1/image/generate, /v1/video/generate, etc.)
  if ("generation_id" in raw) {
    const submit = raw as unknown as SubmitResponse;
    return pollUntilDone(submit.generation_id);
  }

  // Unknown format — return as-is
  return raw as unknown as GenerationResponse;
}

export async function generateImage(
  prompt: string,
  opts: GenerateOpts = {}
): Promise<GenerationResponse | QuoteResponse> {
  const { model, confirm, wait, ...rest } = opts;
  const body: Record<string, unknown> = { prompt };
  if (model) body.model = model;
  if (rest.aspect_ratio) body.aspect_ratio = rest.aspect_ratio;
  if (rest.image_url) body.image_url = rest.image_url;
  if (rest.negative_prompt) body.negative_prompt = rest.negative_prompt;
  if (rest.seed !== undefined) body.seed = rest.seed;

  return generate("/v1/image/generate", body, { confirm, wait });
}

export async function generateVideo(
  prompt: string,
  opts: GenerateOpts = {}
): Promise<GenerationResponse | QuoteResponse> {
  const { model, confirm, wait, ...rest } = opts;
  const body: Record<string, unknown> = { prompt };
  if (model) body.model = model;
  if (rest.image_url) body.image_url = rest.image_url;
  if (rest.video_url) body.video_url = rest.video_url;
  if (rest.duration) body.duration = rest.duration;
  if (rest.aspect_ratio) body.aspect_ratio = rest.aspect_ratio;

  return generate("/v1/video/generate", body, { confirm, wait });
}

export async function generateVoice(
  text: string,
  opts: GenerateOpts = {}
): Promise<GenerationResponse | QuoteResponse> {
  const { model, confirm, wait, ...rest } = opts;
  const body: Record<string, unknown> = { text };
  if (model) body.model = model;
  if (rest.voice) body.voice = rest.voice;
  if (rest.ref_audio_url) body.ref_audio_url = rest.ref_audio_url;
  if (rest.speed) body.speed = rest.speed;
  if (rest.language) body.language = rest.language;
  if (rest.emotion) body.emotion = rest.emotion;
  if (rest.emotion_vector) body.emotion_vector = rest.emotion_vector;
  if (rest.voice_description) body.voice_description = rest.voice_description;

  return generate("/v1/voice/generate", body, { confirm, wait });
}

export async function generateMusic(
  prompt: string,
  opts: GenerateOpts = {}
): Promise<GenerationResponse | QuoteResponse> {
  const { model, confirm, wait, ...rest } = opts;
  const body: Record<string, unknown> = { prompt };
  if (model) body.model = model;
  if (rest.duration) body.duration = rest.duration;
  if (rest.lyrics) body.lyrics = rest.lyrics;
  if (rest.instrumental !== undefined) body.instrumental = rest.instrumental;
  if (rest.tags) body.tags = rest.tags;

  return generate("/v1/music/generate", body, { confirm, wait });
}

export async function generateTalkingHead(
  opts: GenerateOpts = {}
): Promise<GenerationResponse | QuoteResponse> {
  const { model, confirm, wait, ...rest } = opts;
  const body: Record<string, unknown> = {};
  if (model) body.model = model;
  if (rest.image_url) body.image_url = rest.image_url;
  if (rest.audio_url) body.audio_url = rest.audio_url;

  return generate("/v1/talking-head/generate", body, { confirm, wait });
}

// ── Read-Only Commands ─────────────────────────────────────────────────

export async function listModels(
  modality?: string
): Promise<ModelListResponse> {
  return request<ModelListResponse>("/v1/models", { auth: false });
}

export async function getModelDetail(
  modelId: string
): Promise<{ request_id: string; data: Record<string, unknown> }> {
  return request("/v1/models/" + modelId, { auth: false });
}

export async function listVoices(params: {
  gender?: string;
  archetype?: string;
  language?: string;
  search?: string;
  limit?: number;
  page?: number;
}): Promise<VoiceListResponse> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) qs.set(k, String(v));
  }
  const query = qs.toString();
  return request<VoiceListResponse>(
    `/v1/voices${query ? "?" + query : ""}`,
    { auth: false }
  );
}

export async function selectModel(
  task: string,
  modality?: string
): Promise<SelectModelResponse> {
  const body: Record<string, unknown> = { task };
  if (modality) body.modality = modality;
  return request<SelectModelResponse>("/v1/select-model", {
    method: "POST",
    body,
    auth: true,
  });
}

export async function getAccount(): Promise<{
  request_id: string;
  data: {
    id: string;
    name: string;
    email: string;
    plan: { name: string; description: string };
    credits: { balance_microdollars: number; balance_usd: number };
    spending_cap: {
      monthly_microdollars: number | null;
      monthly_usd: number | null;
      used_this_month_microdollars: number;
      used_this_month_usd: number;
    };
    [key: string]: unknown;
  };
}> {
  return request("/v1/account");
}

export async function getGeneration(
  id: string
): Promise<GenerationResponse> {
  return request<GenerationResponse>(`/v1/generations/${id}`);
}
