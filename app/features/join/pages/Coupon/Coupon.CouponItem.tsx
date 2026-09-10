import type { CouponItemProps } from "./Coupon.Types";

const CouponItem = ({ coupon, isSelected, setSelect }: CouponItemProps) => (
  <label className={`join-coupon-ticket${isSelected ? " is-selected" : ""}`}>
    <input
      type="checkbox"
      checked={isSelected}
      onChange={() => setSelect(coupon.issuedCouponId)}
    />
    <span>
      <strong>{coupon.couponName}</strong>
      <small>{coupon.discountAmount.toLocaleString()}원 할인</small>
    </span>
  </label>
);

export default CouponItem;
