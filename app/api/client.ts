import type { ErrorCode } from "./generated/model";

const DEFAULT_API_URL = "https://dev-api.dkuaegis.org";
const REQUEST_TIMEOUT_MS = 15_000;

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

export const API_BASE_URL = configuredApiUrl ?? DEFAULT_API_URL;

/** Starts Google sign-in. The server returns the browser to the page that sent it. */
export const googleLoginUrl = `${API_BASE_URL}/oauth2/authorization/google`;

/**
 * A failed request. `status` is 0 when the server was never reached
 * (offline, DNS, CORS) or the request timed out. `code` is the server's
 * `ErrorCode` when the response carried one.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: ErrorCode | undefined;
  readonly timedOut: boolean;

  constructor(
    status: number,
    options: { code?: ErrorCode; timedOut?: boolean; cause?: unknown } = {}
  ) {
    super(
      options.code ??
        (status === 0
          ? options.timedOut
            ? "Request timed out"
            : "Network error"
          : `HTTP ${status}`),
      { cause: options.cause }
    );
    this.name = "ApiError";
    this.status = status;
    this.code = options.code;
    this.timedOut = options.timedOut ?? false;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function withTimeout(signal: AbortSignal | null | undefined) {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  if (!signal) return timeout;
  // AbortSignal.any is missing before Safari 17.4; keep the caller's signal there.
  return typeof AbortSignal.any === "function"
    ? AbortSignal.any([signal, timeout])
    : signal;
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  const isJson = response.headers
    .get("Content-Type")
    ?.includes("application/json");
  if (!isJson) return text;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function readErrorCode(body: unknown): ErrorCode | undefined {
  if (body && typeof body === "object" && "name" in body) {
    const { name } = body;
    if (typeof name === "string") return name as ErrorCode;
  }
  return undefined;
}

/**
 * The fetch every generated endpoint goes through (see orval.config.ts).
 * Sends the session cookie, applies a timeout and turns failures into
 * {@link ApiError}.
 */
export async function apiFetch<T>(url: string, init: RequestInit): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json, text/plain;q=0.9");
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${url}`, {
      ...init,
      headers,
      credentials: "include",
      signal: withTimeout(init.signal),
    });
  } catch (error) {
    // A navigation that cancelled its loader still gets its AbortError.
    if (init.signal?.aborted) throw error;
    const timedOut =
      error instanceof DOMException && error.name === "TimeoutError";
    throw new ApiError(0, { timedOut, cause: error });
  }

  const body = await readBody(response);
  if (!response.ok) {
    throw new ApiError(response.status, { code: readErrorCode(body) });
  }
  return body as T;
}
