import {
  chmodSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";

const scriptPath = path.resolve(process.cwd(), "scripts/deploy-coolify.sh");
const temporaryDirectories: string[] = [];

function runDeployment(responses: Array<Record<string, unknown>>) {
  const directory = mkdtempSync(path.join(tmpdir(), "aegis-coolify-test-"));
  temporaryDirectories.push(directory);
  const binDirectory = path.join(directory, "bin");
  const recordsPath = path.join(directory, "calls.json");
  mkdirSync(binDirectory);
  const fakeCurlPath = path.join(binDirectory, "curl");
  writeFileSync(
    fakeCurlPath,
    `#!/usr/bin/env node
const fs = require("node:fs");
const args = process.argv.slice(2);
const recordsPath = process.env.MOCK_CURL_RECORDS;
const records = fs.existsSync(recordsPath) ? JSON.parse(fs.readFileSync(recordsPath, "utf8")) : [];
const method = args[args.indexOf("--request") + 1];
const response = JSON.parse(process.env.MOCK_CURL_RESPONSES)[records.length] || {};
records.push({
  method,
  connectTimeout: args[args.indexOf("--connect-timeout") + 1],
  maxTime: args[args.indexOf("--max-time") + 1],
});
fs.writeFileSync(recordsPath, JSON.stringify(records));
if (response.body) fs.writeFileSync(args[args.indexOf("--output") + 1], response.body);
if (response.transportError) process.exit(response.transportError);
process.stdout.write(String(response.status || "000"));
`
  );
  chmodSync(fakeCurlPath, 0o755);

  const result = spawnSync("bash", [scriptPath], {
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: `${binDirectory}:${process.env.PATH}`,
      MOCK_CURL_RECORDS: recordsPath,
      MOCK_CURL_RESPONSES: JSON.stringify(responses),
      COOLIFY_URL: "https://coolify.example.test/private-base",
      COOLIFY_APP_UUID: "app-uuid-123",
      COOLIFY_WRITE_TOKEN: "write/token+canary?",
      COOLIFY_DEPLOY_TOKEN: "deploy%token=canary",
      WAF_DEPLOY_TOKEN: "waf token/canary",
      IMAGE_REPOSITORY: "ghcr.io/dkuaegis/aegis-web",
      IMAGE_TAG: "sha-0123456789abcdef",
    },
  });
  const records = JSON.parse(
    existsSync(recordsPath) ? readFileSync(recordsPath, "utf8") : "[]"
  ) as Array<{ method: string; connectTimeout: string; maxTime: string }>;
  return { result, records };
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("Coolify deployment script", () => {
  it("updates the image and then requests deployment with bounded timeouts", () => {
    const { result, records } = runDeployment([
      { status: 200, body: "updated" },
      { status: 202, body: "queued" },
    ]);

    expect(result.status, result.stderr).toBe(0);
    expect(records).toEqual([
      { method: "PATCH", connectTimeout: "10", maxTime: "30" },
      { method: "POST", connectTimeout: "10", maxTime: "30" },
    ]);
    expect(result.stdout).toContain("Coolify PATCH request succeeded (HTTP 200)");
    expect(result.stdout).toContain("Coolify POST request succeeded (HTTP 202)");
  });

  it("reports and redacts a rejected response without retrying", () => {
    const responseBody =
      "Rejected at https://coolify.example.test/private-base: " +
      "write/token+canary? write%2Ftoken%2Bcanary%3F " +
      "deploy%token=canary deploy%25token%3Dcanary waf token/canary waf%20token%2Fcanary";
    const { result, records } = runDeployment([
      { status: 403, body: responseBody },
      { status: 202, body: "must-not-be-requested" },
    ]);
    const output = `${result.stdout}\n${result.stderr}`;

    expect(result.status).not.toBe(0);
    expect(records).toHaveLength(1);
    expect(records[0]?.method).toBe("PATCH");
    expect(output).toContain("HTTP 403");
    expect(output).toContain("Response body (limited to 4096 bytes)");
    expect(output).toContain("[REDACTED]");
    expect(output).not.toContain("write/token+canary?");
    expect(output).not.toContain("write%2Ftoken%2Bcanary%3F");
    expect(output).not.toContain("deploy%token=canary");
    expect(output).not.toContain("deploy%25token%3Dcanary");
    expect(output).not.toContain("waf token/canary");
    expect(output).not.toContain("waf%20token%2Fcanary");
    expect(output).not.toContain("https://coolify.example.test/private-base");
  });

  it("reports transport timeouts and does not retry", () => {
    const { result, records } = runDeployment([{ transportError: 28 }]);
    const output = `${result.stdout}\n${result.stderr}`;

    expect(result.status).not.toBe(0);
    expect(records).toHaveLength(1);
    expect(output).toContain("HTTP 000");
    expect(output).toContain("curl exit 28");
    expect(output).not.toContain("write/token+canary?");
  });
});
