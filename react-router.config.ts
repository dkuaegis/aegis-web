import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  // Only the home page is prerendered, so crawlers and the first paint get
  // real content. Every other path is served the SPA fallback.
  prerender: ["/"],
} satisfies Config;
