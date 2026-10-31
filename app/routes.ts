import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("auth/continue", "routes/auth.continue.tsx"),
  route("study/*", "routes/study/route.tsx"),
  route("join/*", "routes/join/route.tsx"),
  route("mypage/*", "routes/mypage/route.tsx"),
] satisfies RouteConfig;
