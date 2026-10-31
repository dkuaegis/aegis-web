import { defineConfig } from "orval";

// `pnpm api:generate` turns openapi/aegis-server.json into typed fetch
// functions. Refresh the document first with `pnpm api:fetch` against a server
// that has the endpoints you need.
export default defineConfig({
  aegis: {
    input: { target: "./openapi/aegis-server.json" },
    output: {
      target: "./app/api/generated/endpoints.ts",
      schemas: "./app/api/generated/model",
      client: "fetch",
      mode: "single",
      clean: true,
      biome: true,
      override: {
        mutator: { path: "./app/api/client.ts", name: "apiFetch" },
        fetch: { includeHttpResponseReturnType: false },
      },
    },
  },
});
