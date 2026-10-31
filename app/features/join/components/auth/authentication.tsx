import { JOIN_STEPS } from "@join/constants/joinSteps";
import { AuthStatus } from "@join/hooks/useAuth";
import useFunnel from "@join/hooks/useFunnel";
import { useAuthStore } from "@join/stores/authStore";
import type React from "react";
import { Navigate, useLocation } from "react-router";

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
