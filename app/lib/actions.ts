import { toast } from "@app/components/ui/toast";
import { errorMessage } from "@app/lib/errors";
import { useEffect, useRef } from "react";
import type { SubmitFunction } from "react-router";

export type ActionResult<Intent extends string = string> =
  | { ok: true; intent: Intent }
  | { ok: false; intent: Intent; message: string };

/**
 * Runs one mutation of a route action and reports the outcome as data, so
 * the form that sent it can show the server's message in place instead of
 * the page falling into its error boundary.
 */
export async function runAction<Intent extends string>(
  intent: Intent,
  mutation: () => Promise<unknown>,
  options: {
    /** Toast shown once the server accepted the change. */
    success?: string;
    errors?: Parameters<typeof errorMessage>[1];
  } = {}
): Promise<ActionResult<Intent>> {
  try {
    await mutation();
    if (options.success) toast.success(options.success);
    return { ok: true, intent };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    return { ok: false, intent, message: errorMessage(error, options.errors) };
  }
}

/**
 * Calls `onResult` once for each response a fetcher receives, after it has
 * settled (loaders revalidated), e.g. to close a dialog and show a toast.
 */
export function useFetcherResult<T>(
  fetcher: { state: string; data: T | undefined },
  onResult: (data: T) => void
) {
  const handled = useRef<T | undefined>(undefined);
  const callback = useRef(onResult);
  callback.current = onResult;

  useEffect(() => {
    if (fetcher.state !== "idle" || fetcher.data === undefined) return;
    if (handled.current === fetcher.data) return;
    handled.current = fetcher.data;
    callback.current(fetcher.data);
  }, [fetcher.state, fetcher.data]);
}

/** A typed request body for `submit(..., { encType: "application/json" })`. */
export function jsonBody(value: object): Parameters<SubmitFunction>[0] {
  return value as Parameters<SubmitFunction>[0];
}
