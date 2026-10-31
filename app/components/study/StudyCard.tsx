import type { GeneralStudySummary } from "@app/api/generated/model";
import { Badge } from "@app/components/ui/badge";
import { useI18n } from "@app/i18n";
import { cn } from "@app/lib/utils";
import { Link } from "react-router";
import { CATEGORY_TONE, isRecruiting, type StudyRole } from "./study";

interface StudyCardProps {
  study: GeneralStudySummary;
  role: StudyRole | null;
  /** Outside the sign-up window only the head count is worth showing. */
  enrollmentOpen: boolean;
}

/**
 * One study in the list. The category colour is only a marker, so studies
 * that share a category sit side by side without blocks of the same colour.
 * Room left is the usual state, so only a full study carries a badge.
 */
export function StudyCard({ study, role, enrollmentOpen }: StudyCardProps) {
  const { t } = useI18n();
  const full = enrollmentOpen && !isRecruiting(study);
  const showMeter = enrollmentOpen && study.maxParticipants > 0;
  const capacity = !enrollmentOpen
    ? t("study.labels.participants", { count: study.participantCount })
    : study.maxParticipants > 0
      ? t("study.labels.participantsOf", {
          count: study.participantCount,
          max: study.maxParticipants,
        })
      : t("study.labels.unlimited");

  return (
    <li className="group/card relative grid min-h-48 content-between gap-6 bg-paper-raised p-5 shadow-[inset_0_0_0_1px_transparent] transition-shadow duration-200 hover:shadow-[inset_0_0_0_1.5px_var(--ink)] has-focus-visible:outline-3 has-focus-visible:outline-blue sm:p-6">
      <div className="grid gap-3">
        <div className="flex h-6 items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2 text-[0.8125rem] font-[700] text-ink-muted">
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0"
              style={{ background: CATEGORY_TONE[study.category] }}
            />
            <span className="truncate">
              {t(`study.labels.categories.${study.category}`)} ·{" "}
              {t(`study.labels.levels.${study.level}`)}
            </span>
          </span>
          <span className="flex shrink-0 gap-1.5">
            {role && (
              <Badge tone={role === "applicant" ? "outline" : "ink"}>
                {t(`study.labels.roles.${role}`)}
              </Badge>
            )}
            {full && <Badge tone="neutral">{t("study.labels.full")}</Badge>}
          </span>
        </div>
        <h3
          className={cn(
            "m-0 line-clamp-2 text-[1.3125rem] leading-[1.3] font-[800] tracking-[-0.035em]",
            full && "text-ink-muted"
          )}
        >
          <Link
            to={`/study/${study.id}`}
            className="outline-none after:absolute after:inset-0"
          >
            {study.title}
          </Link>
        </h3>
      </div>

      <dl className="m-0 grid gap-3 text-[0.875rem] leading-snug">
        <div>
          <dt className="sr-only">{t("study.detail.schedule")}</dt>
          <dd
            className={cn(
              "m-0 line-clamp-2 text-ink-muted",
              !study.schedule && "text-ink-subtle"
            )}
          >
            {study.schedule || t("study.labels.noSchedule")}
          </dd>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <dt className="sr-only">{t("study.detail.instructor")}</dt>
            <dd className="m-0 truncate font-[700]">
              {t("study.list.leading", { name: study.instructor })}
            </dd>
          </div>
          <div className="shrink-0">
            <dt className="sr-only">{t("study.detail.capacity")}</dt>
            <dd className="m-0 grid justify-items-end gap-1.5">
              <span className="tabular font-[650] text-ink-muted">
                {capacity}
              </span>
              {showMeter && (
                <span aria-hidden="true" className="h-1 w-20 bg-paper-sunken">
                  <span
                    className={cn(
                      "block h-full",
                      full ? "bg-ink-subtle" : "bg-blue"
                    )}
                    style={{
                      width: `${Math.min(100, (study.participantCount / study.maxParticipants) * 100)}%`,
                    }}
                  />
                </span>
              )}
            </dd>
          </div>
        </div>
      </dl>
    </li>
  );
}
