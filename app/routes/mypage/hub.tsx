import {
  getMyCoupons,
  getMyDrawHistories,
  getPointRanking,
  getPointSummary,
} from "@app/api/generated/endpoints";
import { Balance } from "@app/components/mypage/Balance";
import { DRAW_COST, PRIZES } from "@app/components/mypage/mypage";
import { Period } from "@app/components/site/Wordmark";
import { buttonVariants } from "@app/components/ui/button";
import { useI18n } from "@app/i18n";
import { formatDate, formatNumber } from "@app/lib/format";
import { cn } from "@app/lib/utils";
import { ArrowRightIcon, QrCodeIcon } from "lucide-react";
import { Link } from "react-router";
import type { Route } from "./+types/hub";
import { ProfileIconDialog, useMe } from "./layout";

/** A card whose summary failed to load shows a note instead of the page failing. */
async function settle<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch {
    return null;
  }
}

/** How many recent entries the history card shows. */
const RECENT_COUNT = 6;
/** The earning guide shows until the history has this many entries. */
const GUIDE_UNTIL = 5;

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const { signal } = request;
  const [summary, coupons, ranking, draws] = await Promise.all([
    settle(getPointSummary({ signal })),
    settle(getMyCoupons({ signal })),
    settle(getPointRanking({ signal })),
    settle(getMyDrawHistories({ signal })),
  ]);
  return { summary, coupons, ranking, draws };
}

