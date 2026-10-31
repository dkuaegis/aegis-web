import { ApiError, api } from "@app/lib/api";
import { create } from "zustand";

export enum AuthStatus {
  UNAUTHORIZED = "UNAUTHORIZED",
  NOT_COMPLETED = "NOT_COMPLETED",
  COMPLETED = "COMPLETED",
  LOADING = "LOADING",
  ERROR = "ERROR",
}

interface AuthState {
  isAuthenticated: AuthStatus;
  checkAuth: () => Promise<void>;
  completeRegistration: () => void;
}

interface AuthResponse {
  status: "PENDING" | "COMPLETED";
}

// 백엔드 없이 가입 퍼널 화면만 확인하기 위한 개발용 우회 스위치입니다.
// import.meta.env.DEV 로 한 번 더 막아 두어 프로덕션 빌드에서는 활성화되지 않습니다.
const isDevAuthBypassed =
  import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === "true";

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: isDevAuthBypassed
    ? AuthStatus.NOT_COMPLETED
    : AuthStatus.LOADING,

  checkAuth: async () => {
    if (isDevAuthBypassed) return;

    set({ isAuthenticated: AuthStatus.LOADING });
    try {
      const data = await api.get<AuthResponse>("/auth/check");
      set({
        isAuthenticated:
          data.status === "COMPLETED"
            ? AuthStatus.COMPLETED
            : AuthStatus.NOT_COMPLETED,
      });
    } catch (error) {
      // 로그인하지 않은 경우만 UNAUTHORIZED로 둡니다. 일시적인 오류까지
      // UNAUTHORIZED로 보면 로그인한 사용자도 /auth/continue로 보내집니다.
      const isSignedOut =
        error instanceof ApiError &&
        (error.status === 401 || error.status === 404);
      set({
        isAuthenticated: isSignedOut
          ? AuthStatus.UNAUTHORIZED
          : AuthStatus.ERROR,
      });
    }
  },

  completeRegistration: () => {
    set({ isAuthenticated: AuthStatus.COMPLETED });
  },
}));
