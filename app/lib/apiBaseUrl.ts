const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;

export function normalizeApiBaseUrl(value: string | null | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) return undefined;

  const withoutTrailingSlash = trimmed.replace(/\/+$/, "");

  if (
    ABSOLUTE_URL_PATTERN.test(withoutTrailingSlash) ||
    withoutTrailingSlash.startsWith("/")
  ) {
    return withoutTrailingSlash;
  }

  return `http://${withoutTrailingSlash}`;
}

export function getApiBaseUrl() {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_API_PROXY !== "false") {
    return undefined;
  }

  return normalizeApiBaseUrl(import.meta.env.VITE_API_URL);
}

export function createApiUrl(path: string) {
  const normalizedPath = path.replace(/^\/+/, "");
  const apiBaseUrl = getApiBaseUrl();

  return apiBaseUrl ? `${apiBaseUrl}/${normalizedPath}` : `/${normalizedPath}`;
}
