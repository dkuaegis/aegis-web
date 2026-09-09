import { Button } from "@join/components/ui/button";
import NavigationButtons from "@join/components/ui/custom/navigationButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@join/components/ui/dialog";
import { Analytics } from "@join/service/analytics";
import { useAuthStore } from "@join/stores/authStore";
import { Label } from "@radix-ui/react-label";
import React, { Suspense, useEffect, useState } from "react";
import Coupon from "../Coupon/Coupon";
import AdminInfoDrawer from "./Payment.AdminInfoDrawer";
import PaymentAmount from "./Payment.Amount";
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
  const completeRegistration = useAuthStore(
    (state) => state.completeRegistration
  );

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
          <>
            <Label className="text-xl">납부 금액</Label>
            <PaymentAmount amount={finalPrice} />
            <Information />
            <Button
              size="lg"
              className="w-full items-center"
              variant="default"
              onClick={() => {
                Analytics.safeTrack("Payment_Open_Coupon_Click", {
                  category: "Payment",
                });
                setCurrentView("coupon");
              }}
            >
              쿠폰 적용하기
            </Button>
            <AdminInfoDrawer />
          </>
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
      <Dialog
        open={!isValid && currentView === "coupon"}
        onOpenChange={(open) => {
          if (!open) setCurrentView("payment");
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto border-white/30 bg-white p-0 shadow-2xl sm:max-w-[560px]">
          <DialogHeader className="border-b px-6 py-5 text-left">
            <DialogTitle className="text-xl">할인 쿠폰</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <Coupon
              onClose={() => {
                Analytics.safeTrack("Coupon_Apply_And_Fetch_And_Close", {
                  category: "Coupon",
                });
                refreshFinalPrice();
                setCurrentView("payment");
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payment;
