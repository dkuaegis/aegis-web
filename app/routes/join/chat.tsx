import {
  CHAT_ROOMS,
  type ChatRoom,
  ChatRooms,
} from "@app/components/join/ChatRooms";
import { StepActions, stepButtonClassName } from "@app/components/join/Funnel";
import { joinPath } from "@app/components/join/join";
import { Button } from "@app/components/ui/button";
import { useI18n } from "@app/i18n";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Chat() {
  const { t, tList } = useI18n();
  const navigate = useNavigate();
  const [opened, setOpened] = useState<ReadonlySet<ChatRoom>>(new Set());
  const allOpened = opened.size === CHAT_ROOMS.length;

  return (
    <>
      <div className="mb-8 grid gap-1 text-[1rem] leading-relaxed text-ink-muted">
        {tList("join.chat.description").map((line) => (
          <p key={line} className="m-0">
            {line}
          </p>
        ))}
      </div>

      <ChatRooms
        opened={opened}
        onOpen={(room) => setOpened((current) => new Set(current).add(room))}
      />

      <StepActions step="chat">
        <div className="grid gap-2 sm:justify-items-end">
          <Button
            size="lg"
            disabled={!allOpened}
            onClick={() => navigate(joinPath("payment"))}
            className={stepButtonClassName}
          >
            {t("join.actions.next")}
          </Button>
          <p
            role="status"
            className="m-0 text-[0.8125rem] leading-snug text-ink-muted"
          >
            {allOpened
              ? t("join.chat.statusAllJoined")
              : t("join.chat.statusPending")}
          </p>
        </div>
      </StepActions>
    </>
  );
}
