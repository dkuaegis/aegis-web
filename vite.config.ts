import path from "node:path";
import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import { runtimeEnvPlugin } from "./scripts/runtimeEnvPlugin.ts";

const appRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [runtimeEnvPlugin(), tailwindcss(), svgr(), reactRouter()],
  resolve: {
    alias: {
      "@study": path.resolve(appRoot, "app/features/study"),
      "@join": path.resolve(appRoot, "app/features/join"),
      "@mypage": path.resolve(appRoot, "app/features/mypage"),
      "@app": path.resolve(appRoot, "app"),
    },
    dedupe: ["react", "react-dom", "react-router"],
  },
  build: {
    chunkSizeWarningLimit: 1500,
  },
});
