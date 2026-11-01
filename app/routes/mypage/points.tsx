import { getPointSummary } from "@app/api/generated/endpoints";
import { FilterChip } from "@app/components/page/FilterChip";
import { EmptyState } from "@app/components/page/States";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { formatDate, formatNumber } from "@app/lib/format";
import { pageTitle } from "@app/lib/title";
import { cn } from "@app/lib/utils";
import { useSearchParams } from "react-router";
import type { Route } from "./+types/points";
import { Subpage } from "./layout";

const FILTERS = ["ALL", "EARN", "SPEND"] as const;
type Filter = (typeof FILTERS)[number];

export function meta() {
  return [{ title: pageTitle(translate("mypage.pointsPage.metaTitle")) }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return { summary: await getPointSummary({ signal: request.signal }) };
}

export default function Points({ loaderData }: Route.ComponentProps) {
  const { t } = useI18n();
  const { history } = loaderData.summary;
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get("type");
  const filter: Filter =
    FILTERS.find((value) => value === filterParam) ?? "ALL";

  if (history.length === 0) {
    return (
      <Subpage title={t("mypage.pointsPage.metaTitle")}>
        <EmptyState
          title={t("mypage.pointsPage.empty")}
          description={t("mypage.pointsPage.emptyDescription")}
        />
      </Subpage>
    );
  }

  const sorted = [...history].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
  const earned = history
    .filter((item) => item.transactionType === "EARN")
    .reduce((sum, item) => sum + item.amount, 0);
  const spent = history
    .filter((item) => item.transactionType === "SPEND")
    .reduce((sum, item) => sum + item.amount, 0);
  const visible =
    filter === "ALL"
      ? sorted
      : sorted.filter((item) => item.transactionType === filter);

  return (
    <Subpage title={t("mypage.pointsPage.metaTitle")}>
      <div className="grid gap-8">
        <dl className="m-0 grid grid-cols-2 gap-3">
          <Stat label={t("mypage.pointsPage.earned")}>
            +{t("mypage.points", { amount: formatNumber(earned) })}
          </Stat>
          <Stat label={t("mypage.pointsPage.spent")}>
            −{t("mypage.points", { amount: formatNumber(spent) })}
          </Stat>
        </dl>

        <div className="grid gap-6">
          <fieldset className="m-0 flex flex-wrap gap-1.5 border-0 p-0">
            <legend className="sr-only">
              {t("mypage.pointsPage.filterLabel")}
            </legend>
            {FILTERS.map((value) => (
              <FilterChip
                key={value}
                active={filter === value}
                count={
                  value === "ALL"
                    ? history.length
                    : history.filter((item) => item.transactionType === value)
                        .length
                }
                onClick={() =>
                  setSearchParams(value === "ALL" ? {} : { type: value }, {
                    replace: true,
                    preventScrollReset: true,
                  })
                }
              >
                {t(`mypage.pointsPage.filters.${value}`)}
              </FilterChip>
            ))}
          </fieldset>

          {visible.length === 0 ? (
            <EmptyState title={t("mypage.pointsPage.emptyFiltered")} />
          ) : (
            <ol className="m-0 grid list-none gap-0.5 p-0">
              {visible.map((item) => {
                const earn = item.transactionType === "EARN";
                return (
                  <li
                    key={item.pointTransactionId}
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-4 bg-paper-raised px-4 py-3.5 sm:gap-5 sm:px-5"
                  >
                    <span className="tabular text-[0.875rem] font-[600] text-ink-subtle">
                      {formatDate(item.createdAt)}
                    </span>
                    <span className="text-[0.9375rem] font-[650]">
                      {item.reason}
                    </span>
                    <span
                      className={cn(
                        "tabular text-[1rem] font-[800]",
                        earn ? "text-success" : "text-debit"
                      )}
                    >
                      {earn ? "+" : "−"}
                      {formatNumber(item.amount)}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>
    </Subpage>
  );
}

function Stat({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5 bg-paper-raised px-5 py-4">
      <dt className="text-[0.8125rem] font-[700] text-ink-muted">{label}</dt>
      <dd className="tabular m-0 text-[1.375rem] leading-none font-[800] tracking-[-0.03em]">
        {children}
      </dd>
    </div>
  );
}
