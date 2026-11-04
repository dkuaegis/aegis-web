import { ApiError } from "@app/api/client";
import { toast } from "@app/components/ui/toast";
import { errorMessage } from "@app/lib/errors";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";

export type ActionResult<Intent extends string = string, Data = unknown> =
  | { ok: true; intent: Intent; data: Data }
  | { ok: false; intent: Intent; message: string };

/**
 * Runs one mutation of a route action and reports the outcome as data, so
 * the form that sent it can show the server's message in place instead of
 * the page falling into its error boundary.
 */
export async function runAction<Intent extends string, Data>(
  intent: Intent,
  mutation: () => Promise<Data>,
  options: {
    /** Toast shown once the server accepted the change. */
    success?: string | ((data: Data) => string);
    errors?: Parameters<typeof errorMessage>[1];
  } = {}
): Promise<ActionResult<Intent, Data>> {
  try {
    const data = await mutation();
    const { success } = options;
    if (success) {
      toast.success(typeof success === "function" ? success(data) : success);
    }
    return { ok: true, intent, data };
  } catch (error) {
    if (!(error instanceof ApiError)) console.error(error);
    return { ok: false, intent, message: errorMessage(error, options.errors) };
  }
}

/**
 * Calls `onResult` once for each response a fetcher receives, after it has
 * settled (loaders revalidated), e.g. to close a dialog.
 */
export function useFetcherResult<T>(
  fetcher: { state: string; data: T | null | undefined },
  onResult: (data: T) => void
) {
  const handled = useRef<T | null | undefined>(undefined);
  const callback = useRef(onResult);
  callback.current = onResult;

  useEffect(() => {
    if (fetcher.state !== "idle" || fetcher.data == null) return;
    if (handled.current === fetcher.data) return;
    handled.current = fetcher.data;
    callback.current(fetcher.data);
  }, [fetcher.state, fetcher.data]);
}

/**
 * Everything a dialog that submits to a route action has in common: it cannot
 * be closed while sending, reopens clean, and shows why the last try failed.
 * Spread `dialog` onto the dialog root.
 */
export function useActionDialog<Result extends ActionResult>({
  onOpen,
  onResult,
  closeWhen = (result) => result.ok,
}: {
  /** Reset what the dialog's own inputs hold. */
  onOpen?: () => void;
  onResult?: (result: Result) => void;
  closeWhen?: (result: Result) => boolean;
} = {}) {
  const fetcher = useFetcher<Result>();
  const [open, setOpen] = useState(false);
  const busy = fetcher.state !== "idle";
  const result = fetcher.data as Result | null | undefined;

  useFetcherResult<Result>(
    { state: fetcher.state, data: result },
    (settled) => {
      if (closeWhen(settled)) setOpen(false);
      onResult?.(settled);
    }
  );

  return {
    fetcher,
    busy,
    failed: !busy && result?.ok === false ? result.message : null,
    dialog: {
      open,
      onOpenChange: (next: boolean) => {
        if (busy) return;
        if (next) {
          fetcher.reset();
          onOpen?.();
        }
        setOpen(next);
      },
    },
  };
}
