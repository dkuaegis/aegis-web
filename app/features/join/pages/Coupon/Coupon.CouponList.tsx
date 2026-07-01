import CouponItem from "./Coupon.CouponItem";
import type { CouponListProps } from "./Coupon.Types";

export function CouponList({
  coupons,
  selectedCoupons,
  setSelectedCoupons,
}: CouponListProps) {
  const handleCouponSelect = (id: number) => {
    setSelectedCoupons((prev) => {
      if (prev.includes(id)) {
        return prev.filter((couponID) => couponID !== id);
      }
      return [...prev, id];
    });
  };

  return (
    <div className="space-y-3">
      {coupons.map((coupon) => (
        <CouponItem
          key={coupon.issuedCouponId}
          coupon={coupon}
          isSelected={selectedCoupons.includes(coupon.issuedCouponId)}
          setSelect={handleCouponSelect}
        />
      ))}
    </div>
  );
}