export default function MypageHub({ loaderData }: Route.ComponentProps) {
  const { t } = useI18n();
  const me = useMe();
  const { summary, coupons, ranking, draws } = loaderData;

  const history = summary
    ? [...summary.history].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
      )
    : null;
  const recent = history?.slice(0, RECENT_COUNT) ?? null;
  const drawsLeft = Math.floor(me.pointBalance / DRAW_COST);
  const lastDraw = draws?.[0];
  const validCoupons = coupons?.filter((coupon) => coupon.isValid).length;

  return (
    <>
      <header className="gutter-x flex flex-wrap items-center justify-between gap-x-8 gap-y-6 pt-[clamp(2.25rem,6vw,5.5rem)]">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <ProfileIconDialog current={me.profileIcon ?? "NONE"} />
          <div className="grid min-w-0 gap-1">
            <p className="m-0 text-[0.875rem] font-[700] text-ink-muted">
              {t("mypage.hub.greeting")}
            </p>
            <h1 className="text-title m-0 min-w-0 truncate">
              {t("mypage.hub.name", { name: me.name })}
              <Period />
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-6 max-sm:w-full max-sm:justify-between">
          <Balance amount={me.pointBalance} />
          <Link to="/mypage/qr" className={buttonVariants({ variant: "ink" })}>
            <QrCodeIcon aria-hidden="true" />
            {t("mypage.qr")}
          </Link>
        </div>
      </header>

      {/* The history is the one list that grows, so it gets the tall column
          on wide screens; on phones the status cards come first. */}
      <div className="gutter-x grid grid-cols-1 gap-3 pt-[clamp(1.75rem,4vw,2.5rem)] pb-[clamp(3rem,7vw,6rem)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <HubCard
          to="/mypage/points"
          title={t("mypage.pointsPage.metaTitle")}
          className="max-lg:order-last"
        >
          {history === null ? (
            <LoadFailed />
          ) : (
            <>
              {history.length === 0 ? (
                <Hint>{t("mypage.pointsPage.empty")}</Hint>
              ) : (
                // One grid for every row so the dates share a column width.
                <ol className="m-0 grid list-none grid-cols-[auto_minmax(0,1fr)_auto] gap-x-3 gap-y-2 p-0">
                  {recent?.map((item) => {
                    const earn = item.transactionType === "EARN";
                    return (
                      <li
                        key={item.pointTransactionId}
                        className="col-span-3 grid grid-cols-subgrid items-baseline text-[0.875rem] font-[650]"
                      >
                        <span className="tabular text-[0.8125rem] font-[600] text-ink-subtle">
                          {formatDate(item.createdAt)}
                        </span>
                        <span className="truncate">{item.reason}</span>
                        <span
                          className={cn(
                            "tabular font-[800]",
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
              {history.length < GUIDE_UNTIL && <EarnGuide />}
              {history.length > RECENT_COUNT && (
                <p className="m-0 mt-auto text-[0.8125rem] font-[700] text-ink-muted">
                  {t("mypage.hub.total", { count: history.length })}
                </p>
              )}
            </>
          )}
        </HubCard>

        <div className="grid grid-cols-1 gap-3 lg:grid-rows-[auto_1fr]">
          <HubCard to="/mypage/shop" title={t("mypage.shop.metaTitle")}>
            <div className="grid gap-2.5">
              <p className="m-0 text-[1.25rem] leading-tight font-[800] tracking-[-0.03em]">
                {drawsLeft > 0
                  ? t("mypage.hub.canDraw")
                  : t("mypage.shop.needMore", {
                      amount: DRAW_COST - me.pointBalance,
                    })}
              </p>
              {drawsLeft === 0 && (
                <span aria-hidden="true" className="h-1 bg-paper-sunken">
                  <span
                    className="block h-full bg-blue"
                    style={{
                      width: `${(me.pointBalance / DRAW_COST) * 100}%`,
                    }}
                  />
                </span>
              )}
              <p className="tabular m-0 text-[0.8125rem] font-[600] text-ink-muted">
                {drawsLeft > 0
                  ? t("mypage.hub.drawsHint", {
                      cost: DRAW_COST,
                      count: drawsLeft,
                    })
                  : t("mypage.hub.progress", {
                      amount: formatNumber(me.pointBalance),
                      cost: DRAW_COST,
                    })}
                {lastDraw && PRIZES[lastDraw.item] && (
                  <>
                    {" · "}
                    {t("mypage.hub.lastDraw", {
                      prize: t(`mypage.prizes.names.${lastDraw.item}`),
                    })}
                  </>
                )}
              </p>
            </div>
          </HubCard>

          <div className="grid grid-cols-2 gap-3">
            <HubCard to="/mypage/coupons" title={t("mypage.coupons.metaTitle")}>
              {validCoupons === undefined ? (
                <LoadFailed />
              ) : (
                <Figure
                  value={t("mypage.hub.coupons", { count: validCoupons })}
                  hint={t("mypage.hub.couponsHint")}
                />
              )}
            </HubCard>

            <HubCard to="/mypage/ranking" title={t("mypage.ranking.metaTitle")}>
              {ranking === null ? (
                <LoadFailed />
              ) : ranking.me ? (
                <Figure
                  value={t("mypage.ranking.rank", { rank: ranking.me.rank })}
                  hint={t("mypage.hub.rankHint", {
                    count: formatNumber(ranking.memberCount),
                    amount: formatNumber(ranking.me.totalEarnedPoints),
                  })}
                />
              ) : (
                <Hint>{t("mypage.hub.unranked")}</Hint>
              )}
            </HubCard>
          </div>
        </div>
      </div>
    </>
  );
}

const EARN_WAYS = ["attend", "lead", "event"] as const;

/** Shown while the history is short, so new members learn how points come in. */
function EarnGuide() {
  const { t } = useI18n();
  return (
    <div className="grid gap-2">
      <h3 className="m-0 text-[0.75rem] font-[750] text-ink-subtle">
        {t("mypage.hub.earnTitle")}
      </h3>
      <ul className="m-0 grid list-none gap-0.5 p-0">
        {EARN_WAYS.map((way) => (
          <li
            key={way}
            className="grid gap-0.5 bg-paper px-3.5 py-2.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-4"
          >
            <span className="text-[0.875rem] font-[750]">
              {t(`mypage.hub.earn.${way}.title`)}
            </span>
            <span className="text-[0.8125rem] text-ink-muted">
              {t(`mypage.hub.earn.${way}.how`)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HubCard({
  to,
  title,
  className,
  children,
}: {
  to: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "group/card relative flex flex-col gap-4 bg-paper-raised p-5 transition-shadow hover:shadow-[inset_0_0_0_1.5px_var(--ink)] has-focus-visible:outline-3 has-focus-visible:outline-blue sm:p-6",
        className
      )}
    >
      <h2 className="m-0 flex items-center justify-between gap-3 text-[1.0625rem] font-[800] tracking-[-0.02em]">
        <Link to={to} className="outline-none after:absolute after:inset-0">
          {title}
        </Link>
        <ArrowRightIcon
          aria-hidden="true"
          className="size-4.5 text-ink-subtle transition-transform group-hover/card:translate-x-0.5 group-hover/card:text-ink"
        />
      </h2>
      {children}
    </section>
  );
}

/** A stat tile's number, kept at the bottom of a stretched card. */
function Figure({ value, hint }: { value: string; hint: string }) {
  return (
    <p className="m-0 mt-auto grid gap-1.5">
      <span className="tabular text-[1.75rem] leading-none font-[820] tracking-[-0.04em]">
        {value}
      </span>
      <span className="text-[0.8125rem] leading-snug font-[600] text-ink-muted">
        {hint}
      </span>
    </p>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 text-[0.875rem] leading-relaxed text-ink-muted">
      {children}
    </p>
  );
}

function LoadFailed() {
  const { t } = useI18n();
  return <Hint>{t("mypage.hub.loadFailed")}</Hint>;
}
