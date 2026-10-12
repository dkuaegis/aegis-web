import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { validateI18n } from "./check-i18n-core.mjs";

const APP_DIR = fileURLToPath(new URL("../app/", import.meta.url));
const BASE_LOCALE = "ko";

const { ko } = await import(
  pathToFileURL(join(APP_DIR, "i18n/locales/ko/index.ts")).href
);
const { en } = await import(
  pathToFileURL(join(APP_DIR, "i18n/locales/en/index.ts")).href
);

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const fullPath = join(dir, name);
    if (statSync(fullPath).isDirectory()) {
      if (name === "locales" || name === "assets" || name === "node_modules") {
        continue;
      }
      walk(fullPath, files);
    } else if (/\.tsx?$/.test(name)) {
      files.push(fullPath);
    }
  }
  return files;
}

const sourceFiles = walk(APP_DIR).map((file) => ({
  path: relative(APP_DIR, file),
  source: readFileSync(file, "utf8"),
}));
const { keyCount, localeCodes, problems } = validateI18n({
  locales: { ko, en },
  baseLocale: BASE_LOCALE,
  sourceFiles,
});

if (problems.length) {
  console.error(`i18n check failed with ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log(
  `i18n check passed: ${keyCount} keys, locales [${localeCodes.join(", ")}] in sync.`
);
