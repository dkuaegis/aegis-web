import { readFile } from "node:fs/promises";
import path from "node:path";
import { type ESTree, loadEnv, type Plugin, parseSync, Visitor } from "vite";

const runtimeConfigName = "__RUNTIME_CONFIG__";

/**
 * Names of the `VITE_*` variables the client code reads. The container start
 * script injects only these, so unrelated variables in the deployment
 * environment never end up in the page source.
 */
export const runtimeEnvKeysFile = "runtime-env-keys.json";

function isViteEnvironmentAccess(
  node: ESTree.MemberExpression
): node is ESTree.StaticMemberExpression {
  if (node.computed || !node.property.name.startsWith("VITE_")) return false;
  const environment = node.object;
  if (
    environment.type !== "MemberExpression" ||
    environment.computed ||
    environment.property.name !== "env"
  ) {
    return false;
  }
  const meta = environment.object;
  return (
    meta.type === "MetaProperty" &&
    meta.meta.name === "import" &&
    meta.property.name === "meta"
  );
}

function runtimeConfigScript(config: Record<string, string>) {
  // Escape "<" so a value can never close the inline script tag.
  const json = JSON.stringify(config).replaceAll("<", "\\u003c");
  return `window.${runtimeConfigName}=${json};`;
}

export function runtimeEnvPlugin(): Plugin {
  const usedKeys = new Set<string>();
  let root = process.cwd();
  let mode = "production";

  return {
    name: "runtime-env",
    apply: (_, env) => env.command === "build" || env.isPreview === true,
    enforce: "pre",
    configResolved(config) {
      root = config.root;
      mode = config.mode;
    },
    transform(code, id) {
      const fileName = id.split("?", 1)[0];
      if (
        !/\.[cm]?[jt]sx?$/.test(fileName) ||
        fileName.includes("/node_modules/")
      ) {
        return;
      }

      const { program } = parseSync(fileName, code);
      const replacements: Array<{ start: number; end: number; value: string }> =
        [];

      new Visitor({
        MemberExpression(node) {
          if (!isViteEnvironmentAccess(node)) return;
          usedKeys.add(node.property.name);
          replacements.push({
            start: node.start,
            end: node.end,
            value: `(typeof window === "undefined" ? undefined : window.${runtimeConfigName}.${node.property.name})`,
          });
        },
      }).visit(program);
      if (replacements.length === 0) return;

      let transformed = code;
      for (const replacement of replacements.sort(
        (a, b) => b.start - a.start
      )) {
        transformed =
          transformed.slice(0, replacement.start) +
          replacement.value +
          transformed.slice(replacement.end);
      }
      return { code: transformed, map: null };
    },
    generateBundle() {
      if (this.environment.name !== "client") return;
      this.emitFile({
        type: "asset",
        fileName: runtimeEnvKeysFile,
        source: JSON.stringify([...usedKeys].sort()),
      });
    },
    // `vite preview` has no container start script, so fill the runtime config
    // from the local .env files the same way the container would.
    configurePreviewServer(server) {
      const outDir = path.resolve(root, server.config.build.outDir);
      server.middlewares.use(async (req, res, next) => {
        const accept = req.headers.accept ?? "";
        if (req.method !== "GET" || !accept.includes("text/html")) {
          return next();
        }
        try {
          const [html, keysJson] = await Promise.all([
            readFile(path.join(outDir, "index.html"), "utf8"),
            readFile(path.join(outDir, runtimeEnvKeysFile), "utf8"),
          ]);
          const env = loadEnv(mode, root, "VITE_");
          const keys: string[] = JSON.parse(keysJson);
          const config = Object.fromEntries(
            keys.flatMap((key) => (key in env ? [[key, env[key]]] : []))
          );
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(
            html.replace(
              /<script id="runtime-config">.*?<\/script>/,
              `<script id="runtime-config">${runtimeConfigScript(config)}</script>`
            )
          );
        } catch (error) {
          next(error);
        }
      });
    },
  };
}
