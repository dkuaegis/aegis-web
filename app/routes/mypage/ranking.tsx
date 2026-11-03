import { getPointRanking } from "@app/api/generated/endpoints";
import type { PointRankingResponse } from "@app/api/generated/model";
import { PROFILE_ICONS } from "@app/components/mypage/mypage";
import { Subpage } from "@app/components/mypage/Subpage";
import { EmptyState } from "@app/components/page/States";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { formatNumber } from "@app/lib/format";
import { pageTitle } from "@app/lib/title";
import { cn } from "@app/lib/utils";
import type { Route } from "./+types/ranking";

export function meta() {
  return [{ title: pageTitle(translate("mypage.ranking.metaTitle")) }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return { ranking: await getPointRanking({ signal: request.signal }) };
}

export default function Ranking({ loaderData }: Route.ComponentProps) {
  const { t } = useI18n();
  const { top10, me, memberCount } = loaderData.ranking;
  const meInTop = me !== null && top10.some((row) => isSame(row, me));

  return (
    <Subpage title={t("mypage.ranking.metaTitle")}>
      <div className="grid gap-3">
        <p className="tabular m-0 text-[0.875rem] font-[750] text-ink-muted">
          {t("mypage.ranking.members", { count: formatNumber(memberCount) })}
        </p>

        {me && !meInTop && (
          <section aria-label={t("mypage.ranking.myRank")} className="mb-2">
            <RankRow row={me} highlighted label={t("mypage.ranking.me")} />
          </section>
        )}

        {top10.length === 0 ? (
          <EmptyState title={t("mypage.ranking.empty")} />
        ) : (
          <ol className="m-0 grid list-none gap-0.5 p-0">
            {top10.map((row) => (
              <li key={`${row.rank}-${row.name}`}>
                <RankRow
                  row={row}
                  highlighted={me !== null && isSame(row, me)}
                  label={
                    me !== null && isSame(row, me)
                      ? t("mypage.ranking.me")
                      : undefined
                  }
                />
              </li>
            ))}
          </ol>
        )}
      </div>
    </Subpage>
  );
}

/** Rows carry no member id; rank plus name is unique enough to spot "me". */
function isSame(a: PointRankingResponse, b: PointRankingResponse) {
  return a.rank === b.rank && a.name === b.name;
}

function RankRow({
  row,
  highlighted = false,
  label,
}: {
  row: PointRankingResponse;
  highlighted?: boolean;
  label?: string;
}) {
  const { t } = useI18n();
  const podium = row.rank <= 3;
  return (
    <div
      className={cn(
        "grid grid-cols-[2.5rem_2.5rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[3rem_2.75rem_minmax(0,1fr)_auto] sm:gap-4 sm:px-5",
        highlighted ? "bg-blue-soft" : "bg-paper-raised"
      )}
    >
      <span
        className={cn(
          "tabular text-[1.25rem] leading-none tracking-[-0.04em]",
          podium ? "font-[860]" : "font-[750] text-ink-muted"
        )}
      >
        <span className="sr-only">
          {t("mypage.ranking.rank", { rank: row.rank })}
        </span>
        <span aria-hidden="true">{String(row.rank).padStart(2, "0")}</span>
      </span>
      <img
        src={PROFILE_ICONS[row.profileIcon ?? "NONE"]}
        alt=""
        className="size-full"
      />
      <span className="flex min-w-0 items-center gap-2 text-[1rem] font-[750]">
        <span className="truncate">{row.name}</span>
        {label && (
          <span className="shrink-0 bg-blue px-1.5 py-0.5 text-[0.6875rem] font-[800] text-white">
            {label}
          </span>
        )}
      </span>
      <span className="tabular text-[1rem] font-[800]">
        {t("mypage.points", { amount: formatNumber(row.totalEarnedPoints) })}
      </span>
    </div>
  );
}
