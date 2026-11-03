import { CHAT_ROOMS } from "@app/components/join/ChatRooms";
import { PageBody, PageHeader } from "@app/components/page/PageHeader";
import { GITHUB_URL, INSTAGRAM_URL } from "@app/components/site/SiteFooter";
import { useI18n } from "@app/i18n";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import { Link } from "react-router";

const linkClassName =
  "inline-flex items-center gap-1 text-[0.875rem] font-[750] whitespace-nowrap text-ink transition-colors hover:text-blue";

/** What a new member can do next, in the order most people need it. */
const TASKS = [
  { key: "study", to: "/study" },
  { key: "mypage", to: "/mypage" },
  { key: "instagram", href: INSTAGRAM_URL, label: "Instagram" },
  { key: "github", href: GITHUB_URL, label: "GitHub" },
] as const;

export default function JoinComplete() {
  const { t } = useI18n();

  return (
    <div className="narrow-frame [--frame-width:42rem]">
      <PageHeader
        className="border-b-0"
        title={t("join.complete.title")}
        description={
          <>
            {t("join.complete.noticeLead")}
            <strong className="font-[750] text-ink">
              {t("join.complete.noticeStrong")}
            </strong>
            {t("join.complete.noticeTail")}
          </>
        }
      />
      <PageBody className="grid gap-6 pt-0">
        <ol
          aria-label={t("join.complete.tasksLabel")}
          className="m-0 list-none border-t-2 border-ink p-0"
        >
          {TASKS.map((task, index) => (
            <li
              key={task.key}
              className="grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 border-b border-line py-5 sm:grid-cols-[2rem_minmax(0,1fr)_auto] sm:gap-x-4"
            >
              <span className="tabular self-start text-[0.875rem] font-[800] text-ink-subtle">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="grid gap-1">
                <h2 className="m-0 text-[1rem] font-[750]">
                  {t(`join.complete.tasks.${task.key}.title`)}
                </h2>
                <p className="m-0 text-[0.875rem] leading-relaxed text-ink-muted">
                  {t(`join.complete.tasks.${task.key}.description`)}
                </p>
              </div>
              <div className="col-start-2 sm:col-start-3">
                {"to" in task ? (
                  <Link to={task.to} className={linkClassName}>
                    {t(`common.site.nav.${task.key}`)}
                    <ArrowRightIcon aria-hidden="true" className="size-4" />
                  </Link>
                ) : (
                  <a
                    href={task.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                  >
                    {task.label}
                    <ArrowUpRightIcon aria-hidden="true" className="size-4" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>

        <p className="m-0 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.875rem] text-ink-muted">
          <span className="basis-full sm:basis-auto">
            {t("join.complete.chatReminder")}
          </span>
          {CHAT_ROOMS.map(({ key, url }) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              {t(`join.chat.${key}RoomTitle`)}
              <ArrowUpRightIcon aria-hidden="true" className="size-4" />
            </a>
          ))}
        </p>
      </PageBody>
    </div>
  );
}
