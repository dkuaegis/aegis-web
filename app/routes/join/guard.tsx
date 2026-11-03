import { joinRedirect } from "@app/components/join/join";
import { RouteErrorState } from "@app/components/page/States";
import { t } from "@app/i18n/store";
import { loginPath } from "@app/lib/auth";
import { loadSession } from "@app/lib/session";
import { pageTitle } from "@app/lib/title";
import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/guard";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ request }) => {
    const { pathname, search } = new URL(request.url);
    const status = await loadSession();
    if (status === "anonymous") throw redirect(loginPath(pathname + search));
    const target = joinRedirect(status, pathname);
    if (target) throw redirect(target);
  },
];

/** Middleware only runs when a loader does. */
export function clientLoader() {
  return null;
}

/** Every move within the funnel goes through the middleware again. */
export function shouldRevalidate() {
  return true;
}

export function meta() {
  return [{ title: pageTitle(t("join.metaTitle")) }];
}

export default function JoinGuard() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <RouteErrorState error={error} />;
}
