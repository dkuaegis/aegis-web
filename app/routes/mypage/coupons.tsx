import { getMyCoupons, redeemCouponCode } from "@app/api/generated/endpoints";
import { Subpage } from "@app/components/mypage/Subpage";
import { EmptyState } from "@app/components/page/States";
import { Badge } from "@app/components/ui/badge";
import { Button } from "@app/components/ui/button";
import { Field, FieldError, FieldLabel } from "@app/components/ui/field";
import { Input } from "@app/components/ui/input";
import { Spinner } from "@app/components/ui/spinner";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { runAction, useFetcherResult } from "@app/lib/actions";
import { formatDate, formatNumber } from "@app/lib/format";
import { pageTitle } from "@app/lib/title";
import { cn } from "@app/lib/utils";
import { TicketIcon } from "lucide-react";
import { useState } from "react";
import { useFetcher } from "react-router";
import type { Route } from "./+types/coupons";

export function meta() {
  return [{ title: pageTitle(translate("mypage.coupons.metaTitle")) }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const coupons = await getMyCoupons({ signal: request.signal });
  // Usable coupons first, newest first within each group.
  coupons.sort(
    (a, b) =>
      Number(b.isValid) - Number(a.isValid) ||
      b.createdAt.localeCompare(a.createdAt)
  );
  return { coupons };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const form = await request.formData();
  const code = String(form.get("code") ?? "").trim();
  return runAction("redeem", () => redeemCouponCode({ code }), {
    success: (coupon) =>
      translate("mypage.coupons.redeemed", { name: coupon.couponName }),
  });
}

export default function Coupons({ loaderData }: Route.ComponentProps) {
  const { t } = useI18n();
  const { coupons } = loaderData;

  return (
    <Subpage title={t("mypage.coupons.metaTitle")}>
      <div className="grid gap-8">
        <RedeemForm />

        <section aria-labelledby="my-coupons" className="grid gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2
              id="my-coupons"
              className="m-0 text-[0.875rem] font-[750] text-ink-muted"
            >
              {t("mypage.coupons.metaTitle")}
            </h2>
            <p className="m-0 text-[0.8125rem] text-ink-muted">
              {t("mypage.coupons.usage")}
            </p>
          </div>
          {coupons.length === 0 ? (
            <EmptyState
              title={t("mypage.coupons.empty")}
              description={t("mypage.coupons.emptyDescription")}
            />
          ) : (
            <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
              {coupons.map((coupon) => (
                <li
                  key={coupon.issuedCouponId}
                  className={cn(
                    "relative grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-3 p-5",
                    // The notches read as a ticket stub.
                    "before:absolute before:top-1/2 before:-left-2 before:size-4 before:-translate-y-1/2 before:rounded-full before:bg-paper",
                    "after:absolute after:top-1/2 after:-right-2 after:size-4 after:-translate-y-1/2 after:rounded-full after:bg-paper",
                    coupon.isValid
                      ? "bg-paper-raised"
                      : "bg-paper-sunken text-ink-subtle"
                  )}
                >
                  <p className="tabular m-0 text-[1.625rem] leading-none font-[820] tracking-[-0.04em]">
                    {t("mypage.coupons.discount", {
                      amount: formatNumber(coupon.discountAmount),
                    })}
                  </p>
                  <Badge tone={coupon.isValid ? "info" : "neutral"}>
                    {coupon.isValid
                      ? t("mypage.coupons.valid")
                      : t("mypage.coupons.used")}
                  </Badge>
                  <p className="col-span-2 m-0 flex items-center justify-between gap-3 border-t border-dashed border-line-strong pt-3 text-[0.875rem] font-[650]">
                    <span className="min-w-0 truncate">
                      {coupon.couponName}
                    </span>
                    <span className="tabular shrink-0 text-[0.75rem] font-[560] text-ink-subtle">
                      {t("mypage.coupons.issuedAt", {
                        date: formatDate(coupon.createdAt),
                      })}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Subpage>
  );
}

function RedeemForm() {
  const { t } = useI18n();
  const fetcher = useFetcher<typeof clientAction>();
  const [code, setCode] = useState("");
  const [touched, setTouched] = useState(false);
  const busy = fetcher.state !== "idle";
  const empty = !code.trim();
  const error =
    touched && empty
      ? t("mypage.coupons.redeemRequired")
      : fetcher.data?.ok === false && !busy
        ? fetcher.data.message
        : null;

  useFetcherResult(fetcher, (result) => {
    if (!result.ok) return;
    setCode("");
    setTouched(false);
  });

  return (
    <fetcher.Form
      method="post"
      noValidate
      onSubmit={(event) => {
        setTouched(true);
        if (empty) event.preventDefault();
      }}
      className="grid gap-4 bg-paper-raised p-5 sm:p-6"
    >
      <h2 className="m-0 flex items-center gap-2 text-[1.125rem] font-[800] tracking-[-0.02em]">
        <TicketIcon aria-hidden="true" className="size-5" />
        {t("mypage.coupons.redeemTitle")}
      </h2>
      <Field invalid={Boolean(error)}>
        <FieldLabel className="sr-only">
          {t("mypage.coupons.redeemLabel")}
        </FieldLabel>
        <div className="flex gap-2">
          <Input
            name="code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder={t("mypage.coupons.redeemPlaceholder")}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            className="font-[650] tracking-[0.04em]"
          />
          <Button type="submit" variant="ink" disabled={busy}>
            {busy && <Spinner />}
            {t("mypage.coupons.redeem")}
          </Button>
        </div>
        <FieldError>{error}</FieldError>
      </Field>
    </fetcher.Form>
  );
}
