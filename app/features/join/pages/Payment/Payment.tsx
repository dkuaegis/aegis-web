import { useI18n } from "@app/i18n";
import "./Payment.css";
import Complete from "@join/components/ui/custom/complete";
import NavigationButtons from "@join/components/ui/custom/navigationButton";
import { useAuthStore } from "@join/stores/authStore";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Coupon from "../Coupon/Coupon";
import { fetchCoupon } from "../Coupon/Coupon.Api";
import type { Coupon as CouponType } from "../Coupon/Coupon.Types";
import AdminInfoDrawer from "./Payment.AdminInfoDrawer";
import PaymentAmount from "./Payment.Amount";
import PaymentDialog from "./Payment.Dialog";
import Information from "./Payment.Information";
import { usePaymentPolling } from "./usePaymentPolling";

const Payment = () => {
  const { t } = useI18n();
  const { isValid, finalPrice, status, refreshFinalPrice, retry } =
    usePaymentPolling();
  const [currentView, setCurrentView] = useState<"coupon" | "payment">(
    "payment"
  );
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [couponStatus, setCouponStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [couponFetchAttempt, setCouponFetchAttempt] = useState(0);
  const completeRegistration = useAuthStore(
    (state) => state.completeRegistration
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: 재시도 또는 쿠폰 적용 후 조회 횟수가 바뀌면 쿠폰을 다시 조회합니다.
  useEffect(() => {
    let active = true;
    const loadCoupons = async () => {
      setCouponStatus("loading");
      try {
        const data = await fetchCoupon();
        if (active) {
          setCoupons(data);
          setCouponStatus("success");
        }
      } catch (error) {
        if (active) setCouponStatus("error");
        console.error("쿠폰 불러오는데 오류 발생:", error);
      }
    };
    void loadCoupons();
    return () => {
      active = false;
    };
  }, [couponFetchAttempt]);

  const couponFeedback =
    couponStatus === "error" ? (
      <div role="alert" className="space-y-2 text-sm">
        <p className="text-red-600">{t("join.payment.couponLoadError")}</p>
        <button
          type="button"
          className="underline underline-offset-4"
          onClick={() => {
            setCouponStatus("loading");
            setCouponFetchAttempt((attempt) => attempt + 1);
          }}
        >
          {t("common.retry")}
        </button>
      </div>
    ) : (
      <p role="status" className="text-sm">
        {t("join.payment.couponLoading")}
      </p>
    );

  if (status === "loading") {
    return null;
  }

  if (status === "error") {
    return (
      <div className="text-center text-red-500">
        <p className="mt-7 mb-3">{t("join.payment.loadError")}</p>
        <button
          type="button"
          className="mb-7 underline underline-offset-4"
          onClick={retry}
        >
          {t("common.retry")}
        </button>
        <AdminInfoDrawer />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="line-breaks space-y-8">
        {!isValid ? (
          <div className="join-payment-layout">
            <PaymentAmount amount={finalPrice} />
            <Information />
            <div className="join-payment-extras">
              <button
                className="join-payment-coupon-action"
                type="button"
                disabled={couponStatus !== "success"}
                onClick={() => {
                  setCurrentView("coupon");
                }}
              >
                <span>{t("join.payment.couponDialogTitle")}</span>
                <strong>
                  {couponStatus === "success"
                    ? t("join.payment.couponCount", { count: coupons.length })
                    : couponStatus === "error"
                      ? t("join.payment.couponFetchFailed")
                      : t("join.payment.couponFetching")}
                </strong>
                <ChevronRight aria-hidden="true" />
              </button>
              {couponStatus === "error" && couponFeedback}
              <AdminInfoDrawer />
            </div>
          </div>
        ) : (
          <>
            <Complete message={t("join.payment.completeMessage")} />
            <NavigationButtons
              disabled={!isValid}
              onClick={() => {
                completeRegistration();
              }}
            />
          </>
        )}
      </div>
      <PaymentDialog
        open={!isValid && currentView === "coupon"}
        onOpenChange={(open) => {
          if (!open) setCurrentView("payment");
        }}
        title={t("join.payment.couponDialogTitle")}
      >
        {couponStatus === "success" ? (
          <Coupon
            coupons={coupons}
            onCouponsChange={setCoupons}
            onClose={() => {
              void refreshFinalPrice();
              setCouponStatus("loading");
              setCouponFetchAttempt((attempt) => attempt + 1);
              setCurrentView("payment");
            }}
          />
        ) : (
          couponFeedback
        )}
      </PaymentDialog>
    </div>
  );
};

export default Payment;
