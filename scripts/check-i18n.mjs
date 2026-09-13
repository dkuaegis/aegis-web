/**
 * Verifies that the locale dictionaries stay in step:
 *   1. every key in the base locale exists in the others (and vice versa)
 *   2. the two sides agree on shape (string vs list)
 *   3. every `{{placeholder}}` in the base key also appears in the translation
 *   4. every key referenced by a literal `t("...")` call in app code exists
 *
 * Run with: node scripts/check-i18n.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

const APP_DIR = new URL("../app/", import.meta.url);
const BASE_LOCALE = "ko";

const { ko } = await import(
  pathToFileURL(new URL("i18n/locales/ko/index.ts", APP_DIR).pathname)
);
const { en } = await import(
  pathToFileURL(new URL("i18n/locales/en/index.ts", APP_DIR).pathname)
);

const LOCALES = { ko, en };

function flatten(value, prefix = "", out = new Map()) {
  for (const [key, entry] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof entry === "string") out.set(path, "string");
    else if (Array.isArray(entry)) out.set(path, `list:${entry.length}`);
    else flatten(entry, path, out);
  }
  return out;
}

const flat = Object.fromEntries(
  Object.entries(LOCALES).map(([code, dict]) => [code, flatten(dict)])
);

const problems = [];

// 1 + 2: key sets and shapes
const baseKeys = flat[BASE_LOCALE];
for (const [code, keys] of Object.entries(flat)) {
  if (code === BASE_LOCALE) continue;
  for (const [key, shape] of baseKeys) {
    if (!keys.has(key)) {
      problems.push(`[${code}] missing key: ${key}`);
      continue;
    }
    const otherShape = keys.get(key);
    const sameKind = shape.split(":")[0] === otherShape.split(":")[0];
    if (!sameKind) {
      problems.push(
        `[${code}] shape differs for ${key}: ${BASE_LOCALE}=${shape}, ${code}=${otherShape}`
      );
    }
  }
  for (const key of keys.keys()) {
    if (!baseKeys.has(key)) problems.push(`[${code}] extra key: ${key}`);
  }
}

// 3: placeholders
const placeholders = (text) =>
  [...String(text).matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort().join(",");

function readValue(dict, key) {
  return key.split(".").reduce((node, part) => node?.[part], dict);
}

for (const [code, dict] of Object.entries(LOCALES)) {
  if (code === BASE_LOCALE) continue;
  for (const key of baseKeys.keys()) {
    const base = readValue(LOCALES[BASE_LOCALE], key);
    const other = readValue(dict, key);
    if (other === undefined) continue;
    const expected = placeholders(
      Array.isArray(base) ? base.join(" ") : base
    );
    const actual = placeholders(
      Array.isArray(other) ? other.join(" ") : other
    );
    if (expected !== actual) {
      problems.push(
        `[${code}] placeholders differ for ${key}: expected "${expected}", got "${actual}"`
      );
    }
  }
}

// 4: literal t("...") / tList("...") calls resolve to a real key
function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === "locales" || name === "assets" || name === "node_modules") continue;
      walk(full, files);
    } else if (/\.tsx?$/.test(name)) {
      files.push(full);
    }
  }
  return files;
}

const appPath = new URL(".", APP_DIR).pathname;
const sourceFiles = walk(appPath);
const CALL = /\bt(?:List)?\(\s*"([a-zA-Z0-9_.]+)"/g;

/** Comments can contain illustrative `t("x")` calls, so they are stripped. */
const stripComments = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

for (const file of sourceFiles) {
  const source = stripComments(readFileSync(file, "utf8"));
  for (const [, key] of source.matchAll(CALL)) {
    if (!baseKeys.has(key)) {
      problems.push(
        `[code] ${relative(appPath, file)} references a key that does not exist: ${key}`
      );
    }
  }
}

if (problems.length) {
  console.error(`i18n check failed with ${problems.length} problem(s):`);
  for (const problem of problems) console.error("  " + problem);
  process.exit(1);
}

console.log(
  `i18n check passed: ${baseKeys.size} keys, locales [${Object.keys(LOCALES).join(", ")}] in sync.`
);
