import { googleLoginUrl } from "@app/api/client";
import { redirect } from "react-router";
import { loadSession } from "./session";

/** Only same-site paths may be returned to after signing in. */
export function safeReturnTo(value: string | null | undefined): string {
  if (!value?.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export function loginPath(returnTo: string): string {
  return `/login?returnTo=${encodeURIComponent(safeReturnTo(returnTo))}`;
}

function pathOf(request: Request): string {
  const url = new URL(request.url);
  return url.pathname + url.search;
}

/**
 * For member-only sections. Signed-out visitors are sent to sign in and
 * brought back; signed-in visitors who have not joined yet go to /join.
 */
export async function requireMember(request: Request): Promise<void> {
  const status = await loadSession();
  if (status === "anonymous") throw redirect(loginPath(pathOf(request)));
  if (status === "guest") throw redirect("/join");
}

/** For the join funnel: any signed-in visitor. */
export async function requireSignedIn(request: Request): Promise<void> {
  const status = await loadSession();
  if (status === "anonymous") throw redirect(loginPath(pathOf(request)));
}

/**
 * Leaves for Google sign-in. The server sends the browser back to the full
 * URL of this page (taken from the Referer), which `/login` then resolves to
 * the original destination. The site's referrer policy would only send the
 * origin cross-site, so this one navigation asks for the full URL.
 */
export function startGoogleLogin() {
  const link = document.createElement("a");
  link.href = googleLoginUrl;
  link.referrerPolicy = "no-referrer-when-downgrade";
  document.body.append(link);
  link.click();
  link.remove();
}
