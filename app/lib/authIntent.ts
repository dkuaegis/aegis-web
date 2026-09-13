export type LoginIntent = "home" | "join";

const LOGIN_INTENT_STORAGE_KEY = "aegis.login-intent";

export function storeLoginIntent(intent: LoginIntent) {
  try {
    window.sessionStorage.setItem(LOGIN_INTENT_STORAGE_KEY, intent);
  } catch {
    // 저장소를 사용할 수 없어도 OAuth 로그인은 계속 진행합니다.
  }
}

export function readLoginIntent(): LoginIntent | null {
  try {
    const intent = window.sessionStorage.getItem(LOGIN_INTENT_STORAGE_KEY);
    return intent === "home" || intent === "join" ? intent : null;
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
