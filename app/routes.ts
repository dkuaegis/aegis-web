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
    route("join/*", "routes/join/route.tsx"),

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
        // Addresses from the previous study app, still found in chats.
        ...[
          "create",
          "detail",
          "edit",
          "applications",
          "members",
          "attendance",
        ].map((section) =>
          route(
            section === "create" ? section : `${section}/:studyId`,
            "routes/study/legacy.tsx",
            { id: `routes/study/legacy-${section}` }
          )
        ),
      ]),
    ]),

    route("*", "routes/not-found.tsx"),
  ]),
  route("mypage/*", "routes/mypage/route.tsx"),
] satisfies RouteConfig;
