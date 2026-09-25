import ts from "typescript";
import type { Plugin } from "vite";

const runtimeConfigName = "__RUNTIME_CONFIG__";

function isViteEnvironmentAccess(node: ts.PropertyAccessExpression): boolean {
  if (!node.name.text.startsWith("VITE_")) return false;
  const environment = node.expression;
  if (!ts.isPropertyAccessExpression(environment) || environment.name.text !== "env") {
    return false;
  }
  const meta = environment.expression;
  return (
    ts.isMetaProperty(meta) &&
    meta.keywordToken === ts.SyntaxKind.ImportKeyword &&
    meta.name.text === "meta"
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

      const source = ts.createSourceFile(
        fileName,
        code,
        ts.ScriptTarget.Latest,
        true,
        fileName.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
      );
      const replacements: Array<{ start: number; end: number; value: string }> = [];

      function visit(node: ts.Node): void {
        if (ts.isPropertyAccessExpression(node) && isViteEnvironmentAccess(node)) {
          replacements.push({
            start: node.getStart(source),
            end: node.getEnd(),
            value: `(typeof window === "undefined" ? undefined : window.${runtimeConfigName}.${node.name.text})`,
          });
          return;
        }
        ts.forEachChild(node, visit);
      }

      visit(source);
      if (replacements.length === 0) return;

      let transformed = code;
      for (const replacement of replacements.reverse()) {
        transformed =
          transformed.slice(0, replacement.start) +
          replacement.value +
          transformed.slice(replacement.end);
      }
      return { code: transformed, map: null };
    },
  };
}
