import { t } from "@app/i18n/store";
import { ApiError } from "@app/lib/api";

/**
 * Maps an HTTP status to a user-facing message. The values passed in are
 * translation keys rather than finished strings, so a message is resolved in
 * whatever language is selected when the request actually fails.
 */
export function handleHTTPError(
  error: unknown,
  errorMessageKeys: Record<number | "default", string>
): never {
  if (error instanceof ApiError) {
    const status = error.status;
    const key = (status && errorMessageKeys[status]) || errorMessageKeys.default;
    throw new Error(t(key));
  }
  if (error instanceof Error) {
    throw error;
  }
  throw new Error(`${t(errorMessageKeys.default)}: ${String(error)}`);
}
