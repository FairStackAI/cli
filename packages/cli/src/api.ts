import { getApiKey, getBaseUrl } from "./config.js";
import { isDryRun, buildDryRunOutput, buildMockResponse } from "./mock.js";

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

// Re-export isDryRun for consumers that need it
export { isDryRun } from "./mock.js";

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
    // Wrapped submit response (data.generation_id -- from /v1/video/generate etc.)
    if ("generation_id" in d) {
      return pollUntilDone(d.generation_id as string);
    }
  }

  // Flat submit response (from /v1/image/generate, /v1/video/generate, etc.)
  if ("generation_id" in raw) {
    const submit = raw as unknown as SubmitResponse;
    return pollUntilDone(submit.generation_id);
  }

  // Unknown format -- return as-is
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
  const qs = modality ? `?modality=${encodeURIComponent(modality)}` : "";
  return request<ModelListResponse>(`/v1/models${qs}`, { auth: false });
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
  const raw = await request<{ data: VoiceListResponse } | VoiceListResponse>(
    `/v1/voices${query ? "?" + query : ""}`,
    { auth: false }
  );
  // API wraps response in { request_id, data: { voices, pagination } }
  if ("data" in raw && raw.data && typeof raw.data === "object" && "voices" in raw.data) {
    return raw.data as VoiceListResponse;
  }
  return raw as VoiceListResponse;
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

// ── Style CRUD ───────────────────────────────────────────────────────

export interface StyleResponse {
  request_id: string;
  data: {
    styles: StyleItem[];
    categories: { id: string; label: string; description: string; count: number }[];
    total: number;
    preset_count: number;
    custom_count: number;
  };
}

export interface StyleItem {
  id: string;
  name: string;
  type: "preset" | "custom";
  category?: string;
  description?: string;
  prompt_prefix: string;
  prompt_suffix: string;
  negative_prompt: string;
  recommended_models: string[];
  created_at?: string;
  updated_at?: string;
}

export async function listStyles(): Promise<StyleResponse> {
  return request<StyleResponse>("/v1/styles", { auth: true });
}

export async function getStyle(
  nameOrId: string
): Promise<{ request_id: string; data: StyleItem }> {
  return request(`/v1/styles/${encodeURIComponent(nameOrId)}`);
}

export async function createStyle(params: {
  name: string;
  prompt_prefix?: string;
  prompt_suffix?: string;
  negative_prompt?: string;
  recommended_models?: string[];
}): Promise<{ request_id: string; data: StyleItem }> {
  return request("/v1/styles", {
    method: "POST",
    body: params as Record<string, unknown>,
  });
}

export async function deleteStyle(
  id: string
): Promise<{ request_id: string; data: { deleted: boolean; id: string; name: string } }> {
  return request(`/v1/styles/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// ── Generate at Scale ────────────────────────────────────────────────

export interface BatchGenerateResponse {
  request_id: string;
  data: {
    batch_id: string;
    status: string;
    total_prompts: number;
    estimated_cost: {
      total_usd: number;
      per_image_usd: number;
      credits_micro: number;
    };
    model: string;
    upgrade_model: string | null;
    style: string | null;
    poll_url: string;
    review_url: string;
  };
}

export interface BatchStatusResponse {
  request_id: string;
  data: {
    batch_id: string;
    status: string;
    progress: {
      completed: number;
      running: number;
      pending: number;
      failed: number;
    };
    cost: {
      incurred_usd: number;
      estimated_total_usd: number;
    };
    model: string;
    upgrade_model: string | null;
    style: string | null;
    total_prompts: number;
    generations: Array<{
      index: number;
      generation_id: string;
      status: string;
      prompt: string;
      model: string;
      output_url?: string;
      cost_micro?: number;
      upgraded: boolean;
      error?: string;
    }>;
  };
}

export async function generateAtScale(params: {
  modality: string;
  prompts?: string[];
  prompts_url?: string;
  style?: string;
  model: string;
  upgrade_model?: string;
  search_prompt?: boolean;
  options?: Record<string, unknown>;
}): Promise<BatchGenerateResponse> {
  return request<BatchGenerateResponse>("/v1/generate", {
    method: "POST",
    body: params as Record<string, unknown>,
  });
}

export async function getBatchStatus(
  batchId: string
): Promise<BatchStatusResponse> {
  return request<BatchStatusResponse>(`/v1/generate/${batchId}`);
}
