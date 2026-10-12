import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";

const scriptPath = path.resolve(process.cwd(), "docker/40-runtime-config.sh");
const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("production runtime configuration", () => {
  it("writes only explicitly approved public variables", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "aegis-runtime-config-"));
    temporaryDirectories.push(directory);
    const outputPath = path.join(directory, "runtime-config.js");
    const env = {
      ...process.env,
      RUNTIME_CONFIG_OUTPUT: outputPath,
      VITE_API_URL: "https://api.example.test",
      VITE_PRESIDENT_NAME_KO: "President Name (KO)",
      VITE_PRESIDENT_NAME_EN: "President Name (EN)",
      VITE_PRESIDENT_PHONE: "010-0000-0000",
      VITE_ADMIN_ACCOUNT_HOLDER_KO: "Account Holder (KO)",
      VITE_ADMIN_ACCOUNT_HOLDER_EN: "Account Holder (EN)",
      VITE_ADMIN_PHONE: "010-1111-1111",
      VITE_ADMIN_KAKAO: "https://open.kakao.example",
      VITE_ADMIN_ACCOUNT_NUMBER: "000-000-000000",
      VITE_KAKAO_NOTICEROOM_URL: "https://chat.example/notice",
      VITE_KAKAO_COMMUNITYROOM_URL: "https://chat.example/community",
      VITE_GA_MEASUREMENT_ID: "G-123456",
      VITE_GOOGLE_ANALYTICS_ID: "G-654321",
      VITE_MIXPANEL_PROJECT_TOKEN: "public-analytics-token",
      VITE_ENV: "production",
      VITE_API_PROXY_TARGET: "https://internal.example.test",
      VITE_DEV_BYPASS_AUTH: "true",
      VITE_SECRET_CANARY: "must-not-be-public",
    };
    const result = spawnSync("sh", [scriptPath], {
      encoding: "utf8",
      env,
    });

    expect(result.status, result.stderr).toBe(0);
    const output = readFileSync(outputPath, "utf8");
    const json = output.match(/^window\.__RUNTIME_CONFIG__ = (.*);$/m)?.[1];
    expect(json).toBeDefined();
    const config = JSON.parse(json ?? "{}");

    expect(config).toEqual({
      VITE_API_URL: "https://api.example.test",
      VITE_ADMIN_PHONE: "010-1111-1111",
      VITE_ADMIN_KAKAO: "https://open.kakao.example",
      VITE_ADMIN_ACCOUNT_NUMBER: "000-000-000000",
      VITE_ADMIN_ACCOUNT_HOLDER_KO: "Account Holder (KO)",
      VITE_ADMIN_ACCOUNT_HOLDER_EN: "Account Holder (EN)",
      VITE_KAKAO_NOTICEROOM_URL: "https://chat.example/notice",
      VITE_KAKAO_COMMUNITYROOM_URL: "https://chat.example/community",
      VITE_PRESIDENT_NAME_KO: "President Name (KO)",
      VITE_PRESIDENT_NAME_EN: "President Name (EN)",
      VITE_PRESIDENT_PHONE: "010-0000-0000",
      VITE_GA_MEASUREMENT_ID: "G-123456",
      VITE_GOOGLE_ANALYTICS_ID: "G-654321",
      VITE_MIXPANEL_PROJECT_TOKEN: "public-analytics-token",
      VITE_ENV: "production",
    });
    expect(output).not.toContain("must-not-be-public");
    expect(config).not.toHaveProperty("VITE_API_PROXY_TARGET");
    expect(config).not.toHaveProperty("VITE_DEV_BYPASS_AUTH");
    expect(config).not.toHaveProperty("VITE_SECRET_CANARY");
  });
});
