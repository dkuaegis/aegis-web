import CouponIcon from "@join/assets/coupon.svg?react";
import ToggleCardWrapper from "@join/components/ui/custom/toggle-card-wrapper";
import type { CouponItemProps } from "./Coupon.Types";

const CouponItem = ({ coupon, isSelected, setSelect }: CouponItemProps) => {
  return (
    <ToggleCardWrapper
      isSelected={isSelected}
      onClick={() => setSelect(coupon.issuedCouponId)}
      className="w-full"
    >
      <div className="flex w-full items-center justify-start space-x-4">
        <CouponIcon className="h-8 w-12" />

        <div className="flex flex-col items-start space-y-1">
          <span className="font-bold text-2xl text-gray-800">
            {coupon.discountAmount.toLocaleString()}원 할인
          </span>
          <span className="text-muted-foreground text-sm">
            {coupon.couponName}
          </span>
        </div>
      </div>
    </ToggleCardWrapper>
  );
};

export default CouponItem;
