#!/usr/bin/env bun
/**
 * FairStack Skills Validator
 *
 * Finds every SKILL.md in tools/, models/, and guides/, extracts all
 * `fairstack ...` CLI commands and `curl ...` API commands from code
 * blocks, and validates each one:
 *
 * - CLI commands: run with FAIRSTACK_DRY_RUN=1 to verify they parse
 *   and execute without errors (no real API calls, no credits spent).
 * - curl commands: static validation of URL pattern, method, headers,
 *   and JSON body structure.
 *
 * Usage:
 *   bun tests/validate-skills.ts
 *   bun tests/validate-skills.ts --verbose     # show each command tested
 *   bun tests/validate-skills.ts --fix         # show suggested fixes for failures
 */

import { execSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

// ── Config ────────────────────────────────────────────────────────────

const SKILLS_ROOT = resolve(import.meta.dir, "..");
const CLI_BIN = resolve(SKILLS_ROOT, "packages/cli/dist/index.js");
const SKILL_DIRS = ["tools", "models", "guides"];
const API_BASE_URL = "https://fairstack.ai";

const verbose = process.argv.includes("--verbose");
const showFixes = process.argv.includes("--fix");

// ── Types ─────────────────────────────────────────────────────────────

interface SkillResult {
  path: string;
  name: string;
  cliExamples: ExampleResult[];
  curlExamples: ExampleResult[];
}

interface ExampleResult {
  line: number;
  command: string;
  pass: boolean;
  error?: string;
  skipped?: boolean;
  skipReason?: string;
}

// ── Find all SKILL.md files ───────────────────────────────────────────

function findSkillFiles(): string[] {
  const files: string[] = [];

  function walk(dir: string): void {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (entry === "SKILL.md") {
        files.push(full);
      }
    }
  }

  for (const subdir of SKILL_DIRS) {
    const dir = join(SKILLS_ROOT, subdir);
    try {
      walk(dir);
    } catch {
      // directory might not exist
    }
  }

  return files.sort();
}

// ── Extract commands from code blocks ─────────────────────────────────

interface ExtractedCommand {
  line: number;
  command: string;
  type: "cli" | "curl";
}

function extractCommands(content: string): ExtractedCommand[] {
  const commands: ExtractedCommand[] = [];
  const lines = content.split("\n");

  let inCodeBlock = false;
  let blockLang = "";
  let blockBuffer = "";
  let blockStartLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inCodeBlock && line.match(/^```(bash|sh|shell)?$/)) {
      inCodeBlock = true;
      blockLang = "bash";
      blockBuffer = "";
      blockStartLine = i + 1;
      continue;
    }

    if (inCodeBlock && line === "```") {
      // End of code block — flush buffer
      if (blockBuffer.trim()) {
        parseCommandBuffer(blockBuffer, blockStartLine, commands);
      }
      inCodeBlock = false;
      blockBuffer = "";
      continue;
    }

    if (inCodeBlock) {
      blockBuffer += line + "\n";
    }
  }

  return commands;
}

function parseCommandBuffer(
  buffer: string,
  startLine: number,
  commands: ExtractedCommand[]
): void {
  const lines = buffer.split("\n");

  // Join continuation lines (ending with \)
  const joinedLines: { text: string; line: number }[] = [];
  let current = "";
  let currentLine = startLine;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trimEnd();

    if (trimmed.endsWith("\\")) {
      if (!current) currentLine = startLine + i;
      current += trimmed.slice(0, -1).trim() + " ";
      continue;
    }

    if (current) {
      current += trimmed.trim();
      joinedLines.push({ text: current, line: currentLine + 1 });
      current = "";
    } else {
      joinedLines.push({ text: trimmed, line: startLine + i + 1 });
    }
  }

  for (const { text, line } of joinedLines) {
    const trimmed = text.trim();

    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Skip non-command lines (e.g. response JSON, plain text)
    if (trimmed.startsWith("{") || trimmed.startsWith('"') || trimmed.startsWith("//")) continue;

    // fairstack CLI commands
    if (trimmed.startsWith("fairstack ")) {
      commands.push({ line, command: trimmed, type: "cli" });
      continue;
    }

    // curl commands
    if (trimmed.startsWith("curl ")) {
      commands.push({ line, command: trimmed, type: "curl" });
      continue;
    }
  }
}

// ── CLI Command Validation ────────────────────────────────────────────

