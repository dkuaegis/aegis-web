import { RouteErrorState } from "@app/components/page/States";
import { t } from "@app/i18n/store";
import { requireSignedIn } from "@app/lib/auth";
import { pageTitle } from "@app/lib/title";
import { Outlet } from "react-router";
import type { Route } from "./+types/guard";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  ({ request }) => requireSignedIn(request),
];

export function meta() {
  return [{ title: pageTitle(t("join.metaTitle")) }];
}

export default function JoinGuard() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <RouteErrorState error={error} />;
}
