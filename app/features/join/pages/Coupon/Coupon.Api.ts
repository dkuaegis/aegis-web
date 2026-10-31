import { api } from "@app/lib/api";
import type { Coupon } from "./Coupon.Types";

export const fetchCoupon = async (): Promise<Coupon[]> => {
  return api.get<Coupon[]>("/coupons/me/valid");
};

// PUT /payments replaces the whole coupon set, but the server never says which
// coupons are applied. Remember the last set so reopening the dialog starts
// from it instead of silently dropping coupons that were applied before.
const APPLIED_COUPONS_STORAGE_KEY = "aegis.join.applied-coupons";

export function readAppliedCouponIds(): number[] {
  try {
    const value: unknown = JSON.parse(
      window.sessionStorage.getItem(APPLIED_COUPONS_STORAGE_KEY) ?? "[]"
    );
    return Array.isArray(value) ? value.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

export const submitCoupon = async (selectedCoupons: number[]) => {
  await api.put("/payments", { issuedCouponIds: selectedCoupons });
  try {
    window.sessionStorage.setItem(
      APPLIED_COUPONS_STORAGE_KEY,
      JSON.stringify(selectedCoupons)
    );
  } catch {
    // 저장하지 못해도 적용 결과는 서버에 반영되었습니다.
  }
};

export const submitAndFetchCouponCode = async (
  couponCode: string
): Promise<Coupon[]> => {
  const payload = { code: couponCode };

  await api.post("/coupons/code", payload);

  return fetchCoupon();
};
