import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CONFIG_DIR = join(homedir(), ".fairstack");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

interface Config {
  apiKey?: string;
  baseUrl?: string;
}

function ensureConfigDir(): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function readConfig(): Config {
  if (!existsSync(CONFIG_FILE)) return {};
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
  } catch {
    return {};
  }
}

export function writeConfig(config: Config): void {
  ensureConfigDir();
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + "\n");
  chmodSync(CONFIG_FILE, 0o600);
}

export function getApiKey(): string {
  // Environment variable takes precedence
  const envKey = process.env.FAIRSTACK_API_KEY;
  if (envKey) return envKey;

  const config = readConfig();
  if (config.apiKey) return config.apiKey;

  // In dry-run mode, return a placeholder key so commands can build
  // the full request without a real key configured
  if (process.env.FAIRSTACK_DRY_RUN === "1") {
    return "fs_dry_run_placeholder";
  }

  console.error(
    "No API key found. Set FAIRSTACK_API_KEY environment variable or run: fairstack login"
  );
  process.exit(1);
}

export function getBaseUrl(): string {
  return (
    process.env.FAIRSTACK_BASE_URL ||
    readConfig().baseUrl ||
    "https://fairstack.ai"
  );
}
