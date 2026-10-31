import {
  approveStudyApplication,
  getStudyApplicationReason,
  rejectStudyApplication,
} from "@app/api/generated/endpoints";
import { StatusBadge } from "@app/components/study/StatusBadge";
import { parseId } from "@app/components/study/study";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@app/components/ui/dialog";
import { Spinner } from "@app/components/ui/spinner";
import { toast } from "@app/components/ui/toast";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { errorMessage } from "@app/lib/errors";
import { formatDateTime } from "@app/lib/format";
import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";
import {
  redirect,
  useFetcher,
  useLocation,
  useNavigate,
  useRouteLoaderData,
} from "react-router";
import type { Route } from "./+types/application";
import type { clientLoader as applicationsLoader } from "./applications";

export async function clientLoader({
  params,
  request,
}: Route.ClientLoaderArgs) {
  const studyId = parseId(params.studyId);
  const applicationId = parseId(params.applicationId);
  const { applicationReason } = await getStudyApplicationReason(
    studyId,
    applicationId,
    { signal: request.signal }
  );
  return { applicationReason };
}

export async function clientAction({
  params,
  request,
}: Route.ClientActionArgs) {
  const studyId = parseId(params.studyId);
  const applicationId = parseId(params.applicationId);
  const form = await request.formData();
  const intent = form.get("intent");
  const name = String(form.get("name"));
  const search = new URL(request.url).search;

  try {
    if (intent === "approve") {
      await approveStudyApplication(studyId, applicationId);
      toast.success(translate("study.applications.approved", { name }));
    } else {
      await rejectStudyApplication(studyId, applicationId);
      toast.success(translate("study.applications.rejected", { name }));
    }
  } catch (error) {
    return { message: errorMessage(error) };
  }
  return redirect(`/study/${studyId}/applications${search}`);
}

/** One application, opened over the list so the list keeps its place. */
export default function ApplicationDialog({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { search } = useLocation();
  const list = useRouteLoaderData<typeof applicationsLoader>(
    "routes/study/applications"
  );
  const application = list?.applications.find(
    (item) => String(item.studyApplicationId) === params.applicationId
  );
  const fetcher = useFetcher<typeof clientAction>();
  const busy = fetcher.state !== "idle";
  const pendingIntent = busy ? fetcher.formData?.get("intent") : null;
  const [open, setOpen] = useState(true);

  const close = () => {
    if (busy) return;
    setOpen(false);
  };

  if (!application) return null;
  const { name, status } = application;
  const failed = fetcher.data?.message && !busy ? fetcher.data.message : null;

  const submit = (intent: "approve" | "reject") =>
    fetcher.submit({ intent, name }, { method: "post" });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !next && close()}
      onOpenChangeComplete={(next) => {
        if (!next)
          navigate({ pathname: "..", search }, { preventScrollReset: true });
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={status} />
            <span className="tabular text-[0.8125rem] font-[650] text-ink-muted">
              {formatDateTime(application.createdAt)}
            </span>
          </div>
          <DialogTitle>
            {t("study.applications.dialogTitle", { name })}
          </DialogTitle>
        </DialogHeader>

        <dl className="m-0 grid grid-cols-2 border-y border-line">
          <div className="grid gap-1 border-r border-line py-3 pr-4">
            <dt className="eyebrow text-ink-muted">
              {t("study.applications.studentId")}
            </dt>
            <dd className="tabular m-0 font-[700]">
              {application.studentId ?? "–"}
            </dd>
          </div>
          <div className="grid gap-1 py-3 pl-4">
            <dt className="eyebrow text-ink-muted">
              {t("study.applications.phone")}
            </dt>
            <dd className="tabular m-0 font-[700]">
              {application.phoneNumber ?? "–"}
            </dd>
          </div>
        </dl>

        <p className="text-body m-0 max-h-[45dvh] overflow-y-auto whitespace-pre-line">
          {loaderData.applicationReason || (
            <span className="text-ink-subtle">
              {t("study.applications.noReason")}
            </span>
          )}
        </p>

        {failed && (
          <p
            role="alert"
            className="m-0 text-[0.875rem] font-[650] text-danger"
          >
            {failed}
          </p>
        )}

        {status !== "APPROVED" && (
          <DialogFooter>
            {status === "PENDING" && (
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button variant="destructive-outline" disabled={busy}>
                      {pendingIntent === "reject" ? (
                        <Spinner />
                      ) : (
                        <XIcon aria-hidden="true" />
                      )}
                      {t("study.applications.reject")}
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t("study.applications.rejectConfirmTitle", { name })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("study.applications.rejectConfirmDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogClose
                      render={
                        <Button variant="outline">{t("common.cancel")}</Button>
                      }
                    />
                    <AlertDialogClose
                      render={
                        <Button
                          variant="destructive"
                          onClick={() => submit("reject")}
                        >
                          {t("study.applications.reject")}
                        </Button>
                      }
                    />
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button disabled={busy} onClick={() => submit("approve")}>
              {pendingIntent === "approve" ? (
                <Spinner />
              ) : (
                <CheckIcon aria-hidden="true" />
              )}
              {t("study.applications.approve")}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
