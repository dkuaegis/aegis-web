import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router";
import { checkAuth } from "../api/AuthCheck";

interface AuthContextType {
  isAuthenticated: boolean | null; // null = loading, true = authenticated, false = not authenticated
  checkAuthStatus: (shouldNavigate?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const checkAuthStatus = useCallback(
    async (shouldNavigate: boolean = false) => {
      // checkAuth는 실패하면 false를 돌려주므로 따로 예외를 처리하지 않습니다.
      const authenticated = await checkAuth();
      setIsAuthenticated(authenticated);

      // 명시적으로 요청된 경우에만 네비게이션 처리
      if (shouldNavigate) {
        navigate(authenticated ? "/mypage" : "/mypage/login/unauthorized");
      }
    },
    [navigate]
  );

  useEffect(() => {
    // 초기 로드 시 네비게이션 없이 인증 상태만 확인
    if (isAuthenticated === null) {
      checkAuthStatus(false);
    }
  }, [checkAuthStatus, isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
