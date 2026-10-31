import { buttonVariants } from "@app/components/ui/button";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { safeReturnTo, startGoogleLogin } from "@app/lib/auth";
import { invalidateSession, loadSession } from "@app/lib/session";
import { useEffect } from "react";
import { redirect } from "react-router";
import type { Route } from "./+types/login";

export function meta() {
  return [{ title: translate("pages.login.metaTitle") }];
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
  invalidateSession();
  const status = await loadSession();
  if (status !== "anonymous") throw redirect(returnTo);
  return null;
}

export default function LoginPage() {
  const { t } = useI18n();

  useEffect(() => {
    startGoogleLogin();
  }, []);

  return (
    <div className="gutter-x grid min-h-[60dvh] content-center justify-items-start gap-5 py-16">
      <p className="eyebrow m-0 text-ink-muted">{t("pages.login.eyebrow")}</p>
      <p className="text-title m-0">{t("pages.login.redirecting")}</p>
      <button
        type="button"
        onClick={startGoogleLogin}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        {t("pages.login.manual")}
      </button>
    </div>
  );
}
