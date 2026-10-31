import { type ESTree, type Plugin, parseSync, Visitor } from "vite";

const runtimeConfigName = "__RUNTIME_CONFIG__";

function isViteEnvironmentAccess(
  node: ESTree.MemberExpression,
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

export function runtimeEnvPlugin(): Plugin {
  return {
    name: "runtime-env",
    apply: "build",
    enforce: "pre",
    transform(code, id) {
      const fileName = id.split("?", 1)[0];
      if (!/\.[cm]?[jt]sx?$/.test(fileName) || fileName.includes("/node_modules/")) {
        return;
      }

      const { program } = parseSync(fileName, code);
      const replacements: Array<{ start: number; end: number; value: string }> = [];

      new Visitor({
        MemberExpression(node) {
          if (!isViteEnvironmentAccess(node)) return;
          replacements.push({
            start: node.start,
            end: node.end,
            value: `(typeof window === "undefined" ? undefined : window.${runtimeConfigName}.${node.property.name})`,
          });
        },
      }).visit(program);
      if (replacements.length === 0) return;

      let transformed = code;
      for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
        transformed =
          transformed.slice(0, replacement.start) +
          replacement.value +
          transformed.slice(replacement.end);
      }
      return { code: transformed, map: null };
    },
  };
}
