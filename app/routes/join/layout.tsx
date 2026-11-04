import { Stepper } from "@app/components/join/Funnel";
import { isJoinStep } from "@app/components/join/join";
import { PageBody, PageHeader } from "@app/components/page/PageHeader";
import { useI18n } from "@app/i18n";
import { Outlet, useLocation } from "react-router";

export default function JoinFunnel() {
  const { t } = useI18n();
  // The router matches paths in any letter case.
  const step = useLocation().pathname.split("/")[2]?.toLowerCase();
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
