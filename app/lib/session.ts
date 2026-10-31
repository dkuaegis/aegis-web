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

let snapshot: Snapshot = { state: "loading" };
let pending: Promise<SessionStatus> | null = null;
const listeners = new Set<() => void>();

function publish(next: Snapshot) {
  snapshot = next;
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
  if (snapshot.state === "ready") return Promise.resolve(snapshot.status);
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

/** Forget the cached status, e.g. after signing in or finishing payment. */
export function invalidateSession() {
  pending = null;
  publish({ state: "loading" });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The session for rendering; starts the check if nothing has yet. */
export function useSession(): Snapshot {
  const current = useSyncExternalStore(subscribe, () => snapshot);
  useEffect(() => {
    if (current.state === "loading") void loadSession().catch(() => {});
  }, [current.state]);
  return current;
}
