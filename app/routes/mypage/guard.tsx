import { RouteErrorState } from "@app/components/page/States";
import { t } from "@app/i18n/store";
import { requireMember } from "@app/lib/auth";
import { pageTitle } from "@app/lib/title";
import { Outlet } from "react-router";
import type { Route } from "./+types/guard";

/**
 * Pages below set their own title. This one shows when a page fails and the
 * error boundary here takes over, since the failed page's `meta` no longer
 * applies.
 */
export function meta() {
  return [{ title: pageTitle(t("mypage.metaTitle")) }];
}

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  ({ request }) => requireMember(request),
];

export default function MypageGuard() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <RouteErrorState error={error} />;
}
