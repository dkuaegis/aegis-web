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

type Snapshot =
  | { state: "loading" }
  | { state: "ready"; status: SessionStatus }
  | { state: "error"; error: unknown };

const LOADING: Snapshot = { state: "loading" };

let snapshot: Snapshot = LOADING;
let stale = false;
let pending: Promise<SessionStatus> | null = null;
const listeners = new Set<() => void>();

function publish(next: Snapshot) {
  snapshot = next;
  stale = false;
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

/**
 * Resolves the current session, sharing one `/auth/check` request between
 * the header, route middleware and pages. A failed check is not cached, so
 * the next call retries.
 */
export function loadSession(): Promise<SessionStatus> {
  if (snapshot.state === "ready" && !stale) {
    return Promise.resolve(snapshot.status);
  }
  if (pending) return pending;

  pending = fetchStatus()
    .then((status) => {
      publish({ state: "ready", status });
      return status;
    })
    .catch((error: unknown) => {
      publish({ state: "error", error });
      throw error;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
}

/**
 * Makes the next `loadSession` ask the server again, e.g. after signing in or
 * finishing payment. Rendering keeps the last known status until the answer
 * arrives, so the header does not fall back to its loading state.
 */
export function invalidateSession() {
  pending = null;
  stale = true;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * The session for rendering; starts the check if nothing has yet. The
 * prerendered home page cannot know who is visiting, so it is built (and
 * hydrated) in the loading state.
 */
export function useSession(): Snapshot {
  const current = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => LOADING
  );
  useEffect(() => {
    if (current.state === "loading") void loadSession().catch(() => {});
  }, [current.state]);
  return current;
}