/** Commands or patterns that should be skipped (not executable) */
function shouldSkipCliCommand(cmd: string): string | null {
  // npm install is not a fairstack command
  if (cmd.startsWith("fairstack") === false) return "not a fairstack command";

  // login requires interactive input
  if (cmd.match(/^fairstack login\b/)) return "interactive command";

  // Commands with placeholders that can't be resolved
  if (cmd.includes("[step1-url]") || cmd.includes("[step2-url]"))
    return "contains unresolved placeholder [stepN-url]";
  if (cmd.includes("{id}") || cmd.includes("{generation_id}"))
    return "contains unresolved placeholder {id}";
  if (cmd.includes("xxx/yyy") || cmd.includes("xxx/step"))
    return "contains placeholder URL path (xxx/...)";
  if (/\bURL\b/.test(cmd) && !cmd.includes("http"))
    return "contains bare URL placeholder";

  // Reel subcommands that need stored state
  if (cmd.match(/^fairstack reel (character list|voice list|character create|voice select)/))
    return "reel management command (needs stored state)";
  if (cmd.match(/^fairstack reel create\b/))
    return "reel pipeline (needs character/voice profiles)";

  return null;
}

function normalizeCliCommand(cmd: string): string {
  // Replace environment variable references with dummy values
  let normalized = cmd.replace(/\$FAIRSTACK_API_KEY/g, "fs_dry_run_key");
  // Replace quoted strings that contain environment variables
  normalized = normalized.replace(/\$\{[^}]+\}/g, "placeholder");
  // Strip pipe to external tools (jq, grep, etc.) — we only validate
  // the fairstack command itself, not downstream processing
  normalized = normalized.replace(/\s*\|\s*(jq|grep|awk|sed|head|tail|wc|sort|uniq|tee|xargs)\b.*$/, "");
  return normalized;
}

function validateCliCommand(cmd: string): ExampleResult {
  const line = 0; // will be set by caller
  const skipReason = shouldSkipCliCommand(cmd);
  if (skipReason) {
    return { line, command: cmd, pass: true, skipped: true, skipReason };
  }

  const normalized = normalizeCliCommand(cmd);

  // Strip the "fairstack " prefix and run via node
  const args = normalized.replace(/^fairstack\s+/, "");

  try {
    execSync(`node ${CLI_BIN} ${args}`, {
      env: {
        ...process.env,
        FAIRSTACK_DRY_RUN: "1",
        FAIRSTACK_API_KEY: "fs_dry_run_test_key",
        // Prevent any real config from being used
        HOME: process.env.HOME,
        PATH: process.env.PATH,
        NODE_PATH: process.env.NODE_PATH,
      },
      timeout: 10_000,
      stdio: ["pipe", "pipe", "pipe"],
      maxBuffer: 5 * 1024 * 1024,
    });
    return { line, command: cmd, pass: true };
  } catch (err: unknown) {
    const execErr = err as { stderr?: Buffer; stdout?: Buffer; status?: number };
    const stderr = execErr.stderr?.toString().trim() || "";
    const stdout = execErr.stdout?.toString().trim() || "";
    const errorMsg = stderr || stdout || "Unknown error (exit code non-zero)";
    return { line, command: cmd, pass: false, error: errorMsg };
  }
}

// ── curl Command Validation ───────────────────────────────────────────

