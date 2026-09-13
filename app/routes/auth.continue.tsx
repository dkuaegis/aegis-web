import { useI18n } from "@app/i18n";
import { ApiError, api, googleLoginUrl } from "@app/lib/api";
import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import type { AuthCheckResponse } from "../api/auth";
import { storeLoginIntent } from "../lib/authIntent";

export default function AuthContinuePage() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const intent = searchParams.get("intent") === "join" ? "join" : "home";
  const [destination, setDestination] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const request = { intent, retryKey } as const;
    let active = true;

    setError(false);

    api
      .get<AuthCheckResponse>("/auth/check", controller.signal)
      .then((user) => {
        if (!active) return;
        if (user.status === "COMPLETED") {
          setDestination("/");
          return;
        }
        setDestination(request.intent === "join" ? "/join" : "/");
      })
      .catch((caught) => {
        if (!active) return;
        if (caught instanceof ApiError && caught.status === 401) {
          storeLoginIntent(request.intent);
          window.location.replace(googleLoginUrl);
          return;
        }
        setError(true);
      });

    return () => {
      active = false;
      controller.abort(`Authentication request ${request.retryKey} superseded`);
    };
  }, [intent, retryKey]);

  if (destination) return <Navigate to={destination} replace />;

  if (error) {
    return (
      <main className="auth-continue-page">
        <p role="alert">{t("pages.authContinue.failed")}</p>
        <button
          className="auth-continue-retry"
          type="button"
          onClick={() => setRetryKey((current) => current + 1)}
        >
          {t("pages.authContinue.retry")}
        </button>
      </main>
    );
  }

  return (
    <main className="auth-continue-page" aria-busy="true">
      <span className="auth-continue-spinner" aria-hidden="true" />
      <p>{t("pages.authContinue.checking")}</p>
    </main>
  );
}
