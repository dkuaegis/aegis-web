import { api } from "@app/lib/api";
import type { DrawHistoryItem } from "../model/DrawMe";

export async function getMyDrawHistory(): Promise<DrawHistoryItem[]> {
  try {
    return await api.get<DrawHistoryItem[]>("/point-shop/draws/me");
  } catch (e) {
    console.error("내 뽑기 이력 조회 실패:", e);
    throw e;
  }
}
