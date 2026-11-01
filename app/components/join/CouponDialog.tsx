import type { IssuedCouponResponse } from "@app/api/generated/model";
import { Button } from "@app/components/ui/button";
import { Checkbox } from "@app/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@app/components/ui/dialog";
import { ErrorText } from "@app/components/ui/field";
import { Input } from "@app/components/ui/input";
import { Spinner } from "@app/components/ui/spinner";
import { useI18n } from "@app/i18n";
import { type ActionResult, useFetcherResult } from "@app/lib/actions";
import { formatNumber } from "@app/lib/format";
import { cn } from "@app/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { useId, useState } from "react";
import { useFetcher } from "react-router";

export type CouponIntent = "redeem" | "apply";

/**
 * The coupon row on the payment step and the dialog it opens: redeem a code,
 * then pick which coupons to put toward the dues.
 */
export function CouponDialog({
  coupons,
  appliedCouponIds,
  onApplied,
}: {
  /** null when the list could not be loaded. */
  coupons: IssuedCouponResponse[] | null;
  /** What the payment holds now. PUT /payments replaces the whole set. */
  appliedCouponIds: number[];
  onApplied: () => void;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [code, setCode] = useState("");
  const fetcher = useFetcher<ActionResult<CouponIntent>>({ key: "coupons" });
  const busy = fetcher.state !== "idle";
  const sending = busy
    ? (fetcher.json as { intent?: CouponIntent } | undefined)?.intent
    : undefined;
  const failed =
    fetcher.data?.ok === false && !busy ? fetcher.data.message : null;
  const listId = useId();

  useFetcherResult(fetcher, (result) => {
    if (!result.ok) return;
    if (result.intent === "redeem") setCode("");
    if (result.intent === "apply") {
      setOpen(false);
      onApplied();
    }
  });

  const send = (intent: CouponIntent, body: object) =>
    fetcher.submit(
      { intent, ...body },
      {
        method: "post",
        action: "/join/payment",
        encType: "application/json",
      }
    );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (busy) return;
        if (next && coupons) {
          // Start from what is applied, keeping only coupons the list shows.
          const valid = new Set(coupons.map((c) => c.issuedCouponId));
          setSelected(appliedCouponIds.filter((id) => valid.has(id)));
        }
        setOpen(next);
      }}
    >
      <DialogTrigger
        disabled={!coupons}
        className="group grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border border-line-strong bg-paper-raised px-5 py-4 text-left transition-colors hover:border-ink disabled:cursor-default disabled:hover:border-line-strong"
      >
        <span className="text-[0.9375rem] font-[700]">
          {t("join.payment.couponDialogTitle")}
        </span>
        <span className="tabular text-[0.9375rem] font-[750]">
          {coupons
            ? t("join.payment.couponCount", { count: coupons.length })
            : t("join.payment.couponFetchFailed")}
        </span>
        <ChevronRightIcon
          aria-hidden="true"
          className="size-4 text-ink-muted transition-transform group-hover:translate-x-0.5"
        />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("join.payment.couponDialogTitle")}</DialogTitle>
        </DialogHeader>

        <form
          className="grid grid-cols-[minmax(0,1fr)_auto] gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            send("redeem", { code: code.trim() });
          }}
        >
          <Input
            aria-label={t("join.coupon.codeInputLabel")}
            placeholder={t("join.coupon.codeInputPlaceholder")}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            autoComplete="off"
          />
          <Button type="submit" variant="ink" disabled={busy || !code.trim()}>
            {t("join.coupon.register")}
          </Button>
        </form>

        <fieldset
          aria-labelledby={listId}
          disabled={busy}
          className="m-0 grid min-w-0 gap-2 border-0 p-0"
        >
          <legend id={listId} className="sr-only">
            {t("join.coupon.listLegend")}
          </legend>
          {coupons?.length ? (
            coupons.map((coupon) => {
              const id = `${listId}-${coupon.issuedCouponId}`;
              const checked = selected.includes(coupon.issuedCouponId);
              return (
                <label
                  key={coupon.issuedCouponId}
                  htmlFor={id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 border px-4 py-3 transition-colors",
                    checked ? "border-ink" : "border-line-strong"
                  )}
                >
                  <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={(next) =>
                      setSelected((current) =>
                        next
                          ? [...current, coupon.issuedCouponId]
                          : current.filter((c) => c !== coupon.issuedCouponId)
                      )
                    }
                  />
                  <span className="grid min-w-0 gap-0.5">
                    <strong className="text-[0.9375rem] font-[750] [overflow-wrap:anywhere]">
                      {coupon.couponName}
                    </strong>
                    <small className="tabular text-[0.8125rem] text-ink-muted">
                      {t("join.coupon.discountAmount", {
                        amount: formatNumber(coupon.discountAmount),
                      })}
                    </small>
                  </span>
                </label>
              );
            })
          ) : (
            <p className="m-0 text-[0.9375rem] text-ink-muted">
              {t("join.coupon.empty")}
            </p>
          )}
        </fieldset>

        <ErrorText role="alert">{failed}</ErrorText>

        <Button
          size="lg"
          // Sending an empty set clears coupons applied before.
          disabled={
            busy || (selected.length === 0 && appliedCouponIds.length === 0)
          }
          onClick={() => send("apply", { issuedCouponIds: selected })}
        >
          {sending === "apply" && <Spinner />}
          {t("join.coupon.applySelected")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
