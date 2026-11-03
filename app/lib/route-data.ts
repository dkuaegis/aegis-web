import type { ShouldRevalidateFunction } from "react-router";

/**
 * For routes below pages that filter a list already in memory through the URL.
 * Changing only the search keeps the data, so filters respond at once and need
 * no network; submissions and explicit retries still reload.
 */
export const keepDataOnSearchChange: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
  formMethod,
  defaultShouldRevalidate,
}) =>
  !formMethod &&
  currentUrl.pathname === nextUrl.pathname &&
  currentUrl.search !== nextUrl.search
    ? false
    : defaultShouldRevalidate;

/** For data a page can do without: a failed request becomes null. */
export async function optional<T>(
  promise: Promise<T>,
  signal: AbortSignal
): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    if (signal.aborted) throw error;
    console.error(error);
    return null;
  }
}
