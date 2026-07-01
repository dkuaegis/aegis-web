import path from "node:path";
import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const apiProxyPaths = [
  "/auth",
  "/oauth2",
  "/login/oauth2",
  "/members",
  "/studies",
  "/survey",
  "/payments",
  "/coupons",
  "/discord",
  "/points",
  "/point-draw",
  "/ranking",
  "/qrcode",
  "/profile",
];

const normalizeProxyTarget = (value: string | undefined) => {
  const trimmed = value?.trim().replace(/^["']|["']$/g, "");
  if (!trimmed) return undefined;
  const withoutTrailingSlash = trimmed.replace(/\/+$/, "");
  if (/^https?:\/\//i.test(withoutTrailingSlash)) {
    return withoutTrailingSlash;
  }
  return `http://${withoutTrailingSlash}`;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, appRoot, "");
  const apiProxyTarget = normalizeProxyTarget(
    env.VITE_API_PROXY_TARGET ?? env.VITE_API_URL ?? env.VITE_API_BASE_URL
  );

  return {
    plugins: [tailwindcss(), svgr(), reactRouter()],
    resolve: {
      alias: {
        "@study": path.resolve(appRoot, "app/features/study"),
        "@join": path.resolve(appRoot, "app/features/join"),
        "@mypage": path.resolve(appRoot, "app/features/mypage"),
        "@app": path.resolve(appRoot, "app"),
      },
      dedupe: ["react", "react-dom", "react-router", "react-router-dom"],
    },
    server: apiProxyTarget
      ? {
          proxy: Object.fromEntries(
            apiProxyPaths.map((apiPath) => [
              apiPath,
              {
                target: apiProxyTarget,
                changeOrigin: true,
                secure: false,
              },
            ])
          ),
        }
      : undefined,
    build: {
      chunkSizeWarningLimit: 1500,
    },
  };
});
