import { Stepper } from "@app/components/join/Funnel";
import { isJoinStep } from "@app/components/join/join";
import { PageBody, PageHeader } from "@app/components/page/PageHeader";
import { RouteErrorState } from "@app/components/page/States";
import { useI18n } from "@app/i18n";
import { loadSession } from "@app/lib/session";
import { Outlet, redirect, useLocation } from "react-router";
import type { Route } from "./+types/layout";

/** Members have nothing left to do here. */
export async function clientLoader() {
  if ((await loadSession()) === "member") throw redirect("/join/complete");
  return null;
}

export default function JoinFunnel() {
  const { t } = useI18n();
  const step = useLocation().pathname.split("/")[2];
  if (!isJoinStep(step)) return null;

  return (
    <div className="narrow-frame [--frame-width:42rem]">
      <PageHeader
        className="border-b-0"
        title={t(`join.steps.${step}`)}
        compact
      />
      <Stepper current={step} />
      <PageBody className="pt-10">
        <Outlet />
      </PageBody>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <RouteErrorState error={error} />;
}
