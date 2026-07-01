import type * as React from "react";

export interface Coupon {
  issuedCouponId: number;
  discountAmount: number;
  couponName: string;
}

export interface CouponItemProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  coupon: Coupon;
  isSelected: boolean;
  setSelect: (id: number) => void;
}

export interface CouponListProps {
  coupons: Coupon[];
  selectedCoupons: number[];
  setSelectedCoupons: (value: React.SetStateAction<number[]>) => void;
}

export interface TotalAmountProps {
  coupons: Coupon[];
  selectedCoupons: number[];
}
