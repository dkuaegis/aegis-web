import {
  drawPointShop,
  getMyDrawHistories,
} from "@app/api/generated/endpoints";
import type { PointShopItem } from "@app/api/generated/model";
import { Balance } from "@app/components/mypage/Balance";
import {
  DRAW_COST,
  PRIZE_CODES,
  PRIZES,
  prizeOdds,
} from "@app/components/mypage/mypage";
import { PrizeThumb } from "@app/components/mypage/PrizeThumb";
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
import { Spinner } from "@app/components/ui/spinner";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { useFetcherResult } from "@app/lib/actions";
import { errorMessage } from "@app/lib/errors";
import { formatDate, formatNumber } from "@app/lib/format";
import { pageTitle } from "@app/lib/title";
import { cn } from "@app/lib/utils";
import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { useFetcher } from "react-router";
import type { Route } from "./+types/shop";
import { Subpage, useMe } from "./layout";

const GachaMachine = lazy(() => import("@app/components/mypage/GachaMachine"));

export function meta() {
  return [{ title: pageTitle(translate("mypage.shop.metaTitle")) }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  return { draws: await getMyDrawHistories({ signal: request.signal }) };
}

export async function clientAction() {
  try {
    const result = await drawPointShop();
    return { ok: true as const, result, message: null };
  } catch (error) {
    return { ok: false as const, result: null, message: errorMessage(error) };
  }
}

interface Won {
  id: number;
  item: PointShopItem;
  remainingBalance: number;
}

export default function Shop({ loaderData }: Route.ComponentProps) {
  const { t } = useI18n();
  const me = useMe();
  const fetcher = useFetcher<typeof clientAction>({ key: "draw" });
  const [landing, setLanding] = useState<Won | null>(null);
  const [shown, setShown] = useState<Won | null>(null);
  const requesting = fetcher.state !== "idle";
  const busy = requesting || (landing !== null && shown === null);
  const affordable = me.pointBalance >= DRAW_COST;
  const failed =
    fetcher.data?.ok === false && !requesting ? fetcher.data.message : null;

  useFetcherResult(fetcher, (data) => {
    if (!data.ok) return;
    setShown(null);
    setLanding({
      id: data.result.drawHistoryId,
      item: data.result.item,
      remainingBalance: data.result.remainingBalance,
    });
  });

  const landingRef = useRef(landing);
  landingRef.current = landing;
  const onSettled = useCallback(() => setShown(landingRef.current), []);

  const draw = () => {
    setShown(null);
    setLanding(null);
    fetcher.submit(null, { method: "post" });
  };

  const drawsLeft = Math.floor(me.pointBalance / DRAW_COST);
  const tally = PRIZE_CODES.map((code) => ({
    code,
    count: loaderData.draws.filter((draw) => draw.item === code).length,
  })).filter((entry) => entry.count > 0);

  return (
    <Subpage title={t("mypage.shop.metaTitle")} balance={false}>
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
                spinning={requesting}
                result={landing ? { id: landing.id, item: landing.item } : null}
                onSettled={onSettled}
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
                onClick={draw}
                className="w-full"
              >
                {busy && <Spinner />}
                {busy
                  ? t("mypage.shop.drawing")
                  : t("mypage.shop.draw", { cost: DRAW_COST })}
              </Button>
              {failed && (
                <p
                  role="alert"
                  className="m-0 text-[0.875rem] font-[650] text-danger"
                >
                  {failed}
                </p>
              )}
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
              {loaderData.draws.map((draw) => (
                <li
                  key={draw.drawHistoryId}
                  className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 bg-paper-raised px-3 py-2"
                >
                  <PrizeThumb code={draw.item} />
                  <PrizeLabel code={draw.item} />
                  <span className="tabular text-[0.8125rem] font-[600] text-ink-subtle">
                    {formatDate(draw.createdAt)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <Dialog
          open={shown !== null}
          onOpenChange={(open) => {
            if (!open) {
              setShown(null);
              setLanding(null);
            }
          }}
        >
          {shown && (
            <DialogContent className="max-w-md text-center">
              <div className="mx-auto grid h-40 w-full max-w-72 place-items-center rounded-media bg-paper-sunken p-5">
                <img
                  src={PRIZES[shown.item].icon}
                  alt=""
                  className="size-full object-contain"
                />
              </div>
              <DialogHeader className="justify-items-center">
                <DialogTitle className="text-[1.5rem]">
                  {t("mypage.shop.resultTitle", {
                    prize: t(`mypage.prizes.names.${shown.item}`),
                  })}
                </DialogTitle>
                <DialogDescription className="text-balance">
                  {t(`mypage.prizes.delivery.${PRIZES[shown.item].delivery}`)}{" "}
                  {t("mypage.shop.remaining", {
                    amount: formatNumber(shown.remainingBalance),
                  })}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="justify-center">
                <DialogClose
                  render={
                    <Button variant="outline">{t("common.close")}</Button>
                  }
                />
                <Button
                  disabled={shown.remainingBalance < DRAW_COST}
                  onClick={draw}
                >
                  {t("mypage.shop.again")}
                </Button>
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
