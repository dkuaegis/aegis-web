import { ApiError } from "@app/api/client";
import type { ErrorCode } from "@app/api/generated/model";
import { hasKey, t } from "@app/i18n/store";

type Overrides = Partial<Record<ErrorCode, string>> & {
  /** Used for any other failure instead of the generic status message. */
  fallback?: string;
};

function statusMessage(status: number): string {
  if (status === 400) return t("common.error.badRequest");
  if (status === 401) return t("common.error.unauthorized");
  if (status === 403) return t("common.error.forbidden");
  if (status === 404) return t("common.error.notFound");
  if (status === 409) return t("common.error.conflict");
  return t("common.error.unknown");
}

/**
 * The sentence to show the user for a failed request.
 *
 * Order: a screen-specific message for the server's error code, the shared
 * message for that code (`common.errorCode.*`), the screen's fallback, then a
 * generic message for the HTTP status. Network failures and timeouts always
 * say so, since retrying is the useful advice there.
 */
export function errorMessage(
  error: unknown,
  overrides: Overrides = {}
): string {
  if (!(error instanceof ApiError)) {
    return overrides.fallback ?? t("common.error.unknown");
  }
  if (error.status === 0) {
    return t(error.timedOut ? "common.error.timeout" : "common.error.network");
  }
  if (error.code) {
    const specific = overrides[error.code];
    if (specific) return specific;
    const sharedKey = `common.errorCode.${error.code}`;
    if (hasKey(sharedKey)) return t(sharedKey);
  }
  return overrides.fallback ?? statusMessage(error.status);
}

export function hasErrorCode(error: unknown, code: ErrorCode): boolean {
  return error instanceof ApiError && error.code === code;
}

export function hasStatus(error: unknown, status: number): boolean {
  return error instanceof ApiError && error.status === status;
}
