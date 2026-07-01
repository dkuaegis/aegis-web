import type { DrawHistoryItem } from "../model/DrawMe";
import { mypageApiClient } from "./client";

export async function getMyDrawHistory(): Promise<DrawHistoryItem[]> {
  try {
    const { data } = await mypageApiClient.get<DrawHistoryItem[]>(
      "/point-shop/draws/me",
      { headers: { accept: "application/json" } }
    );
    return data;
  } catch (e) {
    console.error("내 뽑기 이력 조회 실패:", e);
    throw e;
  }
}
