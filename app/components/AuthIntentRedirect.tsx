import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkAuth } from "../api/auth";
import {
  consumeLoginIntent,
  consumeLoginReturnTo,
  getLoginDestination,
  readLoginIntent,
} from "../lib/authIntent";

export function AuthIntentRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/auth/continue") return;
    const pendingIntent = readLoginIntent();
    if (pendingIntent !== "join" && pendingIntent !== "study") return;

    let active = true;
    checkAuth().then((user) => {
      if (!active || !user.isAuthenticated || !user.status) return;

      const intent = consumeLoginIntent();
      const returnTo = consumeLoginReturnTo();
      if (
        intent === "study" ||
        (intent === "join" && user.status === "PENDING")
      ) {
        navigate(getLoginDestination(intent, user.status, returnTo), {
          replace: true,
        });
      }
    });

    return () => {
      active = false;
    };
  }, [location.pathname, navigate]);

  return null;
}
