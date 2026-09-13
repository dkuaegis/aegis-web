import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkAuth } from "../api/auth";
import { consumeLoginIntent, readLoginIntent } from "../lib/authIntent";

export function AuthIntentRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/auth/continue") return;
    if (readLoginIntent() !== "join") return;

    let active = true;
    checkAuth().then((user) => {
      if (!active || !user.isAuthenticated) return;

      const intent = consumeLoginIntent();
      if (intent === "join" && user.status === "PENDING") {
        navigate("/join", { replace: true });
      }
    });

    return () => {
      active = false;
    };
  }, [location.pathname, navigate]);

  return null;
}
