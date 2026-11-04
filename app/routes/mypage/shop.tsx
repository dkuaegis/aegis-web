import {
  drawPointShop,
  getMyDrawHistories,
} from "@app/api/generated/endpoints";
import type {
  PointShopDrawResponse,
  PointShopItem,
} from "@app/api/generated/model";
import { Balance } from "@app/components/mypage/Balance";
import {
  DRAW_COST,
  PRIZE_CODES,
  PRIZES,
  prizeOdds,
} from "@app/components/mypage/mypage";
import { PrizeThumb } from "@app/components/mypage/PrizeThumb";
import { Subpage } from "@app/components/mypage/Subpage";
import { useMe } from "@app/components/mypage/useMe";
import { EmptyState } from "@app/components/page/States";
import { Button } from "@app/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@app/components/ui/dialog";
import { ErrorText } from "@app/components/ui/field";
import { Spinner } from "@app/components/ui/spinner";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { runAction, useFetcherResult } from "@app/lib/actions";
import { formatDate } from "@app/lib/format";
import { pageTitle } from "@app/lib/title";
import { cn } from "@app/lib/utils";
import { lazy, Suspense, useState } from "react";
import { useFetcher } from "react-router";
import type { Route } from "./+types/shop";

const GachaMachine = lazy(() => import("@app/components/mypage/GachaMachine"));

