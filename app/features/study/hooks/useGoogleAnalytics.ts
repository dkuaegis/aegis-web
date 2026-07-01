import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type AuthState = "LOGGED_IN" | "LOGGED_OUT";

declare function gtag(
  command: "event",
  action: string,
  params?: Record<string, unknown>
): void;

const PAGE_TITLES: Record<string, string> = {
  "/": "스터디 목록",
  "/create": "스터디 만들기",
};

const getPageTitle = (pathname: string): string => {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/study/detail/")) return "스터디 상세";
  if (pathname.startsWith("/study/edit/")) return "스터디 수정";
  if (pathname.startsWith("/study/applications/")) return "신청 현황";
  if (pathname.startsWith("/study/members/")) return "스터디 멤버";
  if (pathname.startsWith("/study/attendance/")) return "출석 관리";
  return pathname;
};

export const useGoogleAnalytics = (
  enabled = true,
  authState: AuthState = "LOGGED_IN"
) => {
  const location = useLocation();

  useEffect(() => {
    if (!enabled) return;
    if (typeof gtag === "undefined") return;

    const pageTitle =
      authState === "LOGGED_OUT" ? "로그인" : getPageTitle(location.pathname);

    gtag("event", "page_view", {
      page_path: location.pathname,
      page_title: pageTitle,
      auth_state: authState,
    });
  }, [enabled, location.pathname, authState]);
};
