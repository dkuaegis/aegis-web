// Downloads the aegis-server OpenAPI document and keeps only what this web app
// may call, so the generated client never exposes admin or dev endpoints.
//
//   node scripts/fetch-openapi.mjs [url]
//
// The default is a locally running server (`./gradlew bootRun`).
import { writeFile } from "node:fs/promises";

const source = process.argv[2] ?? "http://localhost:8080/docs/api";
const target = new URL("../openapi/aegis-server.json", import.meta.url);

const EXCLUDED_PATH_PREFIXES = ["/admin", "/dev", "/internal", "/auth/error"];

const response = await fetch(source);
if (!response.ok) {
  throw new Error(`Failed to fetch ${source}: ${response.status}`);
}
const document = await response.json();

document.servers = [];
// The browser authenticates with the session cookie; the OAuth scheme the
// server documents for Swagger UI is incomplete and irrelevant here.
delete document.security;
delete document.components.securitySchemes;
document.paths = Object.fromEntries(
  Object.entries(document.paths).filter(
    ([path]) => !EXCLUDED_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))
  )
);

// Drop schemas that only the excluded endpoints referenced.
const schemas = document.components.schemas;
const reachable = new Set();
const visit = (node) => {
  if (Array.isArray(node)) {
    for (const item of node) visit(item);
    return;
  }
  if (!node || typeof node !== "object") return;
  for (const [key, value] of Object.entries(node)) {
    if (key === "$ref" && typeof value === "string") {
      const name = value.replace("#/components/schemas/", "");
      if (!reachable.has(name)) {
        reachable.add(name);
        visit(schemas[name]);
      }
    } else {
      visit(value);
    }
  }
};
visit(document.paths);
document.components.schemas = Object.fromEntries(
  Object.keys(schemas)
    .filter((name) => reachable.has(name))
    .sort()
    .map((name) => [name, schemas[name]])
);

await writeFile(target, `${JSON.stringify(document, null, 2)}\n`);
console.log(
  `Saved ${Object.keys(document.paths).length} paths and ${reachable.size} schemas to openapi/aegis-server.json`
);
