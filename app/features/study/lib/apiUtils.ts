import { t } from "@app/i18n/store";
import { ApiError, getApiErrorCode } from "@app/lib/api";

/**
 * Maps a server error code or HTTP status to a user-facing message. Error code
 * entries win over status entries because one status (409) covers several
 * different failures. The values passed in are translation keys rather than
 * finished strings, so a message is resolved in whatever language is selected
 * when the request actually fails.
 */
export function handleHTTPError(
  error: unknown,
  errorMessageKeys: Record<number | string, string> & { default: string }
): never {
  if (error instanceof ApiError) {
    // 네트워크 오류와 시간 초과는 이미 번역된 안내 문구를 담고 있습니다.
    if (error.status === 0) throw new Error(error.message);
    const code = getApiErrorCode(error);
    const key =
      (code && errorMessageKeys[code]) ||
      errorMessageKeys[error.status] ||
      errorMessageKeys.default;
    throw new Error(t(key));
  }
  if (error instanceof Error) {
    throw error;
  }
  throw new Error(`${t(errorMessageKeys.default)}: ${String(error)}`);
}
