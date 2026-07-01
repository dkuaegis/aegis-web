import type { MyPageInfo } from "../model/MyPageInfo";
import { mypageApiClient } from "./client";

export async function getMyPage(): Promise<MyPageInfo> {
  try {
    const { data } = await mypageApiClient.get<MyPageInfo>("/mypage", {
      headers: { accept: "application/json" },
    });
    return data;
  } catch (e) {
    console.error("마이페이지 조회 실패:", e);
    throw e;
  }
}
