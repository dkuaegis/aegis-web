import {
  getMyValidCoupons,
  redeemCouponCode,
  updatePayment,
} from "@app/api/generated/endpoints";
import {
  CouponDialog,
  type CouponIntent,
  rememberAppliedCoupons,
} from "@app/components/join/CouponDialog";
import { StepActions, stepButtonClassName } from "@app/components/join/Funnel";
import { usePaymentPolling } from "@app/components/join/usePaymentPolling";
import { RetryButton } from "@app/components/page/States";
import { Period } from "@app/components/site/Wordmark";
import { Button } from "@app/components/ui/button";
import { ErrorText } from "@app/components/ui/field";
import { Spinner } from "@app/components/ui/spinner";
import { toast } from "@app/components/ui/toast";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { type ActionResult, runAction } from "@app/lib/actions";
import { formatNumber } from "@app/lib/format";
import { invalidateSession } from "@app/lib/session";
import { CheckIcon, ChevronRightIcon, CopyIcon } from "lucide-react";
import { useId, useState } from "react";
import { useNavigate, useRevalidator } from "react-router";
import type { Route } from "./+types/payment";

/** The step still works without coupons, so a failed list is not fatal. */
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  try {
    return { coupons: await getMyValidCoupons({ signal: request.signal }) };
  } catch (error) {
    if (request.signal.aborted) throw error;
    console.error(error);
    return { coupons: null };
  }
}

type CouponRequest =
  | { intent: "redeem"; code: string }
  | { intent: "apply"; issuedCouponIds: number[] };

export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<ActionResult<CouponIntent>> {
  const body = (await request.json()) as CouponRequest;
  if (body.intent === "redeem") {
    return runAction("redeem", () => redeemCouponCode({ code: body.code }), {
      success: translate("join.coupon.registerSuccess"),
    });
  }
  return runAction("apply", async () => {
    await updatePayment({ issuedCouponIds: body.issuedCouponIds });
    rememberAppliedCoupons(body.issuedCouponIds);
  });
}

export default function Payment({ loaderData }: Route.ComponentProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const { status, finalPrice, refreshFinalPrice, retry } = usePaymentPolling();

  if (status === "loading") {
    return (
      <p
        role="status"
        className="m-0 flex items-center gap-2 text-[0.9375rem] text-ink-muted"
      >
        <Spinner />
        {t("common.loading")}
      </p>
    );
  }

  if (status === "error") {
    return (
      <div className="grid justify-items-start gap-5">
        <ErrorText role="alert">{t("join.payment.loadError")}</ErrorText>
        <RetryButton onClick={retry} />
        <Inquiry />
      </div>
    );
  }

  if (status === "paid") {
    return (
      <>
        <div className="grid justify-items-start gap-5">
          <span className="grid size-14 place-items-center bg-blue text-white">
            <CheckIcon aria-hidden="true" strokeWidth={3} className="size-7" />
          </span>
          <h2 className="m-0 text-title">
            {t("join.payment.completeMessage")}
            <Period />
          </h2>
        </div>
        <StepActions step="payment" back={false}>
          <Button
            size="lg"
            onClick={() => {
              // The header and member-only pages should see the new status.
              invalidateSession();
              navigate("/join/complete");
            }}
            className={stepButtonClassName}
          >
            {t("join.actions.next")}
          </Button>
        </StepActions>
      </>
    );
  }

  return (
    <div className="grid gap-6">
      <section
        aria-label={t("join.payment.account.sectionLabel")}
        className="border border-ink bg-paper-raised"
      >
        <div className="grid gap-1 px-5 pt-5 pb-6 sm:px-6">
          <span className="text-[0.875rem] font-[700] text-ink-muted">
            {t("join.payment.amountLabel")}
          </span>
          <strong className="tabular text-[clamp(2.25rem,7vw,3rem)] leading-none font-[800] tracking-[-0.045em]">
            {t("join.payment.amountWithUnit", {
              amount: formatNumber(finalPrice),
            })}
          </strong>
        </div>
        <Account />
      </section>

      <CouponDialog
        coupons={loaderData.coupons}
        onApplied={() => void refreshFinalPrice()}
      />
      {!loaderData.coupons && (
        <div className="-mt-3 flex flex-wrap items-center gap-3">
          <ErrorText role="alert">
            {t("join.payment.couponLoadError")}
          </ErrorText>
          <RetryButton onClick={() => void revalidator.revalidate()} />
        </div>
      )}

      <Inquiry />
    </div>
  );
}

function Account() {
  const { t, language } = useI18n();
  const accountNumber = import.meta.env.VITE_ADMIN_ACCOUNT_NUMBER ?? "";
  const accountHolder =
    language === "ko"
      ? import.meta.env.VITE_ADMIN_ACCOUNT_HOLDER_KO
      : import.meta.env.VITE_ADMIN_ACCOUNT_HOLDER_EN;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      toast.success(t("join.payment.account.copySuccess"));
    } catch {
      toast.error(t("join.payment.account.copyFailure"));
    }
  };

  return (
    <dl className="m-0 grid gap-3 bg-paper-sunken px-5 py-4 text-[0.9375rem] sm:px-6">
      <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_auto] items-center gap-3">
        <dt className="font-[700] text-ink-muted">
          {t("join.payment.account.accountNumber")}
        </dt>
        <dd className="m-0 font-[650] [overflow-wrap:anywhere]">
          {accountNumber}
        </dd>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("join.payment.account.copyAccount")}
          disabled={!accountNumber}
          onClick={copy}
          className="-my-2"
        >
          <CopyIcon aria-hidden="true" />
        </Button>
      </div>
      <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3">
        <dt className="font-[700] text-ink-muted">
          {t("join.payment.account.accountHolder")}
        </dt>
        <dd className="m-0 font-[650]">{accountHolder}</dd>
      </div>
    </dl>
  );
}

/** Who to ask when a transfer does not go through. */
function Inquiry() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const kakao = import.meta.env.VITE_ADMIN_KAKAO;

  return (
    <div className="grid justify-items-start gap-2">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={() => setOpen((current) => !current)}
        className="group inline-flex cursor-pointer items-center gap-1 text-[0.875rem] font-[650] text-ink-muted transition-colors hover:text-ink"
      >
        {t("join.payment.inquiry.title")}
        <ChevronRightIcon
          aria-hidden="true"
          className="size-4 transition-transform group-aria-expanded:rotate-90"
        />
      </button>
      <div
        id={detailsId}
        hidden={!open}
        className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[0.875rem] text-ink-muted"
      >
        <strong className="tabular text-[0.9375rem] font-[750] text-ink">
          {import.meta.env.VITE_ADMIN_PHONE}
        </strong>
        {kakao && (
          <span>
            {t("join.payment.inquiry.kakaoLabel")}: {kakao}
          </span>
        )}
        <span>{t("join.payment.inquiry.hint")}</span>
      </div>
    </div>
  );
}
