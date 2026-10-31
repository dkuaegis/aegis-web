import {
  enrollStudy,
  getMyStudyApplication,
  getStudy,
  markAttendance,
  updateMyStudyApplication,
} from "@app/api/generated/endpoints";
import type {
  ApplicantStudyApplicationDetail,
  GeneralStudyDetail,
} from "@app/api/generated/model";
import { PageHeader } from "@app/components/page/PageHeader";
import { ApplicationDialog } from "@app/components/study/ApplicationDialog";
import {
  CATEGORY_TONE,
  capacityLabel,
  enrollmentWindow,
  isRecruiting,
  parseId,
  roleOf,
} from "@app/components/study/study";
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
import { Field, FieldError, FieldLabel } from "@app/components/ui/field";
import { CodeField } from "@app/components/ui/otp-field";
import { Spinner } from "@app/components/ui/spinner";
import { toast } from "@app/components/ui/toast";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { runAction, useFetcherResult } from "@app/lib/actions";
import { hasErrorCode } from "@app/lib/errors";
import { cn } from "@app/lib/utils";
import {
  ArrowRightIcon,
  CheckIcon,
  ClipboardListIcon,
  LinkIcon,
  PencilLineIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, useFetcher } from "react-router";
import type { Route } from "./+types/detail";
import { useStudyContext } from "./layout";

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: `${loaderData?.study.title ?? ""} | AEGIS` }];
}

export async function clientLoader({
  params,
  request,
}: Route.ClientLoaderArgs) {
  const studyId = parseId(params.studyId);
  const { signal } = request;
  const study = await getStudy(studyId, { signal });
  // Only application studies keep applications; first-come studies refuse
  // the lookup outright.
  const application =
    study.recruitmentMethod === "APPLICATION"
      ? await getMyStudyApplication(studyId, { signal }).catch(
          (error: unknown) => {
            if (hasErrorCode(error, "STUDY_APPLICATION_NOT_FOUND")) return null;
            throw error;
          }
        )
      : null;
  return { study, application };
}

type Intent = "enroll" | "update-application" | "attend";

export async function clientAction({
  params,
  request,
}: Route.ClientActionArgs) {
  const studyId = parseId(params.studyId);
  const form = await request.formData();
  const intent = String(form.get("intent")) as Intent;
  const reason = form.get("applicationReason");
  const applicationReason = typeof reason === "string" ? reason.trim() : null;

  // Toasts are raised here rather than in the forms: a successful enroll
  // changes the visitor's role, which swaps the form out of the page.
  switch (intent) {
    case "enroll":
      return runAction(
        intent,
        () => enrollStudy(studyId, { applicationReason }),
        {
          success:
            applicationReason === null
              ? translate("study.join.fcfsDone")
              : translate("study.application.submitted"),
        }
      );
    case "update-application":
      return runAction(
        intent,
        () => updateMyStudyApplication(studyId, { applicationReason }),
        { success: translate("study.application.updated") }
      );
    case "attend":
      return runAction(
        intent,
        () => markAttendance(studyId, { code: String(form.get("code")) }),
        { success: translate("study.attendance.done") }
      );
  }
}

