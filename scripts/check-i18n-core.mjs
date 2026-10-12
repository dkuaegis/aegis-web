function flatten(value, prefix = "", out = new Map()) {
  for (const [key, entry] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof entry === "string") out.set(path, "string");
    else if (Array.isArray(entry)) out.set(path, `list:${entry.length}`);
    else flatten(entry, path, out);
  }
  return out;
}

function placeholders(text) {
  return [...String(text).matchAll(/\{\{(\w+)\}\}/g)]
    .map((match) => match[1])
    .sort()
    .join(",");
}

function readValue(dictionary, key) {
  return key.split(".").reduce((node, part) => node?.[part], dictionary);
}

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

/**
 * Validate locale keys/shapes/placeholders and literal translation references.
 * Source files use paths relative to the app directory for readable diagnostics.
 */
export function validateI18n({ locales, baseLocale = "ko", sourceFiles = [] }) {
  const flat = Object.fromEntries(
    Object.entries(locales).map(([code, dictionary]) => [
      code,
      flatten(dictionary),
    ])
  );
  const problems = [];
  const baseKeys = flat[baseLocale];

  if (!baseKeys) {
    return {
      keyCount: 0,
      localeCodes: Object.keys(locales),
      problems: [`base locale not found: ${baseLocale}`],
    };
  }

  for (const [code, keys] of Object.entries(flat)) {
    if (code === baseLocale) continue;
    for (const [key, shape] of baseKeys) {
      if (!keys.has(key)) {
        problems.push(`[${code}] missing key: ${key}`);
        continue;
      }
      const otherShape = keys.get(key);
      const sameKind = shape.split(":")[0] === otherShape.split(":")[0];
      if (!sameKind) {
        problems.push(
          `[${code}] shape differs for ${key}: ${baseLocale}=${shape}, ${code}=${otherShape}`
        );
      }
    }
    for (const key of keys.keys()) {
      if (!baseKeys.has(key)) problems.push(`[${code}] extra key: ${key}`);
    }
  }

  for (const [code, dictionary] of Object.entries(locales)) {
    if (code === baseLocale) continue;
    for (const key of baseKeys.keys()) {
      const base = readValue(locales[baseLocale], key);
      const other = readValue(dictionary, key);
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

  const callPattern = /\bt(?:List)?\(\s*"([a-zA-Z0-9_.]+)"/g;
  for (const { path, source } of sourceFiles) {
    for (const [, key] of stripComments(source).matchAll(callPattern)) {
      if (!baseKeys.has(key)) {
        problems.push(
          `[code] ${path} references a key that does not exist: ${key}`
        );
      }
    }
  }

  return {
    keyCount: baseKeys.size,
    localeCodes: Object.keys(locales),
    problems,
  };
}
