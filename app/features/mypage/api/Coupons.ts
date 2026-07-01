import type { Coupons } from "../model/Coupons";
import { mypageApiClient } from "./client";

export async function getCoupons(): Promise<Coupons[]> {
  try {
    const { data } = await mypageApiClient.get<Coupons[]>("/coupons/me", {
      headers: { accept: "application/json" },
    });
    return data;
  } catch (e) {
    console.error("발급된 쿠폰 조회 실패:", e);
    throw e;
  }
}
