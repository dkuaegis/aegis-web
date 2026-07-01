import axios from "axios";
import type { DrawResponse } from "../model/Draw";
import { showError } from "../utils/alert";
import { mypageApiClient } from "./client";

export async function drawPoint(): Promise<DrawResponse> {
  try {
    const { data } = await mypageApiClient.post<DrawResponse>(
      "/point-shop/draw",
      undefined,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 400) {
      showError("잔액이 부족합니다.");
      throw new Error("잔액 부족");
    }
    console.error("포인트 뽑기 실행 실패:", e);
    throw e;
  }
}
