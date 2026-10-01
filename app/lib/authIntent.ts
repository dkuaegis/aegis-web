import type { AuthStatus } from "../api/auth";

export type LoginIntent = "home" | "join" | "study";

export function parseLoginIntent(value: string | null): LoginIntent | null {
  return value === "home" || value === "join" || value === "study"
    ? value
    : null;
}

export function parseStudyReturnTo(value: string | null): string | null {
  if (!value?.startsWith("/") || value.startsWith("//")) return null;

  try {
    const url = new URL(value, "https://dkuaegis.org");
    if (url.origin !== "https://dkuaegis.org") return null;
    if (url.pathname !== "/study" && !url.pathname.startsWith("/study/")) {
      return null;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export function getLoginDestination(
  intent: LoginIntent,
  status: AuthStatus,
  returnTo?: string | null
) {
  if (intent === "study") {
    return status === "COMPLETED"
      ? (parseStudyReturnTo(returnTo ?? null) ?? "/study")
      : "/join";
  }
  return intent === "join" && status === "PENDING" ? "/join" : "/";
}

const LOGIN_INTENT_STORAGE_KEY = "aegis.login-intent";
const LOGIN_RETURN_TO_STORAGE_KEY = "aegis.login-return-to";

export function storeLoginIntent(
  intent: LoginIntent,
  returnTo?: string | null
) {
  try {
    window.sessionStorage.setItem(LOGIN_INTENT_STORAGE_KEY, intent);
    const safeReturnTo =
      intent === "study" ? parseStudyReturnTo(returnTo ?? null) : null;
    if (safeReturnTo) {
      window.sessionStorage.setItem(LOGIN_RETURN_TO_STORAGE_KEY, safeReturnTo);
    } else {
      window.sessionStorage.removeItem(LOGIN_RETURN_TO_STORAGE_KEY);
    }
  } catch {
    // 저장소를 사용할 수 없어도 OAuth 로그인은 계속 진행합니다.
  }
}

export function readLoginIntent(): LoginIntent | null {
  try {
    const intent = window.sessionStorage.getItem(LOGIN_INTENT_STORAGE_KEY);
    return parseLoginIntent(intent);
  } catch {
    return null;
  }
}

export function consumeLoginIntent() {
  const intent = readLoginIntent();
  try {
    window.sessionStorage.removeItem(LOGIN_INTENT_STORAGE_KEY);
  } catch {
    // 저장소 정리에 실패해도 화면 이동은 계속 진행합니다.
  }
  return intent;
}

export function readLoginReturnTo(): string | null {
  try {
    return parseStudyReturnTo(
      window.sessionStorage.getItem(LOGIN_RETURN_TO_STORAGE_KEY)
    );
  } catch {
    return null;
  }
}

export function consumeLoginReturnTo() {
  const returnTo = readLoginReturnTo();
  try {
    window.sessionStorage.removeItem(LOGIN_RETURN_TO_STORAGE_KEY);
  } catch {
    // 저장소 정리에 실패해도 화면 이동은 계속 진행합니다.
  }
  return returnTo;
}
