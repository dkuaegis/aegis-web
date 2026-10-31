import { useI18n } from "@app/i18n";
import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import {
  readAppliedCouponIds,
  submitAndFetchCouponCode,
  submitCoupon,
} from "./Coupon.Api";
import { CouponList } from "./Coupon.CouponList";
import type { Coupon as CouponType } from "./Coupon.Types";

interface CouponProps {
  onClose: () => void;
  coupons: CouponType[];
  onCouponsChange: (coupons: CouponType[]) => void;
}

const Coupon = ({ onClose, coupons, onCouponsChange }: CouponProps) => {
  const { t } = useI18n();
  const [appliedCoupons] = useState(() => {
    const validIds = new Set(coupons.map((coupon) => coupon.issuedCouponId));
    return readAppliedCouponIds().filter((id) => validIds.has(id));
  });
  const [selectedCoupons, setSelectedCoupons] = useState(appliedCoupons);
  const [couponCode, setCouponCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApply = async () => {
    // 적용된 쿠폰을 모두 해제하는 경우에는 빈 선택도 보냅니다.
    if (selectedCoupons.length === 0 && appliedCoupons.length === 0) {
      toast.error(t("join.coupon.selectRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      await submitCoupon(selectedCoupons);
      onClose();
    } catch (error: unknown) {
      console.error("제출 중 오류 발생:", error);
      toast.error(
        error instanceof Error ? error.message : t("join.coupon.applyFailure")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const code = couponCode.trim();
    if (!code) {
      toast.error(t("join.coupon.codeRequired"));
      return;
    }
    setIsSubmitting(true);
    try {
      onCouponsChange(await submitAndFetchCouponCode(code));
      setCouponCode("");
      toast.success(t("join.coupon.registerSuccess"));
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t("join.coupon.registerFailure")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form className="join-coupon-code-form" onSubmit={handleCodeSubmit}>
        <input
          aria-label={t("join.coupon.codeInputLabel")}
          placeholder={t("join.coupon.codeInputPlaceholder")}
          value={couponCode}
          onChange={(event) => setCouponCode(event.target.value)}
        />
        <button
          className="join-payment-button is-dark"
          type="submit"
          disabled={isSubmitting}
        >
          {t("join.coupon.register")}
        </button>
      </form>
      <fieldset className="join-coupon-list" disabled={isSubmitting}>
        <legend className="sr-only">{t("join.coupon.listLegend")}</legend>
        {coupons.length === 0 ? (
          <p className="join-coupon-empty">{t("join.coupon.empty")}</p>
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
        {isSubmitting
          ? t("join.coupon.applying")
          : t("join.coupon.applySelected")}
      </button>
    </div>
  );
};

export default Coupon;
