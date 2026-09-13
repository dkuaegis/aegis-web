import { api } from "@app/lib/api";
import type { Coupons } from "../model/Coupons";

export async function getCoupons(): Promise<Coupons[]> {
  try {
    return await api.get<Coupons[]>("/coupons/me");
  } catch (e) {
    console.error("발급된 쿠폰 조회 실패:", e);
    throw e;
  }
}
