import { api } from "@app/lib/api";
import type { Coupon } from "./Coupon.Types";

export const fetchCoupon = async (): Promise<Coupon[]> => {
  return api.get<Coupon[]>("/coupons/me/valid");
};

export const submitCoupon = async (selectedCoupons: number[]) => {
  const payload = { issuedCouponIds: selectedCoupons };
  if (selectedCoupons.length === 0) {
    return;
  }

  await api.put("/payments", payload);
};

export const submitAndFetchCouponCode = async (
  couponCode: string
): Promise<Coupon[]> => {
  const payload = { code: couponCode };

  await api.post("/coupons/code", payload);

  return fetchCoupon();
};
