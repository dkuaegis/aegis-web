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

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    if (typeof error.details === "string" && error.details.trim()) {
      return error.details;
    }
    return error.message.trim() ? error.message : fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

const getErrorMessage = (status: number, body: unknown) => {
  if (typeof body === "string" && body.trim()) return body;
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    const message = record.message ?? record.error;
    if (typeof message === "string" && message.trim()) return message;
  }

  // Read at call time so the message matches the language in effect when the
  // request actually failed, not whichever one was active at module load.
  if (status === 400) return t("common.error.badRequest");
  if (status === 401) return t("common.error.unauthorized");
  if (status === 403) return t("common.error.forbidden");
  if (status === 404) return t("common.error.notFound");
  if (status === 409) return t("common.error.conflict");
  return t("common.error.unknown");
};

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

  const response = await fetch(`${API_BASE_URL}${requestPath}`, {
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
  });

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
    throw new ApiError(
      response.status,
      getErrorMessage(response.status, body),
      body
    );
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
