import {
  getMyValidCoupons,
  getPersonalInfo,
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
import { Button } from "@app/components/ui/button";
import { ErrorText } from "@app/components/ui/field";
import { Spinner } from "@app/components/ui/spinner";
import { toast } from "@app/components/ui/toast";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { type ActionResult, runAction } from "@app/lib/actions";
import { formatNumber } from "@app/lib/format";
import { invalidateSession } from "@app/lib/session";
import { ChevronRightIcon, CopyIcon } from "lucide-react";
import type * as React from "react";
import { useId, useState } from "react";
import { useNavigate, useRevalidator } from "react-router";
import type { Route } from "./+types/payment";

/** The step still works without coupons or the name, so neither is fatal. */
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const { signal } = request;
  const [coupons, depositorName] = await Promise.all([
    optional(getMyValidCoupons({ signal }), signal),
    optional(
      getPersonalInfo({ signal }).then(({ name }) => name),
      signal
    ),
  ]);
  return { coupons, depositorName };
}

async function optional<T>(
  promise: Promise<T>,
  signal: AbortSignal
): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    if (signal.aborted) throw error;
    console.error(error);
    return null;
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
        <PaymentBox
          label={
            <span className="inline-flex items-center gap-2 text-blue">
              <span aria-hidden="true" className="size-2 bg-blue" />
              {t("join.payment.paid.label")}
            </span>
          }
          amount={finalPrice}
        >
          <Status
            title={t("join.payment.paid.title")}
            body={t("join.payment.paid.body")}
          />
        </PaymentBox>
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
      <PaymentBox label={t("join.payment.amountLabel")} amount={finalPrice}>
        <Account depositorName={loaderData.depositorName} />
        <Status
          marker
          title={t("join.payment.waiting.title")}
          body={t("join.payment.waiting.body")}
        />
      </PaymentBox>

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

/** The amount due and what is known about it, in one ink-bordered box. */
function PaymentBox({
  label,
  amount,
  children,
}: {
  label: React.ReactNode;
  amount: number;
  children: React.ReactNode;
}) {
  const { t } = useI18n();

  return (
    <section
      aria-label={t("join.payment.account.sectionLabel")}
      className="border border-ink bg-paper-raised"
    >
      <div className="grid gap-1 px-5 pt-5 pb-6 sm:px-6">
        <span className="text-[0.875rem] font-[700] text-ink-muted">
          {label}
        </span>
        <strong className="tabular text-[clamp(2.25rem,7vw,3rem)] leading-none font-[800] tracking-[-0.045em]">
          {t("join.payment.amountWithUnit", { amount: formatNumber(amount) })}
        </strong>
      </div>
      {children}
    </section>
  );
}

/** Where the payment stands, closing the box. */
function Status({
  title,
  body,
  marker = false,
}: {
  title: string;
  body: string;
  /** A blue square that marks a payment still in progress. */
  marker?: boolean;
}) {
  return (
    <div
      role="status"
      className="flex items-start gap-3 border-t border-line px-5 py-4 sm:px-6"
    >
      {marker && (
        <span
          aria-hidden="true"
          className="mt-[0.45rem] size-2 shrink-0 bg-blue"
        />
      )}
      <p className="m-0 grid gap-1 text-[0.875rem] leading-relaxed">
        <strong className="font-[750]">{title}</strong>
        <span className="text-ink-muted">{body}</span>
      </p>
    </div>
  );
}

function Account({ depositorName }: { depositorName: string | null }) {
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
      {depositorName && (
        <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3">
          <dt className="font-[700] text-ink-muted">
            {t("join.payment.account.depositorName")}
          </dt>
          <dd className="m-0 font-[650]">{depositorName}</dd>
        </div>
      )}
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
