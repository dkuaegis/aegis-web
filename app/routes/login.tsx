import { buttonVariants } from "@app/components/ui/button";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { safeReturnTo, startGoogleLogin } from "@app/lib/auth";
import { detectInAppBrowser } from "@app/lib/in-app-browser";
import { refreshSession } from "@app/lib/session";
import { pageTitle } from "@app/lib/title";
import { useEffect, useState } from "react";
import { redirect } from "react-router";
import type { Route } from "./+types/login";

/**
 * How long a trip to Google counts as unfinished. Coming back to this page
 * still signed out within it means the visitor turned back, or the session
 * cookie did not stick; leaving for Google again would trap them either way.
 */
const ATTEMPT_WINDOW_MS = 5 * 60 * 1000;
const ATTEMPT_KEY = "aegis-web:login-attempt";

export function meta() {
  return [{ title: pageTitle(translate("pages.login.metaTitle")) }];
}

/**
 * Entry and exit point of Google sign-in. Visiting it signed out leaves for
 * Google; Google returns the browser to this same URL, which then forwards
 * to `returnTo`.
 */
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const returnTo = safeReturnTo(
    new URL(request.url).searchParams.get("returnTo")
  );
  const status = await refreshSession();
  if (status !== "anonymous") {
    forgetAttempt();
    throw redirect(returnTo);
  }
  return { returned: attemptedRecently() };
}

export default function LoginPage({ loaderData }: Route.ComponentProps) {
  const { t } = useI18n();
  const [returned, setReturned] = useState(loaderData.returned);

  useEffect(() => {
    // In-app browsers show their own page instead, since Google refuses them.
    if (!loaderData.returned && !detectInAppBrowser()) leaveForGoogle();
  }, [loaderData.returned]);

  // Back from Google restores this page from the back/forward cache as it was
  // left, without running anything above.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setReturned(true);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return (
    <div className="gutter-x grid min-h-[60dvh] content-center justify-items-start gap-5 py-16">
      <p className="text-title m-0">
        {returned ? t("pages.login.unfinished") : t("pages.login.redirecting")}
      </p>
      <button
        type="button"
        onClick={leaveForGoogle}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        {returned ? t("pages.login.retry") : t("pages.login.manual")}
      </button>
    </div>
  );
}

function leaveForGoogle() {
  try {
    sessionStorage.setItem(ATTEMPT_KEY, String(Date.now()));
  } catch {
    // Without storage the page simply cannot tell that it was back.
  }
  startGoogleLogin();
}

function attemptedRecently(): boolean {
  try {
    const attempt = Number(sessionStorage.getItem(ATTEMPT_KEY));
    return attempt > 0 && Date.now() - attempt < ATTEMPT_WINDOW_MS;
  } catch {
    return false;
  }
}

function forgetAttempt() {
  try {
    sessionStorage.removeItem(ATTEMPT_KEY);
  } catch {
    // Nothing was stored.
  }
}
