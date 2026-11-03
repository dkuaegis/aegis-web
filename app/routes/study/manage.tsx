import { getStudy } from "@app/api/generated/endpoints";
import { PageHeader } from "@app/components/page/PageHeader";
import { parseId } from "@app/components/study/study";
import { useI18n } from "@app/i18n";
import { keepDataOnSearchChange } from "@app/lib/route-data";
import { cn } from "@app/lib/utils";
import { NavLink, Outlet, redirect } from "react-router";
import type { Route } from "./+types/manage";

export const shouldRevalidate = keepDataOnSearchChange;

export async function clientLoader({
  params,
  request,
}: Route.ClientLoaderArgs) {
  const studyId = parseId(params.studyId);
  const study = await getStudy(studyId, { signal: request.signal });
  // First-come studies have no applicants; "my studies" links here regardless.
  const onApplications = new URL(request.url).pathname
    .toLowerCase()
    .startsWith(`/study/${studyId}/applications`);
  if (study.recruitmentMethod !== "APPLICATION" && onApplications) {
    throw redirect(`/study/${studyId}/members`);
  }
  return { study };
}

/**
 * Shared frame of the leader's pages: the study's name and the tabs. The pages
 * below load through instructor-only APIs, so the server decides who gets in.
 */
export default function ManageLayout({ loaderData }: Route.ComponentProps) {
  const { t } = useI18n();
  const { study } = loaderData;
  const base = `/study/${study.id}`;
  const hasApplications = study.recruitmentMethod === "APPLICATION";

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
  );
}
