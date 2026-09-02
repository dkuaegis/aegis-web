import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("auth/continue", "routes/auth.continue.tsx"),
  route("study/*", "routes/study/route.tsx"),
  route("join/*", "routes/join/route.tsx"),
  route("mypage/*", "routes/mypage/route.tsx"),
  route("faq", "routes/faq/route.tsx"),
  route("recruit", "routes/recruit/route.tsx"),
  route("contact", "routes/contact/route.tsx"),
] satisfies RouteConfig;
