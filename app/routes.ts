import {
  index,
  layout,
  prefix,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/site-layout.tsx", [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("auth/continue", "routes/auth-continue.tsx"),

    ...prefix("join", [
      layout("routes/join/guard.tsx", [
        index("routes/join/start.tsx"),
        layout("routes/join/layout.tsx", [
          route("agreement", "routes/join/agreement.tsx"),
          route("personal-info", "routes/join/personal-info.tsx"),
          route("survey", "routes/join/survey.tsx"),
          route("chat", "routes/join/chat.tsx"),
          route("payment", "routes/join/payment.tsx"),
        ]),
        route("complete", "routes/join/complete.tsx"),
        route("*", "routes/join/start.tsx", { id: "routes/join/unknown" }),
      ]),
    ]),

    ...prefix("study", [
      layout("routes/study/layout.tsx", [
        index("routes/study/list.tsx"),
        route("new", "routes/study/new.tsx"),
        route(":studyId", "routes/study/detail.tsx"),
        route(":studyId/edit", "routes/study/edit.tsx"),
        layout("routes/study/manage.tsx", [
          route(":studyId/applications", "routes/study/applications.tsx", [
            route(":applicationId", "routes/study/application.tsx"),
          ]),
          route(":studyId/members", "routes/study/members.tsx"),
          route(":studyId/attendance", "routes/study/attendance.tsx"),
        ]),
      ]),
    ]),

    ...prefix("mypage", [
      layout("routes/mypage/guard.tsx", [
        layout("routes/mypage/layout.tsx", [
          index("routes/mypage/hub.tsx"),
          route("points", "routes/mypage/points.tsx"),
          route("coupons", "routes/mypage/coupons.tsx"),
          route("shop", "routes/mypage/shop.tsx"),
          route("ranking", "routes/mypage/ranking.tsx"),
        ]),
        route("qr", "routes/mypage/qr.tsx"),
      ]),
    ]),

    route("*", "routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;
