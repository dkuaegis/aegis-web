import { ApiError, api } from "@app/lib/api";

export async function checkAuth(): Promise<boolean> {
  try {
    const data = await api.get<{ status: string }>("/auth/check");

    if (data.status === "COMPLETED") {
      return true;
    }

    console.log("로그인 실패 상태:", data.status); // PENDING
    return false;
  } catch (err) {
    if (err instanceof ApiError) {
      console.log(`인증 확인 실패: ${err.status} ${err.message}`);
    } else {
      console.error("인증 확인 실패:", err);
    }
    return false;
  }
}
