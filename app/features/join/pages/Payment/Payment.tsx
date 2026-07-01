import { Button } from "@join/components/ui/button";
import NavigationButtons from "@join/components/ui/custom/navigationButton";
import { cn } from "@join/lib/utils";
import { Analytics } from "@join/service/analytics";
import { useAuthStore } from "@join/stores/authStore";
import { Label } from "@radix-ui/react-label";
import { AnimatePresence, motion } from "framer-motion";
import React, { Suspense, useEffect, useState } from "react";
import Coupon from "../Coupon/Coupon";
import AdminInfoDrawer from "./Payment.AdminInfoDrawer";
import PaymentAmount from "./Payment.Amount";
import Information from "./Payment.Information";
import NoticeModal from "./Payment.NoticeModal";
import { usePaymentPolling } from "./usePaymentPolling";

const Complete = React.lazy(
  () => import("@join/components/ui/custom/complete")
);

const modalVariants = {
  // 초기 상태 (화면 아래, 숨김)
  hidden: {
    y: "60%",
    opacity: 0,
  },
  // 보이는 상태
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      // 자식 요소들의 애니메이션을 부모보다 0.2초 늦게 시작
      staggerChildren: 0,
      when: "beforeChildren", // 이 속성은 자식보다 부모 애니메이션을 먼저 시작하도록 보장
    },
  },
  // 사라지는 상태
  exit: {
    y: "60%",
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
} as const;

const Payment = () => {
  const { isValid, finalPrice, status, refreshFinalPrice } =
    usePaymentPolling();
  const [currentView, setCurrentView] = useState<"coupon" | "payment">(
    "payment"
  );
  const [showNoticeModal, setShowNoticeModal] = useState(true);
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
      {/* 송금 안내 모달 */}
      {!isValid && (
        <NoticeModal open={showNoticeModal} onOpenChange={setShowNoticeModal} />
      )}

      <div className={cn("line-breaks space-y-8")}>
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
      <AnimatePresence>
        {!isValid && currentView === "coupon" && (
          <motion.div
            className="absolute top-0 left-0 z-10 h-full w-full bg-white"
            variants={modalVariants} // variants 속성 사용
            initial="hidden" // "hidden"이라는 이름의 variant를 초기 상태로
            animate="visible" // "visible"이라는 이름의 variant를 애니메이션 상태로
            exit="exit" // "exit"라는 이름의 variant를 종료 상태로
          >
            <Coupon
              onClose={() => {
                Analytics.safeTrack("Coupon_Apply_And_Fetch_And_Close", {
                  category: "Coupon",
                });
                refreshFinalPrice();
                setCurrentView("payment");
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payment;
