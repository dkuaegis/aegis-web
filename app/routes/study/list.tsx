import { getStudies } from "@app/api/generated/endpoints";
import { PageHeader } from "@app/components/page/PageHeader";
import { EmptyState } from "@app/components/page/States";
import { StudyTile } from "@app/components/study/StudyTile";
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
import { useId } from "react";
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

  const categories = [...new Set(studies.map((study) => study.category))];
  const selectedParam = searchParams.get("category");
  const selected = categories.find((category) => category === selectedParam);
  const recruitingOnly = searchParams.get("open") === "1";

  const visible = studies.filter(
    (study) =>
      (!selected || study.category === selected) &&
      (!recruitingOnly || isRecruiting(study))
  );
  const mine = studies.filter((study) => roleOf(roles, study.id));
  const enrollment = enrollmentWindow(policy);

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

  return (
    <>
      <PageHeader
        eyebrow={t("study.list.eyebrow")}
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

      <p
        className={cn(
          "gutter-x m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-ink py-3.5 text-[0.875rem]",
          enrollment.open ? "bg-blue-soft" : "bg-paper-sunken"
        )}
      >
        <strong className="eyebrow inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className={cn(
              "size-2 rounded-full",
              enrollment.open ? "bg-blue" : "bg-ink-subtle"
            )}
          />
          {enrollment.open
            ? t("study.enrollment.open")
            : t("study.enrollment.closed")}
        </strong>
        <span className="font-[560] text-ink-muted">{enrollment.message}</span>
      </p>

      {mine.length > 0 && (
        <section
          aria-labelledby="my-studies"
          className="gutter-x grid gap-4 border-b border-ink py-8"
        >
          <h2 id="my-studies" className="eyebrow m-0 text-ink-muted">
            {t("study.list.mine")}
          </h2>
          <ul className="m-0 grid list-none border-t border-line p-0 md:grid-cols-2 md:gap-x-10">
            {mine.map((study) => {
              const role = roleOf(roles, study.id);
              return (
                <li key={study.id} className="border-b border-line">
                  <Link
                    to={`/study/${study.id}`}
                    className="group flex items-center gap-3 py-3.5 transition-colors hover:text-blue"
                  >
                    <span
                      aria-hidden="true"
                      className="size-3 shrink-0"
                      style={{ background: CATEGORY_TONE[study.category] }}
                    />
                    <span className="min-w-0 flex-1 truncate text-[1.0625rem] font-[750] tracking-[-0.02em]">
                      {study.title}
                    </span>
                    {role && (
                      <span className="eyebrow shrink-0 text-ink-muted">
                        {t(`study.labels.roles.${role}`)}
                      </span>
                    )}
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
        className="pb-[clamp(3rem,7vw,6rem)]"
      >
        <div className="gutter-x flex flex-wrap items-end justify-between gap-x-8 gap-y-5 pt-10 pb-6">
          <h2
            id="all-studies"
            className="m-0 flex items-baseline gap-3 text-title"
          >
            {t("study.list.all")}
            <span className="tabular text-[1rem] font-[700] tracking-normal text-ink-muted">
              {t("study.list.count", { count: visible.length })}
            </span>
          </h2>

          {studies.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <fieldset className="m-0 flex flex-wrap gap-1.5 border-0 p-0">
                <legend className="sr-only">
                  {t("study.list.filterLabel")}
                </legend>
                <FilterChip
                  active={!selected}
                  onClick={() => updateFilter("category", null)}
                >
                  {t("study.list.filterAll")}
                </FilterChip>
                {categories.map((category) => (
                  <FilterChip
                    key={category}
                    active={selected === category}
                    tone={CATEGORY_TONE[category]}
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
              </fieldset>
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
            </div>
          )}
        </div>

        {visible.length > 0 ? (
          <ul className="m-0 grid list-none border-t border-ink p-0 lg:grid-cols-2">
            {visible.map((study, index) => (
              <StudyTile
                key={study.id}
                study={study}
                index={index}
                role={roleOf(roles, study.id)}
              />
            ))}
          </ul>
        ) : (
          <div className="gutter-x">
            {studies.length === 0 ? (
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
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                    onClick={() => setSearchParams({}, { replace: true })}
                  >
                    {t("study.list.clearFilters")}
                  </button>
                }
              />
            )}
          </div>
        )}
      </section>
    </>
  );
}

function FilterChip({
  active,
  tone,
  onClick,
  children,
}: {
  active: boolean;
  tone?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 cursor-pointer items-center gap-2 border px-3.5 text-[0.8125rem] font-[750] transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line-strong bg-transparent text-ink hover:border-ink"
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
    </button>
  );
}
