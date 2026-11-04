import { useI18n } from "@app/i18n";
import { cn } from "@app/lib/utils";
import { CheckIcon, ExternalLinkIcon, MessageCircleIcon } from "lucide-react";

export const CHAT_ROOMS = [
  { key: "notice", url: import.meta.env.VITE_KAKAO_NOTICEROOM_URL },
  { key: "community", url: import.meta.env.VITE_KAKAO_COMMUNITYROOM_URL },
] as const;

export type ChatRoom = (typeof CHAT_ROOMS)[number]["key"];

/** The two KakaoTalk rooms every member joins, as links that open the app. */
export function ChatRooms({
  opened,
  onOpen,
}: {
  /** Rooms the visitor has already opened, marked with a check. */
  opened?: ReadonlySet<ChatRoom>;
  onOpen?: (room: ChatRoom) => void;
}) {
  const { t } = useI18n();

  return (
    <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
      {CHAT_ROOMS.map(({ key, url }) => {
        const done = opened?.has(key) ?? false;
        return (
          <li key={key} className="grid">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onOpen?.(key)}
              className={cn(
                "group grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border bg-paper-raised px-5 py-4 transition-colors",
                "hover:border-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue",
                done ? "border-ink" : "border-line-strong"
              )}
            >
              <MessageCircleIcon
                aria-hidden="true"
                className="size-6 text-blue"
              />
              <span className="grid min-w-0 gap-0.5">
                <strong className="text-[1rem] font-[800]">
                  {t(`join.chat.${key}RoomTitle`)}
                </strong>
                <small className="truncate text-[0.8125rem] text-ink-muted">
                  {t(`join.chat.${key}RoomDescription`)}
                </small>
              </span>
              {done ? (
                <CheckIcon
                  aria-label={t("join.chat.opened")}
                  strokeWidth={3}
                  className="size-[1.125rem] text-ink"
                />
              ) : (
                <ExternalLinkIcon
                  aria-hidden="true"
                  className="size-[1.125rem] text-ink-muted transition-colors group-hover:text-ink"
                />
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
