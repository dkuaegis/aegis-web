import { api } from "@app/lib/api";
import type { MyPageInfo } from "../model/MyPageInfo";

export async function getMyPage(): Promise<MyPageInfo> {
  try {
    return await api.get<MyPageInfo>("/mypage");
  } catch (e) {
    console.error("마이페이지 조회 실패:", e);
    throw e;
  }
}
