import type { Dictionary, DictionaryValue } from "./types";

/** Values allowed in `t()` interpolation: `t("x", { count: 3 })`. */
export type TranslationVars = Record<string, string | number>;

function isDictionary(value: DictionaryValue): value is Dictionary {
  return typeof value === "object" && !Array.isArray(value);
}

function lookup(
  dictionary: Dictionary,
  key: string
): DictionaryValue | undefined {
  let current: DictionaryValue | undefined = dictionary;

  for (const segment of key.split(".")) {
    // Only an object can be walked into; a string or a list means the key went
    // deeper than the dictionary actually goes.
    if (current === undefined || !isDictionary(current)) return undefined;
    current = current[segment];
  }

  return current;
}

function interpolate(template: string, vars?: TranslationVars): string {
  if (!vars) return template;

  return template.replace(/\{\{(\w+)\}\}/g, (match, name: string) => {
    const value = vars[name];
    return value === undefined ? match : String(value);
  });
}

function warnMissing(key: string) {
  if (import.meta.env.DEV) {
    console.warn(`[i18n] Missing translation for key: ${key}`);
  }
}

/**
 * Resolves a dot-separated key to a string. Falls back to the base dictionary
 * (Korean) when a key has not been translated yet, and finally to the key
 * itself, so a missing entry degrades to something readable instead of blank.
 */
export function translate(
  dictionary: Dictionary,
  fallback: Dictionary,
  key: string,
  vars?: TranslationVars
): string {
  const value = lookup(dictionary, key) ?? lookup(fallback, key);

  if (typeof value === "string") return interpolate(value, vars);

  if (Array.isArray(value)) {
    return value.map((entry) => interpolate(entry, vars)).join("\n");
  }

  warnMissing(key);
  return key;
}

/**
 * Resolves a key that holds a list (paragraphs, bullets, steps). Returns an
 * empty array rather than throwing so a partially translated list cannot crash
 * a page.
 */
export function translateList(
  dictionary: Dictionary,
  fallback: Dictionary,
  key: string,
  vars?: TranslationVars
): string[] {
  const value = lookup(dictionary, key) ?? lookup(fallback, key);

  if (Array.isArray(value)) {
    return value.map((entry) => interpolate(entry, vars));
  }

  if (typeof value === "string") return [interpolate(value, vars)];

  warnMissing(key);
  return [];
}
