import axios from "axios";
import { mypageApiClient } from "./client";

export async function checkAuth(): Promise<boolean> {
  try {
    const { data } = await mypageApiClient.get<{ status: string }>(
      "/auth/check",
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    if (data.status === "COMPLETED") {
      return true;
    }

    console.log("로그인 실패 상태:", data.status); // PENDING
    return false;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(
        `인증 확인 실패: ${err.response?.status} ${err.response?.statusText}`
      );
    } else {
      console.error("인증 확인 실패:", err);
    }
    return false;
  }
}
