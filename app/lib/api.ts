import { t } from "@app/i18n/store";

const DEFAULT_API_URL = "https://dev-api.dkuaegis.org";

function getSafeApiUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  try {
    const url = new URL(trimmed);
    const isSecure = url.protocol === "https:";
    const isLocalhost =
      url.protocol === "http:" && url.hostname === "localhost";

    return isSecure || isLocalhost ? trimmed.replace(/\/+$/, "") : undefined;
  } catch {
    return undefined;
  }
}

const configuredApiUrl = getSafeApiUrl(import.meta.env.VITE_API_URL);
if (
  !configuredApiUrl &&
  import.meta.env.PROD &&
  typeof window !== "undefined"
) {
  throw new Error("VITE_API_URL must be a valid API URL in production");
}
const API_BASE_URL = configuredApiUrl ?? DEFAULT_API_URL;

export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/** The server's `ErrorCode` name, e.g. `STUDY_FULL`, when the body has one. */
export function getApiErrorCode(error: unknown): string | undefined {
  if (!(error instanceof ApiError)) return undefined;
  const { details } = error;
  if (details && typeof details === "object" && "name" in details) {
    return typeof details.name === "string" ? details.name : undefined;
  }
  return undefined;
}

/** The translated status message, or `fallback` when it would only be the
 *  generic "something went wrong" text (5xx and unknown failures). */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError && error.status < 500
    ? error.message
    : fallback;
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

const REQUEST_TIMEOUT_MS = 15_000;

// The server only sends an `ErrorCode` name, and proxies in front of it can
// answer with an HTML page, so the message always comes from the status.
// Read at call time so the message matches the language in effect when the
// request actually failed, not whichever one was active at module load.
const getErrorMessage = (status: number) => {
  if (status === 400) return t("common.error.badRequest");
  if (status === 401) return t("common.error.unauthorized");
  if (status === 403) return t("common.error.forbidden");
  if (status === 404) return t("common.error.notFound");
  if (status === 409) return t("common.error.conflict");
  return t("common.error.unknown");
};

function withTimeout(signal: AbortSignal | null | undefined) {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  if (!signal) return timeout;
  // AbortSignal.any is missing before Safari 17.4; keep the caller's signal there.
  return typeof AbortSignal.any === "function"
    ? AbortSignal.any([signal, timeout])
    : signal;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  const hasBody = options.body !== undefined;
  if (
    hasBody &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json, text/plain;q=0.9");
  }

  const contentType = headers.get("Content-Type");
  const requestPath = path.startsWith("/") ? path : `/${path}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${requestPath}`, {
      ...options,
      body:
        options.body instanceof FormData
          ? options.body
          : typeof options.body === "string" && contentType?.startsWith("text/")
            ? options.body
            : hasBody
              ? JSON.stringify(options.body)
              : undefined,
      credentials: "include",
      headers,
      signal: withTimeout(options.signal),
    });
  } catch (error) {
    // A caller that aborted on purpose (e.g. React Query cancelling) still
    // gets its AbortError; everything else becomes a translated ApiError.
    if (options.signal?.aborted) throw error;
    const timedOut =
      error instanceof DOMException && error.name === "TimeoutError";
    throw new ApiError(
      0,
      t(timedOut ? "common.error.timeout" : "common.error.network"),
      error
    );
  }

  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, getErrorMessage(response.status), body);
  }

  return body as T;
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) =>
    apiRequest<T>(path, { method: "GET", signal }),
  post: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    apiRequest<T>(path, { method: "POST", body, signal }),
  put: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    apiRequest<T>(path, { method: "PUT", body, signal }),
  patch: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    apiRequest<T>(path, { method: "PATCH", body, signal }),
  delete: <T>(path: string, signal?: AbortSignal) =>
    apiRequest<T>(path, { method: "DELETE", signal }),
};

export const googleLoginUrl = `${API_BASE_URL}/oauth2/authorization/google`;
