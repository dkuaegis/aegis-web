import { getStudies } from "@app/api/generated/endpoints";
import type { GeneralStudySummary } from "@app/api/generated/model";
import { PageHeader } from "@app/components/page/PageHeader";
import { EmptyState } from "@app/components/page/States";
import { StudyCard } from "@app/components/study/StudyCard";
import {
  CATEGORY_TONE,
  enrollmentWindow,
  isRecruiting,
  roleOf,
} from "@app/components/study/study";
import { buttonVariants } from "@app/components/ui/button";
import { Checkbox } from "@app/components/ui/checkbox";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { cn } from "@app/lib/utils";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import type { Route } from "./+types/list";
import { useStudyContext } from "./layout";

export function meta() {
  return [{ title: `${translate("study.list.metaTitle")} | AEGIS` }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return { studies: await getStudies({ signal: request.signal }) };
}

export default function StudyList({ loaderData }: Route.ComponentProps) {
  const { t } = useI18n();
  const { roles, policy } = useStudyContext();
  const { studies } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const recruitingId = useId();
  const chipRow = useRef<HTMLDivElement>(null);

  const categories = [...new Set(studies.map((study) => study.category))];
  const selectedParam = searchParams.get("category");
  const selected = categories.find((category) => category === selectedParam);
  const enrollment = enrollmentWindow(policy);
  const enrollmentOpen = enrollment.status === "open";
  // Room left only matters while people can sign up.
  const recruitingOnly = enrollmentOpen && searchParams.get("open") === "1";

  const matches = (study: GeneralStudySummary, category: string | null) =>
    (!category || study.category === category) &&
    (!recruitingOnly || isRecruiting(study));
  const countIn = (category: string | null) =>
    studies.filter((study) => matches(study, category)).length;
  // Open studies first; the server's order is kept within each group.
  const visible = studies.filter((study) => matches(study, selected ?? null));
  if (enrollmentOpen) {
    visible.sort((a, b) => Number(isRecruiting(b)) - Number(isRecruiting(a)));
  }
  const mine = studies.filter((study) => roleOf(roles, study.id));

  const updateFilter = (key: string, value: string | null) => {
    setSearchParams(
      (params) => {
        if (value) params.set(key, value);
        else params.delete(key);
        return params;
      },
      { replace: true, preventScrollReset: true }
    );
  };

  // A filter that came in with the URL may sit past the edge of the row.
  useEffect(() => {
    const row = chipRow.current;
    // "All" is the first chip and always in view.
    if (!row || !selected) return;
    const chip = row.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!chip) return;
    const rowBox = row.getBoundingClientRect();
    const chipBox = chip.getBoundingClientRect();
    if (chipBox.left < rowBox.left || chipBox.right > rowBox.right) {
      row.scrollLeft +=
        chipBox.left - rowBox.left - (rowBox.width - chipBox.width) / 2;
    }
  }, [selected]);

  return (
    <>
      <PageHeader
        title={t("study.list.title")}
        description={t("study.list.description")}
        actions={
          policy.studyCreationAllowed ? (
            <Link to="/study/new" className={buttonVariants({ size: "lg" })}>
              <PlusIcon aria-hidden="true" />
              {t("study.list.create")}
            </Link>
          ) : (
            <p className="m-0 max-w-56 text-[0.8125rem] leading-snug font-[650] text-ink-muted md:text-right">
              {t("study.list.creationClosed")}
            </p>
          )
        }
      />

      <div className="gutter-x grid grid-cols-1 gap-[clamp(2.5rem,5vw,4rem)] pt-[clamp(1.75rem,4vw,3rem)] pb-[clamp(3rem,7vw,6rem)]">
        {/* Open or about to open; after it closes the club announces it. */}
        {enrollment.status !== "closed" && (
          <p
            className={cn(
              "m-0 flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-[0.875rem]",
              enrollment.status === "open" ? "bg-blue-soft" : "bg-paper-sunken"
            )}
          >
            <strong className="inline-flex items-center gap-2 font-[800]">
              <span
                aria-hidden="true"
                className={cn(
                  "size-2 rounded-full",
                  enrollment.status === "open" ? "bg-blue" : "bg-ink-subtle"
                )}
              />
              {enrollment.status === "open"
                ? t("study.enrollment.open")
                : t("study.enrollment.upcoming")}
            </strong>
            <span className="font-[560] text-ink-muted">
              {enrollment.message}
            </span>
          </p>
        )}

        {mine.length > 0 && (
          <section aria-labelledby="my-studies" className="grid gap-4">
            <h2 id="my-studies" className="eyebrow m-0 text-ink-muted">
              {t("study.list.mine")}
            </h2>
            {/* A swipeable row on phones so the full list stays near the top. */}
            <ul className="-mx-(--page-gutter) m-0 flex list-none snap-x snap-mandatory scroll-px-(--page-gutter) gap-2 overflow-x-auto px-(--page-gutter) [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible sm:px-0 lg:grid-cols-3 2xl:grid-cols-4">
              {mine.map((study) => {
                const role = roleOf(roles, study.id);
                return (
                  <li
                    key={study.id}
                    className="w-[min(17rem,78vw)] shrink-0 snap-start sm:w-auto"
                  >
                    <Link
                      to={`/study/${study.id}`}
                      className="group flex h-full items-center gap-3 bg-paper-sunken px-4 py-3.5 transition-colors hover:bg-ink hover:text-paper"
                    >
                      <span
                        aria-hidden="true"
                        className="size-2.5 shrink-0"
                        style={{ background: CATEGORY_TONE[study.category] }}
                      />
                      <span className="grid min-w-0 flex-1 gap-0.5">
                        <span className="truncate text-[1rem] font-[750] tracking-[-0.02em]">
                          {study.title}
                        </span>
                        {role && (
                          <span className="text-[0.75rem] font-[700] text-ink-muted transition-colors group-hover:text-paper/70">
                            {t(`study.labels.roles.${role}`)}
                          </span>
                        )}
                      </span>
                      <ArrowRightIcon
                        aria-hidden="true"
                        className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section
          aria-labelledby="all-studies"
          className="grid grid-cols-1 gap-5"
        >
          <h2 id="all-studies" className="sr-only">
            {t("study.list.all")}
          </h2>

          {studies.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <fieldset className="m-0 min-w-0 border-0 p-0 max-sm:-mx-(--page-gutter) max-sm:w-[calc(100%_+_2*var(--page-gutter))]">
                <legend className="sr-only">
                  {t("study.list.filterLabel")}
                </legend>
                {/* One swipeable row on phones; the right edge fades to hint
                    at more. Wider screens wrap. */}
                <div
                  ref={chipRow}
                  className="flex gap-1.5 [scrollbar-width:none] max-sm:overflow-x-auto max-sm:px-(--page-gutter) max-sm:mask-[linear-gradient(to_right,#000_calc(100%-var(--page-gutter)),transparent)] sm:flex-wrap"
                >
                  <FilterChip
                    active={!selected}
                    count={countIn(null)}
                    onClick={() => updateFilter("category", null)}
                  >
                    {t("study.list.filterAll")}
                  </FilterChip>
                  {categories.map((category) => (
                    <FilterChip
                      key={category}
                      active={selected === category}
                      tone={CATEGORY_TONE[category]}
                      count={countIn(category)}
                      onClick={() =>
                        updateFilter(
                          "category",
                          selected === category ? null : category
                        )
                      }
                    >
                      {t(`study.labels.categories.${category}`)}
                    </FilterChip>
                  ))}
                </div>
              </fieldset>
              {enrollmentOpen && (
                <label
                  htmlFor={recruitingId}
                  className="flex cursor-pointer items-center gap-2.5 text-[0.875rem] font-[700]"
                >
                  <Checkbox
                    id={recruitingId}
                    checked={recruitingOnly}
                    onCheckedChange={(checked) =>
                      updateFilter("open", checked ? "1" : null)
                    }
                  />
                  {t("study.list.recruitingOnly")}
                </label>
              )}
            </div>
          )}

          {visible.length > 0 ? (
            <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {visible.map((study) => (
                <StudyCard
                  key={study.id}
                  study={study}
                  role={roleOf(roles, study.id)}
                  enrollmentOpen={enrollmentOpen}
                />
              ))}
            </ul>
          ) : studies.length === 0 ? (
            <EmptyState
              title={t("study.list.empty")}
              description={t("study.list.emptyDescription")}
            />
          ) : (
            <EmptyState
              title={t("study.list.emptyFiltered")}
              description={t("study.list.emptyFilteredDescription")}
              action={
                <button
                  type="button"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                  onClick={() => setSearchParams({}, { replace: true })}
                >
                  {t("study.list.clearFilters")}
                </button>
              }
            />
          )}
        </section>
      </div>
    </>
  );
}

function FilterChip({
  active,
  tone,
  count,
  onClick,
  children,
}: {
  active: boolean;
  tone?: string;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 px-3.5 text-[0.8125rem] font-[750] whitespace-nowrap transition-colors",
        active
          ? "bg-ink text-paper"
          : "bg-paper-sunken text-ink hover:bg-[color-mix(in_srgb,var(--ink)_12%,var(--paper))]"
      )}
    >
      {tone && (
        <span
          aria-hidden="true"
          className="size-2.5"
          style={{ background: tone }}
        />
      )}
      {children}
      <span
        className={cn(
          "tabular font-[650]",
          active ? "text-paper/65" : "text-ink-subtle"
        )}
      >
        {count}
      </span>
    </button>
  );
}
