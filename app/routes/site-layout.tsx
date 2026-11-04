import { RouteErrorState } from "@app/components/page/States";
import { SiteFooter } from "@app/components/site/SiteFooter";
import { SiteHeader } from "@app/components/site/SiteHeader";
import { Outlet } from "react-router";
import type { Route } from "./+types/site-layout";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export default function SiteLayout() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <Shell>
      <RouteErrorState error={error} />
    </Shell>
  );
}
