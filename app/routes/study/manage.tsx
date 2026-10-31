import { getStudy } from "@app/api/generated/endpoints";
import { PageHeader } from "@app/components/page/PageHeader";
import { RouteErrorState, StateMessage } from "@app/components/page/States";
import { parseId, roleOf } from "@app/components/study/study";
import { useI18n } from "@app/i18n";
import { cn } from "@app/lib/utils";
import {
  Navigate,
  NavLink,
  Outlet,
  useLocation,
  useRouteLoaderData,
} from "react-router";
import type { Route } from "./+types/manage";
import { useStudyContext } from "./layout";

export async function clientLoader({
  params,
  request,
}: Route.ClientLoaderArgs) {
  const studyId = parseId(params.studyId);
  return { study: await getStudy(studyId, { signal: request.signal }) };
}

export function useManagedStudy() {
  const data = useRouteLoaderData<typeof clientLoader>("routes/study/manage");
  if (!data) throw new Error("useManagedStudy must be used below manage");
  return data.study;
}

/** Shared frame of the leader's pages: the study's name and the tabs. */
export default function ManageLayout({ loaderData }: Route.ComponentProps) {
  const { t } = useI18n();
  const { roles } = useStudyContext();
  const { study } = loaderData;
  const { pathname } = useLocation();
  const base = `/study/${study.id}`;
  const isInstructor = roleOf(roles, study.id) === "instructor";
  const hasApplications = study.recruitmentMethod === "APPLICATION";

  if (!hasApplications && pathname.startsWith(`${base}/applications`)) {
    return <Navigate to={`${base}/members`} replace />;
  }

  const tabs = [
    hasApplications && {
      to: `${base}/applications`,
      label: t("study.manage.tabs.applications"),
    },
    { to: `${base}/members`, label: t("study.manage.tabs.members") },
    { to: `${base}/attendance`, label: t("study.manage.tabs.attendance") },
  ].filter((tab) => tab !== false);

  return (
    <>
      <PageHeader
        back={{ to: base, label: t("study.manage.back") }}
        eyebrow={t("study.manage.eyebrow")}
        title={study.title}
        period={false}
        className="border-b-0 pb-0"
      />
      {isInstructor ? (
        <>
          <nav
            aria-label={t("study.manage.eyebrow")}
            className="gutter-x mt-8 flex gap-7 overflow-x-auto border-b border-ink [scrollbar-width:none]"
          >
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                preventScrollReset
                className={({ isActive }) =>
                  cn(
                    "relative flex h-12 shrink-0 items-center text-[1rem] font-[750] whitespace-nowrap transition-colors",
                    isActive
                      ? "text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-[3px] after:bg-ink"
                      : "text-ink-muted hover:text-ink"
                  )
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
          <div className="gutter-x py-[clamp(1.75rem,4vw,3.5rem)]">
            <Outlet />
          </div>
        </>
      ) : (
        <div className="gutter-x pt-8 pb-16">
          <StateMessage
            role="alert"
            title={t("common.errorCode.STUDY_MEMBER_NOT_INSTRUCTOR")}
          />
        </div>
      )}
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <RouteErrorState error={error} />;
}