export default function StudyDetail({ loaderData }: Route.ComponentProps) {
  const { t } = useI18n();
  const { roles } = useStudyContext();
  const { study, application } = loaderData;
  const role = roleOf(roles, study.id);

  const copyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success(t("common.copied")))
      .catch(() => toast.error(t("common.copyFailed")));
  };

  return (
    <article
      style={
        { "--study-tone": CATEGORY_TONE[study.category] } as React.CSSProperties
      }
    >
      <PageHeader
        back={{ to: "/study", label: t("study.detail.back") }}
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="size-2.5 bg-(--study-tone)" />
            {t(`study.labels.categories.${study.category}`)} ·{" "}
            {t(`study.labels.levels.${study.level}`)}
          </span>
        }
        title={study.title}
        period={false}
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={copyLink}
            className="max-md:-ml-3.5"
          >
            <LinkIcon aria-hidden="true" />
            {t("study.detail.copyLink")}
          </Button>
        }
        className="border-b-0"
      />

      <dl className="m-0 grid grid-cols-2 border-y border-ink bg-[color-mix(in_srgb,var(--study-tone)_22%,var(--paper))] lg:grid-cols-4">
        <Fact label={t("study.detail.instructor")}>{study.instructor}</Fact>
        <Fact label={t("study.detail.capacity")}>
          <span className="tabular">{capacityLabel(study)}</span>
        </Fact>
        <Fact label={t("study.detail.schedule")}>
          {study.schedule || (
            <span className="text-ink-subtle">
              {t("study.labels.noSchedule")}
            </span>
          )}
        </Fact>
        <Fact label={t("study.detail.recruitment")}>
          {t(`study.labels.recruitmentMethods.${study.recruitmentMethod}`)}
        </Fact>
      </dl>

      <div className="gutter-x grid gap-x-[clamp(2.5rem,5vw,5rem)] gap-y-10 py-[clamp(2.25rem,5vw,4.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]">
        <aside className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:order-2 lg:self-start">
          {role === "instructor" ? (
            <InstructorPanel study={study} />
          ) : role === "participant" ? (
            <AttendancePanel />
          ) : (
            <JoinPanel study={study} application={application} />
          )}
        </aside>

        <div className="grid max-w-[54rem] min-w-0 content-start gap-12 lg:order-1">
          <section aria-labelledby="study-about" className="grid gap-4">
            <h2 id="study-about" className="eyebrow m-0 text-ink-muted">
              {t("study.detail.about")}
            </h2>
            <p className="text-body m-0 max-w-[68ch] text-[1.0625rem] whitespace-pre-line">
              {study.description}
            </p>
          </section>

          {study.curricula.length > 0 && (
            <section aria-labelledby="study-curriculum" className="grid gap-4">
              <h2 id="study-curriculum" className="eyebrow m-0 text-ink-muted">
                {t("study.detail.curriculum")}
              </h2>
              <ol className="m-0 grid list-none border-t border-ink p-0">
                {study.curricula.map((item, index) => (
                  <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: lines may repeat and never reorder
                    key={index}
                    className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3 border-b border-line py-4"
                  >
                    <span className="eyebrow tabular pt-1 text-ink-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[1rem] leading-relaxed font-[600] whitespace-pre-line">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {study.qualifications.length > 0 && (
            <section
              aria-labelledby="study-qualifications"
              className="grid gap-4"
            >
              <h2
                id="study-qualifications"
                className="eyebrow m-0 text-ink-muted"
              >
                {t("study.detail.qualifications")}
              </h2>
              <ul className="m-0 grid list-none border-t border-ink p-0">
                {study.qualifications.map((item, index) => (
                  <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: lines may repeat and never reorder
                    key={index}
                    className="flex gap-3 border-b border-line py-4"
                  >
                    <CheckIcon
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0"
                    />
                    <span className="text-[1rem] leading-relaxed font-[600] whitespace-pre-line">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid content-start gap-1.5 border-line px-[var(--page-gutter)] py-5 not-last:border-r max-lg:nth-[2]:border-r-0 max-lg:nth-[-n+2]:border-b lg:px-6 lg:first:pl-[var(--page-gutter)]">
      <dt className="eyebrow text-ink-muted">{label}</dt>
      <dd className="m-0 text-[1rem] leading-snug font-[720]">{children}</dd>
    </div>
  );
}

function Panel({
  heading,
  children,
  className,
}: {
  heading: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-label={heading}
      className={cn(
        "grid gap-5 border border-ink bg-paper-raised p-6",
        className
      )}
    >
      <h2 className="eyebrow m-0 text-ink-muted">{heading}</h2>
      {children}
    </section>
  );
}

function PanelStatus({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="grid gap-2" role="status">
      <p className="m-0 text-[1.25rem] leading-snug font-[800] tracking-[-0.035em]">
        {title}
      </p>
      {description && (
        <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
          {description}
        </p>
      )}
    </div>
  );
}

function JoinPanel({
  study,
  application,
}: {
  study: GeneralStudyDetail;
  application: ApplicantStudyApplicationDetail | null;
}) {
  const { t } = useI18n();
  const { policy } = useStudyContext();
  const enrollment = enrollmentWindow(policy);
  const heading = t("study.join.heading");

  if (application?.status === "APPROVED") {
    return (
      <Panel heading={heading}>
        <PanelStatus
          title={t("study.join.approved")}
          description={t("study.join.approvedDescription")}
        />
      </Panel>
    );
  }

  if (application?.status === "PENDING") {
    return (
      <Panel heading={heading}>
        <PanelStatus
          title={t("study.join.pending")}
          description={t("study.join.pendingDescription")}
        />
        <ApplicationDialog
          key="update-application"
          intent="update-application"
          defaultReason={application.applicationReason ?? ""}
          trigger={
            <Button variant="outline" className="w-full">
              <PencilLineIcon aria-hidden="true" />
              {t("study.join.editApplication")}
            </Button>
          }
        />
      </Panel>
    );
  }

  if (application?.status === "REJECTED") {
    return (
      <Panel heading={heading}>
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
      </Panel>
    );
  }

  if (!isRecruiting(study)) {
    return (
      <Panel heading={heading}>
        <PanelStatus
          title={t("study.join.full")}
          description={t("study.join.fullDescription")}
        />
      </Panel>
    );
  }

  if (!enrollment.open) {
    return (
      <Panel heading={heading}>
        <PanelStatus
          title={t("study.join.closed")}
          description={enrollment.message}
        />
      </Panel>
    );
  }

  return (
    <Panel heading={heading}>
      <div className="grid gap-2">
        <p className="m-0 text-[1.25rem] leading-snug font-[800] tracking-[-0.035em]">
          {t(`study.labels.recruitmentMethods.${study.recruitmentMethod}`)}
        </p>
        <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
          {t(`study.labels.recruitmentMethodHints.${study.recruitmentMethod}`)}{" "}
          {enrollment.message}
        </p>
      </div>
      {study.recruitmentMethod === "FCFS" ? (
        <FcfsJoin />
      ) : (
        <ApplicationDialog
          key="enroll"
          intent="enroll"
          defaultReason=""
          trigger={
            <Button size="lg" className="w-full">
              {t("study.join.applyAction")}
              <ArrowRightIcon aria-hidden="true" />
            </Button>
          }
        />
      )}
    </Panel>
  );
}

function FcfsJoin() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher<typeof clientAction>({ key: "enroll" });
  const busy = fetcher.state !== "idle";

  useFetcherResult(fetcher, (result) => {
    if (!result.ok) return;
    setOpen(false);
  });

  const failed = fetcher.data?.ok === false ? fetcher.data.message : null;

  return (
    <AlertDialog open={open} onOpenChange={(next) => !busy && setOpen(next)}>
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
        {failed && !busy && (
          <p
            role="alert"
            className="m-0 text-[0.875rem] font-[650] text-danger"
          >
            {failed}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogClose
            disabled={busy}
            render={<Button variant="outline">{t("common.cancel")}</Button>}
          />
          <Button
            disabled={busy}
            onClick={() =>
              fetcher.submit({ intent: "enroll" }, { method: "post" })
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

function AttendancePanel() {
  const { t } = useI18n();
  const fetcher = useFetcher<typeof clientAction>({ key: "attend" });
  const [code, setCode] = useState("");
  const [touched, setTouched] = useState(false);
  const busy = fetcher.state !== "idle";
  const valid = /^\d{4}$/.test(code);

  useFetcherResult(fetcher, (result) => {
    if (!result.ok) return;
    setCode("");
    setTouched(false);
  });

  const submit = (value: string) => {
    setTouched(true);
    if (!/^\d{4}$/.test(value)) return;
    fetcher.submit({ intent: "attend", code: value }, { method: "post" });
  };

  const serverError =
    fetcher.data?.ok === false && !busy ? fetcher.data.message : null;
  const error = touched && !valid ? t("study.attendance.invalid") : serverError;

  return (
    <Panel heading={t("study.labels.roles.participant")}>
      <div className="grid gap-2">
        <p className="m-0 text-[1.25rem] leading-snug font-[800] tracking-[-0.035em]">
          {t("study.attendance.heading")}
        </p>
        <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
          {t("study.attendance.description")}
        </p>
      </div>
      <form
        noValidate
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          submit(code);
        }}
      >
        <Field invalid={Boolean(error)}>
          <FieldLabel className="sr-only">
            {t("study.attendance.label")}
          </FieldLabel>
          <CodeField
            length={4}
            value={code}
            onValueChange={(value) => {
              setCode(value);
              if (touched) setTouched(false);
            }}
            onValueComplete={submit}
            disabled={busy}
            slotLabel={(index) =>
              t("study.attendance.slot", { index: index + 1, length: 4 })
            }
          />
          {error && <FieldError>{error}</FieldError>}
        </Field>
        <Button type="submit" size="lg" variant="ink" disabled={busy}>
          {busy && <Spinner />}
          {t("study.attendance.submit")}
        </Button>
      </form>
    </Panel>
  );
}

function InstructorPanel({ study }: { study: GeneralStudyDetail }) {
  const { t } = useI18n();
  const links = [
    study.recruitmentMethod === "APPLICATION" && {
      to: `/study/${study.id}/applications`,
      label: t("study.instructor.applications"),
      icon: ClipboardListIcon,
    },
    {
      to: `/study/${study.id}/members`,
      label: t("study.instructor.members"),
      icon: UsersIcon,
    },
    {
      to: `/study/${study.id}/attendance`,
      label: t("study.instructor.attendance"),
      icon: CheckIcon,
    },
    {
      to: `/study/${study.id}/edit`,
      label: t("study.instructor.edit"),
      icon: PencilLineIcon,
    },
  ].filter((link) => link !== false);

  return (
    <Panel heading={t("study.instructor.heading")} className="gap-3">
      <nav className="grid border-t border-ink">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center gap-3 border-b border-line py-4 text-[1.0625rem] font-[750] tracking-[-0.02em] transition-colors hover:text-blue"
          >
            <Icon aria-hidden="true" className="size-4.5 text-ink-muted" />
            <span className="flex-1">{label}</span>
            <ArrowRightIcon
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        ))}
      </nav>
    </Panel>
  );
}
