import { ApiError, api, googleLoginUrl } from "@app/lib/api";
import { useEffect, useRef, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import type { AuthCheckResponse } from "../api/auth";
import { storeLoginIntent } from "../lib/authIntent";

export default function AuthContinuePage() {
  const [searchParams] = useSearchParams();
  const intent = searchParams.get("intent") === "join" ? "join" : "home";
  const [destination, setDestination] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const loginStarted = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: retryKey explicitly triggers a manual authentication retry.
  useEffect(() => {
    if (loginStarted.current) return;
    loginStarted.current = true;
    setError(false);

    api
      .get<AuthCheckResponse>("/auth/check")
      .then((user) => {
        if (user.status === "COMPLETED") {
          setDestination("/");
          return;
        }
        setDestination(intent === "join" ? "/join" : "/");
      })
      .catch((caught) => {
        if (caught instanceof ApiError && caught.status === 401) {
          storeLoginIntent(intent);
          window.location.replace(googleLoginUrl);
          return;
        }
        setError(true);
      });
  }, [intent, retryKey]);

  if (destination) return <Navigate to={destination} replace />;

  if (error) {
    return (
      <main className="auth-continue-page">
        <p role="alert">로그인 상태를 확인하지 못했습니다.</p>
        <button
          className="auth-continue-retry"
          type="button"
          onClick={() => {
            loginStarted.current = false;
            setRetryKey((current) => current + 1);
          }}
        >
          다시 시도
        </button>
      </main>
    );
  }

  return (
    <main className="auth-continue-page" aria-busy="true">
      <span className="auth-continue-spinner" aria-hidden="true" />
      <p>로그인 정보를 확인하고 있습니다.</p>
    </main>
  );
}
