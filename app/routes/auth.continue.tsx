import { googleLoginUrl } from "@app/lib/api";
import { useEffect, useRef, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { checkAuth } from "../api/auth";
import { storeLoginIntent } from "../lib/authIntent";

export default function AuthContinuePage() {
  const [searchParams] = useSearchParams();
  const intent = searchParams.get("intent") === "join" ? "join" : "home";
  const [destination, setDestination] = useState<string | null>(null);
  const loginStarted = useRef(false);

  useEffect(() => {
    if (loginStarted.current) return;
    loginStarted.current = true;

    checkAuth().then((user) => {
      if (user.status === "COMPLETED") {
        setDestination("/");
        return;
      }
      if (user.status === "PENDING") {
        setDestination(intent === "join" ? "/join" : "/");
        return;
      }

      storeLoginIntent(intent);
      window.location.replace(googleLoginUrl);
    });
  }, [intent]);

  if (destination) return <Navigate to={destination} replace />;

  return (
    <main className="auth-continue-page" aria-busy="true">
      <span className="auth-continue-spinner" aria-hidden="true" />
      <p>로그인 정보를 확인하고 있습니다.</p>
    </main>
  );
}
