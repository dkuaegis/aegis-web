import { Analytics } from "@join/service/analytics";
import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { submitAndFetchCouponCode, submitCoupon } from "./Coupon.Api";
import { CouponList } from "./Coupon.CouponList";
import type { Coupon as CouponType } from "./Coupon.Types";

interface CouponProps {
  onClose: () => void;
  coupons: CouponType[];
  onCouponsChange: (coupons: CouponType[]) => void;
}

const Coupon = ({ onClose, coupons, onCouponsChange }: CouponProps) => {
  const [selectedCoupons, setSelectedCoupons] = useState<number[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApply = async () => {
    if (selectedCoupons.length === 0) {
      toast.error("적용할 쿠폰을 선택해주세요");
      return;
    }

    setIsSubmitting(true);
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
      onClose();
    } catch (error: unknown) {
      console.error("제출 중 오류 발생:", error);
      toast.error(
        error instanceof Error ? error.message : "쿠폰을 적용하지 못했습니다."
      );
      Analytics.safeTrack("Coupon_Apply_Failed", {
        category: "Payment",
        selected_count: selectedCoupons.length,
        error_message:
          error instanceof Error ? error.message : String(error ?? ""),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const code = couponCode.trim();
    if (!code) {
      toast.error("쿠폰 코드를 입력해주세요");
      return;
    }
    setIsSubmitting(true);
    try {
      onCouponsChange(await submitAndFetchCouponCode(code));
      setCouponCode("");
      toast.success("쿠폰을 등록했습니다.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "쿠폰을 등록하지 못했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form className="join-coupon-code-form" onSubmit={handleCodeSubmit}>
        <input
          aria-label="쿠폰 코드"
          placeholder="쿠폰 코드 입력"
          value={couponCode}
          onChange={(event) => setCouponCode(event.target.value)}
        />
        <button
          className="join-payment-button is-dark"
          type="submit"
          disabled={isSubmitting}
        >
          등록
        </button>
      </form>
      <fieldset className="join-coupon-list" disabled={isSubmitting}>
        <legend className="sr-only">사용 가능한 쿠폰</legend>
        {coupons.length === 0 ? (
          <p className="join-coupon-empty">사용 가능한 쿠폰이 없습니다.</p>
        ) : (
          <CouponList
            coupons={coupons}
            selectedCoupons={selectedCoupons}
            setSelectedCoupons={setSelectedCoupons}
          />
        )}
      </fieldset>
      <button
        className="join-payment-button is-full"
        type="button"
        disabled={isSubmitting}
        onClick={handleApply}
      >
        {isSubmitting ? "적용 중..." : "선택한 쿠폰 적용"}
      </button>
    </div>
  );
};

export default Coupon;
