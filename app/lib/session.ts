import { getAuthStatus } from "@app/api/generated/endpoints";
import { useEffect, useSyncExternalStore } from "react";
import { hasStatus } from "./errors";

/**
 * Who is using the site:
 * - `anonymous`: not signed in
 * - `guest`: signed in, but has not finished joining (dues unpaid this term)
 * - `member`: signed in and a member this term
 */
export type SessionStatus = "anonymous" | "guest" | "member";

/** The server's last answer; null before the first one and after a failure. */
let known: SessionStatus | null = null;
let stale = false;
let pending: Promise<SessionStatus> | null = null;
const listeners = new Set<() => void>();

function settle(status: SessionStatus | null) {
  known = status;
  stale = false;
  pending = null;
  for (const listener of listeners) listener();
}

async function fetchStatus(): Promise<SessionStatus> {
  try {
    const { status } = await getAuthStatus();
    return status === "COMPLETED" ? "member" : "guest";
  } catch (error) {
    if (hasStatus(error, 401)) return "anonymous";
    throw error;
  }
}

function startCheck(): Promise<SessionStatus> {
  const check: Promise<SessionStatus> = fetchStatus().then(
    (status) => {
      // A refresh began after this request; only the newest answer counts.
      if (pending !== check) return loadSession();
      settle(status);
      return status;
    },
    (error: unknown) => {
      if (pending !== check) return loadSession();
      settle(null);
      throw error;
    }
  );
  pending = check;
  return check;
}

/**
 * Resolves the current session, sharing one `/auth/check` request between
 * the header, route middleware and pages. A failed check is not cached, so
 * the next call retries.
 */
export function loadSession(): Promise<SessionStatus> {
  if (known && !stale) return Promise.resolve(known);
  return pending ?? startCheck();
}

/**
 * Asks the server again, e.g. after signing in or finishing payment. Rendering
 * keeps the last known status until the answer arrives, so the header does not
 * fall back to its signed-out menu.
 */
export function refreshSession(): Promise<SessionStatus> {
  stale = true;
  return startCheck();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * The status for rendering; starts the check if nothing has yet. The
 * prerendered home page cannot know who is visiting, so it is built (and
 * hydrated) as unknown.
 */
export function useSessionStatus(): SessionStatus | null {
  const status = useSyncExternalStore(
    subscribe,
    () => known,
    () => null
  );
  useEffect(() => {
    void loadSession().catch(() => {});
  }, []);
  return status;
}
