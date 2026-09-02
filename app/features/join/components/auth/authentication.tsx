import { JOIN_STEPS } from "@join/constants/joinSteps";
import { AuthStatus } from "@join/hooks/useAuth";
import useFunnel from "@join/hooks/useFunnel";
import { Analytics } from "@join/service/analytics";
import { useAuthStore } from "@join/stores/authStore";
import type React from "react";
import { Navigate, useLocation } from "react-router-dom";

const JOIN_BASE_PATH = "/join";

interface AuthenticationProps {
  children: React.ReactNode;
}

function Authentication({ children }: AuthenticationProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { currentStep } = useFunnel();
  const location = useLocation();

  if (isAuthenticated === AuthStatus.LOADING) {
    return null;
  }

  if (isAuthenticated === AuthStatus.UNAUTHORIZED) {
    if (location.pathname === JOIN_BASE_PATH) {
      return <Navigate to="/auth/continue?intent=join" replace />;
    } else {
      // 로그인 페이지로 강제 이동될 때 이벤트 기록
      Analytics.safeTrack("Redirect_To_Login", {
        category: "Auth",
        from_path: location.pathname, // 어느 페이지에 접근하려 했는지 기록
      });
      return <Navigate to="/auth/continue?intent=join" replace />;
    }
  }

  if (isAuthenticated === AuthStatus.COMPLETED) {
    if (location.pathname === `${JOIN_BASE_PATH}/complete`) {
      return children;
    } else {
      // 가입 완료자가 다른 페이지 접근 시 완료 페이지로 강제 이동될 때 이벤트 기록
      Analytics.safeTrack("Redirect_To_Complete", {
        category: "Auth",
        from_path: location.pathname,
      });
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

      // 가입 미완료자가 퍼널 이탈 시 다시 퍼널로 강제 이동될 때 이벤트 기록
      Analytics.safeTrack("Redirect_To_Funnel", {
        category: "Auth",
        from_path: location.pathname, // 어디로 가려고 했는지
        to_funnel_step: redirectTo, // 어디로 보내졌는지
      });
      return <Navigate to={redirectTo} replace />;
    }
  }

  return null;
}

export default Authentication;
