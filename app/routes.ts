import {
  index,
  layout,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/site-layout.tsx", [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("auth/continue", "routes/auth-continue.tsx"),
    route("join/*", "routes/join/route.tsx"),
    route("*", "routes/not-found.tsx"),
  ]),
  route("study/*", "routes/study/route.tsx"),
  route("mypage/*", "routes/mypage/route.tsx"),
] satisfies RouteConfig;