function validateCurlCommand(cmd: string): ExampleResult {
  const line = 0; // will be set by caller
  const errors: string[] = [];

  // Extract URL from curl command
  // URL can appear after -X METHOD, after flags, or just as a bare argument
  const urlMatch = cmd.match(/https?:\/\/[^\s'"]+/);
  if (!urlMatch) {
    // Some curl examples use variables like $FAIRSTACK_API_KEY in URL — that's OK
    // Check if it has fairstack.ai domain at all
    if (!cmd.includes("fairstack.ai")) {
      return { line, command: cmd, pass: true, skipped: true, skipReason: "no URL found (may be pseudocode)" };
    }
    return { line, command: cmd, pass: false, error: "no URL found in curl command" };
  }

  const url = urlMatch[0];

  // Check URL starts with our API base
  if (!url.startsWith(`${API_BASE_URL}/`)) {
    errors.push(`URL does not start with ${API_BASE_URL}/: ${url}`);
  }

  // Check URL path starts with /v1/
  const urlPath = url.replace(API_BASE_URL, "");
  if (!urlPath.startsWith("/v1/")) {
    errors.push(`URL path does not start with /v1/: ${urlPath}`);
  }

  // Determine method
  const methodMatch = cmd.match(/-X\s+(GET|POST|PUT|DELETE|PATCH)/i);
  const method = methodMatch ? methodMatch[1].toUpperCase() : "GET";

  // For POST, check Content-Type header is present
  if (method === "POST") {
    if (!cmd.includes("Content-Type") && !cmd.includes("content-type")) {
      errors.push("POST request missing Content-Type header");
    }

    // Check body is valid JSON (extract from -d flag)
    const bodyMatch = cmd.match(/-d\s+'([^']+)'/);
    if (bodyMatch) {
      try {
        JSON.parse(bodyMatch[1]);
      } catch {
        errors.push(`Invalid JSON body: ${bodyMatch[1].slice(0, 80)}`);
      }
    }
  }

  // Validate method is valid
  if (!["GET", "POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    errors.push(`Invalid HTTP method: ${method}`);
  }

  if (errors.length > 0) {
    return { line, command: cmd, pass: false, error: errors.join("; ") };
  }

  return { line, command: cmd, pass: true };
}

// ── Run Tests ─────────────────────────────────────────────────────────

function testSkill(filePath: string): SkillResult {
  const relPath = relative(SKILLS_ROOT, filePath).replace("/SKILL.md", "");
  const content = readFileSync(filePath, "utf-8");
  const commands = extractCommands(content);

  const cliExamples: ExampleResult[] = [];
  const curlExamples: ExampleResult[] = [];

  for (const cmd of commands) {
    if (cmd.type === "cli") {
      const result = validateCliCommand(cmd.command);
      result.line = cmd.line;
      cliExamples.push(result);
    } else if (cmd.type === "curl") {
      const result = validateCurlCommand(cmd.command);
      result.line = cmd.line;
      curlExamples.push(result);
    }
  }

  return {
    path: relPath,
    name: relPath.split("/").pop() || relPath,
    cliExamples,
    curlExamples,
  };
}

// ── Main ──────────────────────────────────────────────────────────────

function main(): void {
  console.log("FairStack Skills Validator\n");

  // Verify CLI is built
  try {
    statSync(CLI_BIN);
  } catch {
    console.error(`CLI not built. Run: cd packages/cli && npm run build`);
    process.exit(1);
  }

  const skillFiles = findSkillFiles();
  console.log(`Testing ${skillFiles.length} skills...\n`);

  const results: SkillResult[] = [];
  let totalExamples = 0;
  let totalPass = 0;
  let totalFail = 0;
  let totalSkipped = 0;
  const failures: { path: string; line: number; command: string; error: string }[] = [];

  for (const file of skillFiles) {
    const result = testSkill(file);
    results.push(result);

    const allExamples = [...result.cliExamples, ...result.curlExamples];
    const executed = allExamples.filter((e) => !e.skipped);
    const skipped = allExamples.filter((e) => e.skipped);
    const passed = executed.filter((e) => e.pass);
    const failed = executed.filter((e) => !e.pass);

    totalExamples += allExamples.length;
    totalPass += passed.length;
    totalFail += failed.length;
    totalSkipped += skipped.length;

    // Status line
    const status = failed.length > 0 ? "FAIL" : "ok";
    const counts = `${allExamples.length} examples, ${passed.length} pass, ${failed.length} fail${skipped.length > 0 ? `, ${skipped.length} skipped` : ""}`;
    console.log(`  ${status === "FAIL" ? "FAIL" : "  ok"} ${result.path}: ${counts}`);

    if (verbose) {
      for (const ex of allExamples) {
        const cmdPreview = ex.command.length > 80 ? ex.command.slice(0, 77) + "..." : ex.command;
        if (ex.skipped) {
          console.log(`       SKIP :${ex.line} ${cmdPreview} (${ex.skipReason})`);
        } else if (ex.pass) {
          console.log(`       PASS :${ex.line} ${cmdPreview}`);
        } else {
          console.log(`       FAIL :${ex.line} ${cmdPreview}`);
          console.log(`             ${ex.error}`);
        }
      }
    }

    for (const ex of failed) {
      failures.push({
        path: result.path,
        line: ex.line,
        command: ex.command,
        error: ex.error || "unknown error",
      });
    }
  }

  // ── Summary ──

  console.log(`\n${"=".repeat(60)}`);
  console.log(
    `Results: ${skillFiles.length} skills, ${totalExamples} examples, ` +
      `${totalPass} pass, ${totalFail} fail, ${totalSkipped} skipped`
  );

  if (failures.length > 0) {
    console.log(`\nFailures:\n`);
    for (const f of failures) {
      console.log(`  FAIL: ${f.path}/SKILL.md:${f.line}`);
      console.log(`        ${f.command.length > 100 ? f.command.slice(0, 97) + "..." : f.command}`);
      // Show first line of error
      const errorFirstLine = f.error.split("\n")[0];
      console.log(`        ${errorFirstLine.length > 100 ? errorFirstLine.slice(0, 97) + "..." : errorFirstLine}`);
      if (showFixes) {
        console.log(`        FIX: Review the command in ${f.path}/SKILL.md at line ${f.line}`);
      }
      console.log();
    }
  }

  if (totalFail > 0) {
    process.exit(1);
  } else {
    console.log("\nAll skills validated successfully.");
  }
}

main();
