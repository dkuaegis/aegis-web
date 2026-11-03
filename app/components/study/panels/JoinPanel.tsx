import type {
  ApplicantStudyApplicationDetail,
  GeneralStudyDetail,
} from "@app/api/generated/model";
import { ApplicationDialog } from "@app/components/study/ApplicationDialog";
import { joinPanelState } from "@app/components/study/study";
import { useStudyContext } from "@app/components/study/useStudyContext";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@app/components/ui/alert-dialog";
import { Button } from "@app/components/ui/button";
import { ErrorText } from "@app/components/ui/field";
import { Spinner } from "@app/components/ui/spinner";
import { useI18n } from "@app/i18n";
import { type ActionResult, useActionDialog } from "@app/lib/actions";
import { ArrowRightIcon, PencilLineIcon } from "lucide-react";
import { Link } from "react-router";
import { Panel, PanelStatus } from "./Panel";

export function JoinPanel({
  study,
  application,
}: {
  study: GeneralStudyDetail;
  application: ApplicantStudyApplicationDetail | null;
}) {
  const { t } = useI18n();
  const { policy } = useStudyContext();
  const state = joinPanelState(study, application, policy);

  return (
    <Panel heading={t("study.join.heading")}>
      {state.kind === "approved" && (
        <PanelStatus
          title={t("study.join.approved")}
          description={t("study.join.approvedDescription")}
        />
      )}
      {state.kind === "pending" && (
        <>
          <PanelStatus
            title={t("study.join.pending")}
            description={t("study.join.pendingDescription")}
          />
          {state.editable ? (
            <ApplicationDialog
              key="update-application"
              intent="update-application"
              defaultReason={state.reason}
              trigger={
                <Button variant="outline" className="w-full">
                  <PencilLineIcon aria-hidden="true" />
                  {t("study.join.editApplication")}
                </Button>
              }
            />
          ) : (
            <div className="grid gap-2">
              <p className="m-0 text-[0.875rem] font-[700] text-ink-muted">
                {t("study.join.myApplication")}
              </p>
              <p className="m-0 whitespace-pre-wrap text-[0.9375rem] leading-relaxed [overflow-wrap:anywhere]">
                {state.reason}
              </p>
              <p className="m-0 text-[0.875rem] text-ink-muted">
                {t("study.join.editClosed")}
              </p>
            </div>
          )}
        </>
      )}
      {state.kind === "rejected" && (
        <>
          <PanelStatus
            title={t("study.join.rejected")}
            description={t("study.join.rejectedDescription")}
          />
          <Link
            to="/study"
            className="inline-flex items-center gap-1.5 text-[0.9375rem] font-[750] text-blue hover:underline"
          >
            {t("study.detail.back")}
            <ArrowRightIcon aria-hidden="true" className="size-4" />
          </Link>
        </>
      )}
      {state.kind === "full" && (
        <PanelStatus
          title={t("study.join.full")}
          description={t("study.join.fullDescription")}
        />
      )}
      {state.kind === "closed" && (
        <PanelStatus
          title={t("study.join.closed")}
          description={state.message}
        />
      )}
      {state.kind === "open" && (
        <>
          <div className="grid gap-2">
            <p className="m-0 text-[1.25rem] leading-snug font-[800] tracking-[-0.035em]">
              {t(`study.labels.recruitmentMethods.${study.recruitmentMethod}`)}
            </p>
            <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
              {t(
                `study.labels.recruitmentMethodHints.${study.recruitmentMethod}`
              )}{" "}
              {state.message}
            </p>
          </div>
          {study.recruitmentMethod === "FCFS" ? (
            <FcfsJoin />
          ) : (
            <ApplicationDialog
              key="apply"
              intent="apply"
              defaultReason=""
              trigger={
                <Button size="lg" className="w-full">
                  {t("study.join.applyAction")}
                  <ArrowRightIcon aria-hidden="true" />
                </Button>
              }
            />
          )}
        </>
      )}
    </Panel>
  );
}

function FcfsJoin() {
  const { t } = useI18n();
  const { fetcher, busy, failed, dialog } = useActionDialog<ActionResult>();

  return (
    <AlertDialog {...dialog}>
      <AlertDialogTrigger
        render={
          <Button size="lg" className="w-full">
            {t("study.join.fcfsAction")}
            <ArrowRightIcon aria-hidden="true" />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("study.join.fcfsConfirmTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("study.join.fcfsConfirmDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ErrorText role="alert">{failed}</ErrorText>
        <AlertDialogFooter>
          <AlertDialogClose
            disabled={busy}
            render={<Button variant="outline">{t("common.cancel")}</Button>}
          />
          <Button
            disabled={busy}
            onClick={() =>
              fetcher.submit({ intent: "join" }, { method: "post" })
            }
          >
            {busy && <Spinner />}
            {t("study.join.fcfsConfirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
