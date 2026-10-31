import type { GeneralStudySummary } from "@app/api/generated/model";
import { Badge } from "@app/components/ui/badge";
import { useI18n } from "@app/i18n";
import { cn } from "@app/lib/utils";
import { ArrowUpRightIcon } from "lucide-react";
import { Link } from "react-router";
import {
  CATEGORY_TONE,
  capacityLabel,
  isRecruiting,
  type StudyRole,
} from "./study";

interface StudyTileProps {
  study: GeneralStudySummary;
  index: number;
  role: StudyRole | null;
}

/**
 * One study in the list, drawn like the home page's activity grid: a tinted
 * index column in the category colour beside the title and the facts.
 */
export function StudyTile({ study, index, role }: StudyTileProps) {
  const { t } = useI18n();
  const recruiting = isRecruiting(study);

  return (
    <li
      className="group/tile relative grid grid-cols-[4.75rem_minmax(0,1fr)] border-b border-line sm:grid-cols-[7.5rem_minmax(0,1fr)] lg:odd:border-r"
      style={
        { "--tile-tone": CATEGORY_TONE[study.category] } as React.CSSProperties
      }
    >
      <div className="flex flex-col justify-between bg-(--tile-tone) px-3 py-4 sm:px-4 sm:py-5">
        <span className="eyebrow tabular">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="eyebrow hidden leading-snug break-keep sm:block">
          {t(`study.labels.categories.${study.category}`)}
        </span>
        <ArrowUpRightIcon
          aria-hidden="true"
          className="size-5 transition-transform duration-200 ease-out group-hover/tile:translate-x-0.5 group-hover/tile:-translate-y-0.5"
        />
      </div>

      <div className="grid min-h-44 content-between gap-5 bg-[color-mix(in_srgb,var(--tile-tone)_14%,var(--paper-raised))] px-5 py-5 transition-colors duration-200 group-hover/tile:bg-[color-mix(in_srgb,var(--tile-tone)_30%,var(--paper-raised))] sm:px-7 sm:py-6">
        <div className="grid gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {role && (
              <Badge tone={role === "applicant" ? "outline" : "ink"}>
                {t(`study.labels.roles.${role}`)}
              </Badge>
            )}
            <Badge tone={recruiting ? "info" : "neutral"}>
              {recruiting
                ? t("study.labels.recruiting")
                : t("study.labels.closed")}
            </Badge>
            <span className="text-[0.8125rem] font-[650] text-ink-muted sm:hidden">
              {t(`study.labels.categories.${study.category}`)} ·{" "}
            </span>
            <span className="text-[0.8125rem] font-[650] text-ink-muted">
              {t(`study.labels.levels.${study.level}`)}
            </span>
          </div>
          <h3 className="m-0 text-[clamp(1.375rem,2.1vw,1.875rem)] leading-[1.18] font-[800] tracking-[-0.05em]">
            <Link
              to={`/study/${study.id}`}
              className="outline-none after:absolute after:inset-0 focus-visible:after:outline-3 focus-visible:after:-outline-offset-3 focus-visible:after:outline-blue"
            >
              {study.title}
            </Link>
          </h3>
        </div>

        <dl className="m-0 grid gap-1 text-[0.875rem] leading-snug text-ink-muted">
          <div className="flex gap-2">
            <dt className="sr-only">{t("study.detail.schedule")}</dt>
            <dd className={cn("m-0", !study.schedule && "text-ink-subtle")}>
              {study.schedule || t("study.labels.noSchedule")}
            </dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="sr-only">{t("study.detail.instructor")}</dt>
            <dd className="m-0 font-[650] text-ink">
              {t("study.list.leading", { name: study.instructor })}
            </dd>
            <dt className="sr-only">{t("study.detail.capacity")}</dt>
            <dd className="tabular m-0 before:mr-2 before:content-['·']">
              {capacityLabel(study)}
            </dd>
          </div>
        </dl>
      </div>
    </li>
  );
}
