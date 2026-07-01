import { httpClient } from "@join/api/api";
import { ServerError } from "@join/api/types";
import { useCallback, useEffect, useState } from "react";

export enum AuthStatus {
  UNAUTHORIZED = "UNAUTHORIZED", // 인증 안됨 (401)
  NOT_COMPLETED = "NOT_COMPLETED", // 가입 완료 안됨
  COMPLETED = "COMPLETED", // 가입 완료
  LOADING = "LOADING",
}

const useAuth = () => {
  const [isAuthenticated, setAuthenticated] = useState<AuthStatus>(
    AuthStatus.LOADING
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await httpClient.get("/auth/check");
        setAuthenticated(AuthStatus.NOT_COMPLETED);
      } catch (error: unknown) {
        if (error instanceof ServerError) {
          if (error.status === 401) {
            setAuthenticated(AuthStatus.UNAUTHORIZED);
          }
        }
      }
    };

    checkAuth();
  }, []);

  const completeRegistration = useCallback(() => {
    setAuthenticated(AuthStatus.COMPLETED);
  }, []);

  return { isAuthenticated, completeRegistration };
};

export default useAuth;
