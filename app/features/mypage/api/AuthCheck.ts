import { ApiError, api } from "@app/lib/api";

export async function checkAuth(): Promise<boolean> {
  try {
    const data = await api.get<{ status: string }>("/auth/check");

    // 가입을 마치지 않은 PENDING 회원은 마이페이지를 쓸 수 없습니다.
    return data.status === "COMPLETED";
  } catch (err) {
    // 비로그인(401)은 정상적인 경우라 기록하지 않습니다.
    if (!(err instanceof ApiError && err.status === 401)) {
      console.error("인증 확인 실패:", err);
    }
    return false;
  }
}
