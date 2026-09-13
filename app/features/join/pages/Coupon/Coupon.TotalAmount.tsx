import { useI18n } from "@app/i18n";
import { CLUB_DUES } from "@join/constants/constants";
import type { Coupon, TotalAmountProps } from "./Coupon.Types";

const totalAmount = (coupons: Coupon[], selectedCoupons: number[]) =>
  coupons.reduce((sum, coupon) => {
    if (selectedCoupons.includes(coupon.issuedCouponId)) {
      return sum + coupon.discountAmount;
    }
    return sum;
  }, 0);

export const TotalAmount = ({ coupons, selectedCoupons }: TotalAmountProps) => {
  const { t } = useI18n();
  const total = totalAmount(coupons, selectedCoupons);

  return (
    <div className="mt-2 p-2 text-center">
      <span className="font-bold text-5xl">
        {Math.min(total, CLUB_DUES).toLocaleString()}
      </span>
      <span className="text-lg">{t("join.payment.currencyUnit")}</span>
    </div>
  );
};
