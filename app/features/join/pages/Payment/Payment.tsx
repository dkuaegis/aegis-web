import "./Payment.css";
import NavigationButtons from "@join/components/ui/custom/navigationButton";
import { Analytics } from "@join/service/analytics";
import { useAuthStore } from "@join/stores/authStore";
import { ChevronRight } from "lucide-react";
import React, { Suspense, useEffect, useState } from "react";
import Coupon from "../Coupon/Coupon";
import { fetchCoupon } from "../Coupon/Coupon.Api";
import type { Coupon as CouponType } from "../Coupon/Coupon.Types";
import AdminInfoDrawer from "./Payment.AdminInfoDrawer";
import PaymentAmount from "./Payment.Amount";
import PaymentDialog from "./Payment.Dialog";
import Information from "./Payment.Information";
import { usePaymentPolling } from "./usePaymentPolling";

const Complete = React.lazy(
  () => import("@join/components/ui/custom/complete")
);

const Payment = () => {
  const { isValid, finalPrice, status, refreshFinalPrice } =
    usePaymentPolling();
  const [currentView, setCurrentView] = useState<"coupon" | "payment">(
    "payment"
  );
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const completeRegistration = useAuthStore(
    (state) => state.completeRegistration
  );

  useEffect(() => {
    let active = true;
    const loadCoupons = async () => {
      try {
        Analytics.safeTrack("Coupon_Fetch_Start", { category: "Payment" });
        const data = await fetchCoupon();
        if (active) setCoupons(data);
        Analytics.safeTrack("Coupon_Fetch_Success", {
          category: "Payment",
          coupon_count: data.length,
        });
      } catch (error) {
        console.error("쿠폰 불러오는데 오류 발생:", error);
        Analytics.safeTrack("Coupon_Fetch_Failed", {
          category: "Payment",
          error_message: error instanceof Error ? error.message : String(error),
        });
      }
    };
    void loadCoupons();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (status === "error") {
      Analytics.safeTrack("Payment_View_Error", { category: "Payment" });
    }
  }, [status]);

  if (status === "loading") {
    return null;
  }

  if (status === "error") {
    return (
      <div className="text-center text-red-500">
        <p className="my-7">
          결제 상태를 불러오는 데 실패했습니다. 나중에 다시 시도해주세요.
        </p>
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
                onClick={() => {
                  Analytics.safeTrack("Payment_Open_Coupon_Click", {
                    category: "Payment",
                  });
                  setCurrentView("coupon");
                }}
              >
                <span>할인 쿠폰</span>
                <strong>{coupons.length}장</strong>
                <ChevronRight aria-hidden="true" />
              </button>
              <AdminInfoDrawer />
            </div>
          </div>
        ) : (
          <Suspense>
            <Complete message="납부가 완료됐어요" />
            <NavigationButtons
              disabled={!isValid}
              onClick={() => {
                Analytics.safeTrack("Payment_Complete_Next_Click", {
                  category: "Payment",
                });
                completeRegistration();
              }}
            />
          </Suspense>
        )}
      </div>
      <PaymentDialog
        open={!isValid && currentView === "coupon"}
        onOpenChange={(open) => {
          if (!open) setCurrentView("payment");
        }}
        title="할인 쿠폰"
      >
        <Coupon
          coupons={coupons}
          onCouponsChange={setCoupons}
          onClose={() => {
            Analytics.safeTrack("Coupon_Apply_And_Fetch_And_Close", {
              category: "Coupon",
            });
            void refreshFinalPrice();
            setCurrentView("payment");
          }}
        />
      </PaymentDialog>
    </div>
  );
};

export default Payment;
