import { useI18n } from "@app/i18n";
import type { CouponItemProps } from "./Coupon.Types";

const CouponItem = ({ coupon, isSelected, setSelect }: CouponItemProps) => {
  const { t } = useI18n();

  return (
    <label className={`join-coupon-ticket${isSelected ? " is-selected" : ""}`}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => setSelect(coupon.issuedCouponId)}
      />
      <span>
        <strong>{coupon.couponName}</strong>
        <small>
          {t("join.coupon.discountAmount", {
            amount: coupon.discountAmount.toLocaleString(),
          })}
        </small>
      </span>
    </label>
  );
};

export default CouponItem;
