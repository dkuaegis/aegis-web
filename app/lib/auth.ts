import { googleLoginUrl } from "@app/api/client";
import { redirect } from "react-router";
import { loadSession } from "./session";

/** Stands in for the site's origin; this module also runs while prerendering. */
const SAME_SITE_BASE = "https://same-site.invalid";

/**
 * Only same-site paths may be returned to after signing in. Parsed the way the
 * browser would, since `/\evil.example` and `/<tab>/evil.example` also leave
 * the site. The router refuses such targets by hanging the first navigation.
 */
export function safeReturnTo(value: string | null | undefined): string {
  if (!value?.startsWith("/")) return "/";
  try {
    const url = new URL(value, SAME_SITE_BASE);
    if (url.origin !== SAME_SITE_BASE) return "/";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/";
  }
}

export function loginPath(returnTo: string): string {
  return `/login?returnTo=${encodeURIComponent(safeReturnTo(returnTo))}`;
}

/**
 * For member-only sections. Signed-out visitors are sent to sign in and
 * brought back; signed-in visitors who have not joined yet go to /join.
 */
export async function requireMember(request: Request): Promise<void> {
  const status = await loadSession();
  if (status === "anonymous") {
    const { pathname, search } = new URL(request.url);
    throw redirect(loginPath(pathname + search));
  }
  if (status === "guest") throw redirect("/join");
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
