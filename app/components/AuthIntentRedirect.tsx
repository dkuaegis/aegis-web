import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import type { AuthCheckResponse } from "../api/auth";
import { ApiError, api } from "../lib/api";
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
    if (
      pendingIntent !== "join" &&
      pendingIntent !== "study" &&
      pendingIntent !== "qr" &&
      pendingIntent !== "mypage"
    )
      return;

    let active = true;
    api
      .get<AuthCheckResponse>("/auth/check")
      .then((user) => {
        if (!active) return;

        const intent = consumeLoginIntent();
        const returnTo = consumeLoginReturnTo();
        if (
          intent === "study" ||
          intent === "qr" ||
          intent === "mypage" ||
          (intent === "join" && user.status === "PENDING")
        ) {
          navigate(getLoginDestination(intent, user.status, returnTo), {
            replace: true,
          });
        }
      })
      .catch((error) => {
        // 로그인을 마치지 않고 돌아온 경우입니다. 의도를 남겨 두면 이후
        // 화면을 옮길 때마다 인증 확인 요청이 반복됩니다.
        if (active && error instanceof ApiError && error.status === 401) {
          consumeLoginIntent();
          consumeLoginReturnTo();
        }
      });

    return () => {
      active = false;
    };
  }, [location.pathname, navigate]);

  return null;
}
