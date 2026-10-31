import { loginPath, safeReturnTo } from "@app/lib/auth";
import { redirect } from "react-router";
import type { Route } from "./+types/auth-continue";

const INTENT_DESTINATIONS: Record<string, string> = {
  join: "/join",
  study: "/study",
  qr: "/mypage/qr",
  mypage: "/mypage",
};

/** Old sign-in links (`/auth/continue?intent=qr`) still work. */
export function clientLoader({ request }: Route.ClientLoaderArgs) {
  const params = new URL(request.url).searchParams;
  const intent = params.get("intent") ?? "";
  const returnTo = params.get("returnTo");
  const destination =
    intent === "study" && returnTo
      ? safeReturnTo(returnTo)
      : (INTENT_DESTINATIONS[intent] ?? "/");
  throw redirect(loginPath(destination));
}

export default function AuthContinue() {
  return null;
}
