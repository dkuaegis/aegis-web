import {
  enrollStudy,
  getMyStudyApplication,
  getMyTodayAttendance,
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
  stripLineNumber,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@app/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@app/components/ui/field";
import { CodeField } from "@app/components/ui/otp-field";
import { Spinner } from "@app/components/ui/spinner";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { runAction, useFetcherResult } from "@app/lib/actions";
import { hasErrorCode } from "@app/lib/errors";
import { pageTitle } from "@app/lib/title";
import { cn } from "@app/lib/utils";
import {
  ArrowRightIcon,
  CheckIcon,
  ClipboardListIcon,
  KeyRoundIcon,
  PencilLineIcon,
  UsersIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link, useFetcher } from "react-router";
import type { Route } from "./+types/detail";
import { useStudyContext } from "./layout";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    {
      title: pageTitle(
        loaderData?.study.title ?? translate("study.list.metaTitle")
      ),
    },
  ];
}

export async function clientLoader({
  params,
  request,
}: Route.ClientLoaderArgs) {
  const studyId = parseId(params.studyId);
  const { signal } = request;
  const study = await getStudy(studyId, { signal });
  const [application, attendance] = await Promise.all([
    // Only application studies keep applications; first-come studies refuse
    // the lookup outright.
    study.recruitmentMethod === "APPLICATION"
      ? getMyStudyApplication(studyId, { signal }).catch((error: unknown) => {
          if (hasErrorCode(error, "STUDY_APPLICATION_NOT_FOUND")) return null;
          throw error;
        })
      : null,
    // Not worth an error page: without it the panel still offers the code
    // input, and the server refuses a second check-in.
    getMyTodayAttendance(studyId, { signal }).catch(() => ({
      attended: false,
    })),
  ]);
  return { study, application, attendedToday: attendance.attended };
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
  const { study, application, attendedToday } = loaderData;
  const role = roleOf(roles, study.id);

  return (
    <article
      className="narrow-frame [--frame-width:75rem]"
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
        className="border-b-0"
      />

      <dl className="frame-x m-0 grid lg:gutter-x grid-cols-2 border-y border-ink bg-paper-sunken lg:grid-cols-4">
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

      <div className="gutter-x grid gap-3 py-[clamp(2.25rem,5vw,4.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]">
        <aside className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:order-2 lg:self-start">
          {role === "instructor" ? (
            <InstructorPanel study={study} />
          ) : role === "participant" ? (
            <AttendancePanel attendedToday={attendedToday} />
          ) : (
            <JoinPanel study={study} application={application} />
          )}
        </aside>

        <div className="grid min-w-0 content-start gap-3 lg:order-1">
          <DetailSection id="study-about" title={t("study.detail.about")}>
            <p className="text-body m-0 max-w-[68ch] text-[1.0625rem] whitespace-pre-line">
              {study.description}
            </p>
          </DetailSection>

          {study.curricula.length > 0 && (
            <DetailSection
              id="study-curriculum"
              title={t("study.detail.curriculum")}
            >
              <ol className="m-0 grid list-none divide-y divide-line p-0">
                {study.curricula.map((item, index) => (
                  <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: lines may repeat and never reorder
                    key={index}
                    className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3 py-3.5 first:pt-0 last:pb-0"
                  >
                    <span className="eyebrow tabular pt-1 text-ink-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[1rem] leading-relaxed font-[600] whitespace-pre-line">
                      {stripLineNumber(item)}
                    </span>
                  </li>
                ))}
              </ol>
            </DetailSection>
          )}

          {study.qualifications.length > 0 && (
            <DetailSection
              id="study-qualifications"
              title={t("study.detail.qualifications")}
            >
              <ul className="m-0 grid list-none divide-y divide-line p-0">
                {study.qualifications.map((item, index) => (
                  <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: lines may repeat and never reorder
                    key={index}
                    className="flex gap-3 py-3.5 first:pt-0 last:pb-0"
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
            </DetailSection>
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
    <div className="grid content-start gap-1.5 border-line px-(--page-pad) py-5 not-last:border-r max-lg:nth-[2]:border-r-0 max-lg:nth-[-n+2]:border-b lg:px-6 lg:first:pl-0">
      <dt className="eyebrow text-ink-muted">{label}</dt>
      <dd className="m-0 text-[1rem] leading-snug font-[720]">{children}</dd>
    </div>
  );
}

function DetailSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="grid gap-4 bg-paper-raised p-5 sm:p-6"
    >
      <h2 id={id} className="m-0 text-[1.125rem] font-[800] tracking-[-0.02em]">
        {title}
      </h2>
      {children}
    </section>
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
        {enrollment.status === "open" ? (
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
        ) : (
          <div className="grid gap-2">
            <p className="m-0 text-[0.875rem] font-[700] text-ink-muted">
              {t("study.join.myApplication")}
            </p>
            <p className="m-0 whitespace-pre-wrap text-[0.9375rem] leading-relaxed [overflow-wrap:anywhere]">
              {application.applicationReason}
            </p>
            <p className="m-0 text-[0.875rem] text-ink-muted">
              {t("study.join.editClosed")}
            </p>
          </div>
        )}
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

  if (enrollment.status !== "open") {
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

function AttendancePanel({ attendedToday }: { attendedToday: boolean }) {
  const { t } = useI18n();
  return (
    <Panel heading={t("study.labels.roles.participant")}>
      <div className="grid gap-2">
        <p className="m-0 text-[1.25rem] leading-snug font-[800] tracking-[-0.035em]">
          {t("study.attendance.heading")}
        </p>
        <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
          {attendedToday
            ? t("study.attendance.attendedToday")
            : t("study.attendance.prompt")}
        </p>
      </div>
      {!attendedToday && <AttendanceDialog />}
    </Panel>
  );
}

/**
 * The code is typed in a dialog: digit boxes have a natural size, and the
 * side panel's width changes with the screen.
 */
function AttendanceDialog() {
  const { t } = useI18n();
  const fetcher = useFetcher<typeof clientAction>({ key: "attend" });
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [touched, setTouched] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const busy = fetcher.state !== "idle";
  const valid = /^\d{4}$/.test(code);

  useFetcherResult(fetcher, (result) => {
    if (result.ok) {
      setOpen(false);
      return;
    }
    // The boxes were disabled while sending; clear them and put the caret
    // back so the next try can be typed straight away.
    setCode("");
    requestAnimationFrame(() =>
      formRef.current?.querySelector("input")?.focus()
    );
  });

  const submit = (value: string) => {
    setTouched(true);
    if (!/^\d{4}$/.test(value)) return;
    fetcher.submit({ intent: "attend", code: value }, { method: "post" });
  };

  const serverError =
    fetcher.data?.ok === false && !busy && !code ? fetcher.data.message : null;
  const error =
    touched && !valid && code ? t("study.attendance.invalid") : serverError;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (busy) return;
        if (next) {
          setCode("");
          setTouched(false);
        }
        setOpen(next);
      }}
    >
      <DialogTrigger
        render={
          <Button size="lg" variant="ink" className="w-full">
            <KeyRoundIcon aria-hidden="true" />
            {t("study.attendance.open")}
          </Button>
        }
      />
      <DialogContent
        className="max-w-sm text-center"
        // Straight to the first box, so phones raise the number pad.
        initialFocus={() => formRef.current?.querySelector("input") ?? true}
      >
        <form
          ref={formRef}
          noValidate
          className="grid gap-6"
          onSubmit={(event) => {
            event.preventDefault();
            submit(code);
          }}
        >
          <DialogHeader className="px-0 text-balance">
            <DialogTitle>{t("study.attendance.dialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("study.attendance.description")}
            </DialogDescription>
          </DialogHeader>
          <Field invalid={Boolean(error)}>
            <FieldLabel className="sr-only">
              {t("study.attendance.label")}
            </FieldLabel>
            <CodeField
              length={4}
              className="justify-center"
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
            {error && (
              <FieldError className="justify-center">{error}</FieldError>
            )}
          </Field>
          <Button type="submit" size="lg" variant="ink" disabled={busy}>
            {busy && <Spinner />}
            {t("study.attendance.submit")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
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
      <nav className="grid divide-y divide-line">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center gap-3 py-3.5 last:pb-0 text-[1.0625rem] font-[750] tracking-[-0.02em] transition-colors hover:text-blue"
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
