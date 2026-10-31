import {
  getFeaturePolicy,
  getMyStudyRoles,
} from "@app/api/generated/endpoints";
import { RouteErrorState } from "@app/components/page/States";
import { requireMember } from "@app/lib/auth";
import { Outlet, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/layout";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  ({ request }) => requireMember(request),
];

/**
 * What every study page needs to decide what to offer: the visitor's role in
 * each study and whether creating and joining are open. Actions below
 * revalidate this, so a new application or study shows up everywhere.
 */
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const [roles, policy] = await Promise.all([
    getMyStudyRoles({ signal: request.signal }),
    getFeaturePolicy({ signal: request.signal }),
  ]);
  return { roles, policy };
}

export function useStudyContext() {
  const data = useRouteLoaderData<typeof clientLoader>("routes/study/layout");
  if (!data) throw new Error("useStudyContext must be used below /study");
  return data;
}

export default function StudyLayout() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <RouteErrorState error={error} />;
}