export function meta() {
  return [{ title: pageTitle(translate("mypage.shop.metaTitle")) }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return { draws: await getMyDrawHistories({ signal: request.signal }) };
}

export async function clientAction() {
  return runAction("draw", () => drawPointShop());
}

/**
 * Where a draw stands. `requesting` is set by the click itself rather than
 * read from the fetcher, whose state arrives in a later render: a double click
 * would otherwise charge twice.
 */
type Draw =
  | { phase: "idle" }
  | { phase: "requesting" }
  | { phase: "landing"; won: PointShopDrawResponse }
  | { phase: "shown"; won: PointShopDrawResponse };

export default function Shop({ loaderData }: Route.ComponentProps) {
  const { t } = useI18n();
  const me = useMe();
  const fetcher = useFetcher<typeof clientAction>();
  const [draw, setDraw] = useState<Draw>({ phase: "idle" });
  const busy = draw.phase === "requesting" || draw.phase === "landing";
  const affordable = me.pointBalance >= DRAW_COST;
  const failed =
    draw.phase === "idle" && fetcher.data?.ok === false
      ? fetcher.data.message
      : null;

  useFetcherResult(fetcher, (result) =>
    setDraw(
      result.ok ? { phase: "landing", won: result.data } : { phase: "idle" }
    )
  );

  const settle = () =>
    setDraw((current) =>
      current.phase === "landing" ? { ...current, phase: "shown" } : current
    );

  const startDraw = () => {
    setDraw({ phase: "requesting" });
    fetcher.submit(null, { method: "post" });
  };

  const drawsLeft = Math.floor(me.pointBalance / DRAW_COST);
  const tally = PRIZE_CODES.map((code) => ({
    code,
    count: loaderData.draws.filter((entry) => entry.item === code).length,
  })).filter((entry) => entry.count > 0);

  return (
    <Subpage title={t("mypage.shop.metaTitle")}>
      <div className="grid gap-12">
        <section
          aria-labelledby="shop-title"
          className="grid bg-paper-raised md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
        >
          <div
            role="img"
            aria-label={t("mypage.shop.machineLabel")}
            className="relative aspect-square w-full bg-[radial-gradient(ellipse_60%_45%_at_50%_62%,var(--paper-sunken),transparent_70%)] md:aspect-auto md:min-h-[34rem]"
          >
            <Suspense fallback={null}>
              <GachaMachine
                spinning={draw.phase === "requesting"}
                result={"won" in draw ? draw.won : null}
                onSettled={settle}
              />
            </Suspense>
          </div>

          <div className="grid content-start gap-6 p-5 sm:p-8">
            <div className="grid gap-2">
              <h2 id="shop-title" className="text-title m-0">
                {t("mypage.shop.title")}
              </h2>
              <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t("mypage.shop.description", { cost: DRAW_COST })}
              </p>
            </div>

            <div className="grid gap-3">
              <div className="flex items-end justify-between gap-4">
                <Balance amount={me.pointBalance} />
                <span className="pb-0.5 text-[0.875rem] font-[700] text-ink-muted">
                  {affordable
                    ? t("mypage.shop.drawsLeft", { count: drawsLeft })
                    : t("mypage.shop.needMore", {
                        amount: DRAW_COST - me.pointBalance,
                      })}
                </span>
              </div>
              <Button
                size="lg"
                disabled={busy || !affordable}
                onClick={startDraw}
                className="w-full"
              >
                {busy && <Spinner />}
                {busy
                  ? t("mypage.shop.drawing")
                  : t("mypage.shop.draw", { cost: DRAW_COST })}
              </Button>
              <ErrorText role="alert">{failed}</ErrorText>
            </div>

            <ul
              aria-label={t("mypage.shop.oddsTitle")}
              className="m-0 grid list-none gap-0.5 p-0"
            >
              {PRIZE_CODES.map((code) => (
                <li
                  key={code}
                  className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 bg-paper px-2.5 py-2"
                >
                  <PrizeThumb code={code} />
                  <span className="grid min-w-0 gap-0.5">
                    <PrizeLabel code={code} />
                    <span className="text-[0.75rem] leading-snug text-ink-muted">
                      {t(`mypage.prizes.delivery.${PRIZES[code].delivery}`)}
                    </span>
                  </span>
                  <span className="tabular pr-1 text-[0.9375rem] font-[800]">
                    {prizeOdds(code)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="draws"
          aria-labelledby="draws-title"
          className="grid scroll-mt-[calc(var(--header-height)+1.5rem)] gap-4"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 id="draws-title" className="text-subtitle m-0">
              {t("mypage.draws.title")}
            </h2>
            {tally.length > 0 && (
              <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-[0.8125rem] font-[700] text-ink-muted">
                {tally.map(({ code, count }) => (
                  <li key={code} className="flex items-center gap-1.5">
                    <PrizeLabel code={code} plain />
                    <span className="tabular text-ink">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {loaderData.draws.length === 0 ? (
            <EmptyState
              title={t("mypage.draws.empty")}
              description={t("mypage.draws.emptyDescription", {
                cost: DRAW_COST,
              })}
            />
          ) : (
            <ol className="m-0 grid list-none gap-0.5 p-0 lg:grid-cols-2 lg:gap-x-3">
              {loaderData.draws.map((entry) => (
                <li
                  key={entry.drawHistoryId}
                  className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 bg-paper-raised px-3 py-2"
                >
                  <PrizeThumb code={entry.item} />
                  <PrizeLabel code={entry.item} />
                  <span className="tabular text-[0.8125rem] font-[600] text-ink-subtle">
                    {formatDate(entry.createdAt)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <Dialog
          open={draw.phase === "shown"}
          onOpenChange={(open) => {
            if (!open) setDraw({ phase: "idle" });
          }}
        >
          {draw.phase === "shown" && (
            <DialogContent
              className="max-w-md text-center"
              showCloseButton={false}
            >
              <div className="h-40 rounded-media bg-paper-sunken p-5">
                <img
                  src={PRIZES[draw.won.item].icon}
                  alt=""
                  className="size-full object-contain"
                />
              </div>
              <DialogHeader className="justify-items-center pr-0">
                <DialogTitle className="text-[1.5rem]">
                  {t("mypage.shop.resultTitle", {
                    prize: t(`mypage.prizes.names.${draw.won.item}`),
                  })}
                </DialogTitle>
                <DialogDescription className="text-balance">
                  {t(
                    `mypage.prizes.delivery.${PRIZES[draw.won.item].delivery}`
                  )}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose
                  render={
                    <Button variant="outline" className="sm:flex-1">
                      {t("common.close")}
                    </Button>
                  }
                />
                {draw.won.remainingBalance >= DRAW_COST && (
                  <Button className="sm:flex-1" onClick={startDraw}>
                    {t("mypage.shop.again")}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </Subpage>
  );
}

/** The ball colour in the machine marks the prize, like a category. */
function PrizeLabel({
  code,
  plain = false,
}: {
  code: PointShopItem;
  plain?: boolean;
}) {
  const { t } = useI18n();
  const prize = PRIZES[code];
  return (
    <span
      className={cn(
        "flex min-w-0 items-center gap-2",
        !plain && "text-[0.9375rem] font-[750]"
      )}
    >
      {prize && (
        <span
          aria-hidden="true"
          className="size-2.5 shrink-0"
          style={{ background: prize.color }}
        />
      )}
      <span className="truncate">
        {prize ? t(`mypage.prizes.names.${code}`) : code}
      </span>
    </span>
  );
}
