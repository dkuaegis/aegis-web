import { RouteErrorState } from "@app/components/page/States";
import { requireMember } from "@app/lib/auth";
import { Outlet } from "react-router";
import type { Route } from "./+types/guard";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  ({ request }) => requireMember(request),
];

export default function MypageGuard() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <RouteErrorState error={error} />;
}
