import { useI18n } from "@app/i18n";
import { JOIN_STEPS } from "@join/constants/joinSteps";
import useFunnel from "@join/hooks/useFunnel";
import { AuthStatus, useAuthStore } from "@join/stores/authStore";
import type React from "react";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";

const JOIN_BASE_PATH = "/join";

interface AuthenticationProps {
  children: React.ReactNode;
}

function Authentication({ children }: AuthenticationProps) {
  const { t } = useI18n();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const { currentStep } = useFunnel();
  const location = useLocation();
  const [checkedAttempt, setCheckedAttempt] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);

  // 가입 화면에 들어올 때마다 다시 확인합니다. 이전 결과를 그대로 쓰면
  // /auth/continue에서 로그인을 확인하고 돌아와도 예전 상태로 다시 보냅니다.
  useEffect(() => {
    let active = true;
    void checkAuth().finally(() => {
      if (active) setCheckedAttempt(attempt);
    });
    return () => {
      active = false;
    };
  }, [checkAuth, attempt]);

  if (checkedAttempt !== attempt || isAuthenticated === AuthStatus.LOADING) {
    return null;
  }

  if (isAuthenticated === AuthStatus.ERROR) {
    return (
      <main className="auth-continue-page">
        <p role="alert">{t("pages.authContinue.failed")}</p>
        <button
          className="auth-continue-retry"
          type="button"
          onClick={() => setAttempt((current) => current + 1)}
        >
          {t("pages.authContinue.retry")}
        </button>
      </main>
    );
  }

  if (isAuthenticated === AuthStatus.UNAUTHORIZED) {
    return <Navigate to="/auth/continue?intent=join" replace />;
  }

  if (isAuthenticated === AuthStatus.COMPLETED) {
    if (location.pathname === `${JOIN_BASE_PATH}/complete`) {
      return children;
    } else {
      return <Navigate to={`${JOIN_BASE_PATH}/complete`} replace />;
    }
  }

  if (isAuthenticated === AuthStatus.NOT_COMPLETED) {
    const isFunnelPage = JOIN_STEPS.includes(
      location.pathname.replace(/^\/join\/?/, "")
    );
    if (isFunnelPage) {
      return children;
    } else {
      const isValidStep = JOIN_STEPS.includes(currentStep);
      const redirectTo = isValidStep
        ? `${JOIN_BASE_PATH}/${currentStep}`
        : `${JOIN_BASE_PATH}/${JOIN_STEPS[0]}`;

      return <Navigate to={redirectTo} replace />;
    }
  }

  return null;
}

export default Authentication;
