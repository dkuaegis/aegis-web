import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  future: {
    v8_middleware: false,
    v8_passThroughRequests: false,
    v8_splitRouteModules: false,
    v8_trailingSlashAwareDataRequests: false,
    v8_viteEnvironmentApi: false,
  },
} satisfies Config;
