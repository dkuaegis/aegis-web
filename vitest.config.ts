import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@study": path.resolve(root, "app/features/study"),
      "@join": path.resolve(root, "app/features/join"),
      "@mypage": path.resolve(root, "app/features/mypage"),
      "@app": path.resolve(root, "app"),
    },
  },
  test: {
    environment: "jsdom",
    include: ["app/**/*.test.{ts,tsx}", "scripts/**/*.test.{mjs,ts}"],
    restoreMocks: true,
  },
});
