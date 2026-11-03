import { data, redirect } from "react-router";
import type { Route } from "./+types/legacy";

const LEGACY = new Map([
  ["category/points", "/mypage/points"],
  ["category/giftbox/coupons", "/mypage/coupons"],
  ["category/giftbox/history", "/mypage/shop#draws"],
  ["category/pointshop", "/mypage/shop"],
  ["category/ranking", "/mypage/ranking"],
  ["login/auth", "/mypage"],
  ["login/unauthorized", "/join"],
]);

/** `/mypage/category/pointshop` → `/mypage/shop`; anything else is a 404. */
export function clientLoader({ params }: Route.ClientLoaderArgs) {
  const target = LEGACY.get(params["*"] ?? "");
  if (target) throw redirect(target);
  throw data(null, { status: 404 });
}

export default function LegacyMypageRedirect() {
  return null;
}
