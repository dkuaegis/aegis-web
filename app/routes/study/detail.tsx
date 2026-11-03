import {
  enrollStudy,
  getMyStudyApplication,
  getMyTodayAttendance,
  getStudy,
  markAttendance,
  updateMyStudyApplication,
} from "@app/api/generated/endpoints";
import { PageHeader } from "@app/components/page/PageHeader";
import { AttendancePanel } from "@app/components/study/panels/AttendancePanel";
import { InstructorPanel } from "@app/components/study/panels/InstructorPanel";
import { JoinPanel } from "@app/components/study/panels/JoinPanel";
import {
  CATEGORY_TONE,
  capacityLabel,
  parseId,
  roleOf,
  stripLineNumber,
} from "@app/components/study/study";
import { useStudyContext } from "@app/components/study/useStudyContext";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { runAction } from "@app/lib/actions";
import { hasErrorCode } from "@app/lib/errors";
import { optional } from "@app/lib/route-data";
import { pageTitle } from "@app/lib/title";
import { CheckIcon } from "lucide-react";
import type { Route } from "./+types/detail";

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
    optional(getMyTodayAttendance(studyId, { signal }), signal),
  ]);
  return {
    study,
    application,
    attendedToday: attendance?.attended ?? false,
  };
}

type Intent = "join" | "apply" | "update-application" | "attend";

export async function clientAction({
  params,
  request,
}: Route.ClientActionArgs) {
  const studyId = parseId(params.studyId);
  const form = await request.formData();
  const intent = String(form.get("intent")) as Intent;
  const applicationReason = String(form.get("applicationReason") ?? "").trim();

  // Toasts are raised here rather than in the forms: a successful enroll
  // changes the visitor's role, which swaps the form out of the page.
  switch (intent) {
    case "join":
      return runAction(
        intent,
        () => enrollStudy(studyId, { applicationReason: null }),
        { success: translate("study.join.fcfsDone") }
      );
    case "apply":
      return runAction(
        intent,
        () => enrollStudy(studyId, { applicationReason }),
        { success: translate("study.application.submitted") }
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
