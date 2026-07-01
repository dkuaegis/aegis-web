import AlertBox from "@join/components/ui/custom/alertbox";
import NavigationButtons from "@join/components/ui/custom/navigationButton";
import { Label } from "@join/components/ui/label";
import { Analytics } from "@join/service/analytics";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchCoupon, submitCoupon } from "./Coupon.Api";
import { CouponList } from "./Coupon.CouponList";
import InputCouponCode from "./Coupon.InputCouponCode";
import { TotalAmount } from "./Coupon.TotalAmount";
import type { Coupon as CouponType } from "./Coupon.Types";

interface CouponProps {
  onClose: () => void;
}

const buttonWrapperVariants = {
  // 초기 상태: 화면 아래에 숨겨져 있음
  initial: {
    opacity: 0,
  },
  // 보이는 상태: 제자리로 올라옴
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
      // 부모 애니메이션이 끝날 즈음 시작되도록 약간의 딜레이를 줍니다.
      delay: 0.3,
    },
  },
  // 사라지는 상태: 다시 화면 아래로 내려감
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
} as const;

const Coupon = ({ onClose }: CouponProps) => {
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [selectedCoupons, setSelectedCoupons] = useState<number[]>([]);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        Analytics.safeTrack("Coupon_Fetch_Start", { category: "Payment" });
        const data = await fetchCoupon();
        setCoupons(data);
        Analytics.safeTrack("Coupon_Fetch_Success", {
          category: "Payment",
          coupon_count: data.length,
        });
      } catch (error) {
        console.error("쿠폰 불러오는데 오류 발생:", error);
        Analytics.safeTrack("Coupon_Fetch_Failed", {
          category: "Payment",
          error_message:
            error instanceof Error ? error.message : String(error ?? ""),
        });
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    setIsExiting(true);
    try {
      Analytics.safeTrack("Coupon_Apply_Start", {
        category: "Payment",
        selected_count: selectedCoupons.length,
      });
      await submitCoupon(selectedCoupons);
      Analytics.safeTrack("Coupon_Apply_Success", {
        category: "Payment",
        selected_count: selectedCoupons.length,
      });
    } catch (error: unknown) {
      console.error("제출 중 오류 발생:", error);
      Analytics.safeTrack("Coupon_Apply_Failed", {
        category: "Payment",
        selected_count: selectedCoupons.length,
        error_message:
          error instanceof Error ? error.message : String(error ?? ""),
      });
    } finally {
      onClose();
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-5 rounded-2xl bg-slate-50 p-6">
        <div>
          <Label className="text-xl">할인 금액</Label>
          <TotalAmount coupons={coupons} selectedCoupons={selectedCoupons} />
        </div>
        <InputCouponCode setCoupons={setCoupons} />
      </div>

      <div className="border-t py-4">
        {coupons.length === 0 ? (
          <AlertBox
            icon={<CircleAlert className="h-4 w-4" />}
            title="쿠폰이 없습니다"
            description={["쿠폰을 등록하거나, 결제 페이지로 이동해주세요"]}
          />
        ) : (
          <CouponList
            coupons={coupons}
            selectedCoupons={selectedCoupons}
            setSelectedCoupons={setSelectedCoupons}
          />
        )}
      </div>
      <AnimatePresence onExitComplete={onClose}>
        {!isExiting && (
          <motion.div
            variants={buttonWrapperVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <NavigationButtons
              disabled={false}
              text="쿠폰 적용하기"
              onClick={handleSubmit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Coupon;
