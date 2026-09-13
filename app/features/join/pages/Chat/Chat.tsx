import { useI18n } from "@app/i18n";
import NavigationButtons from "@join/components/ui/custom/navigationButton";
import useFunnel from "@join/hooks/useFunnel";
import { Analytics } from "@join/service/analytics";
import { Check, ExternalLink, MessageCircle } from "lucide-react";
import { useState } from "react";

const NOTICE_ROOM_URL = import.meta.env.VITE_KAKAO_NOTICEROOM_URL;
const COMMUNITY_ROOM_URL = import.meta.env.VITE_KAKAO_COMMUNITYROOM_URL;

interface JoinedState {
  notice: boolean;
  community: boolean;
}

const Chat = () => {
  const { t, tList } = useI18n();
  const { next } = useFunnel();
  const [joined, setJoined] = useState<JoinedState>({
    notice: false,
    community: false,
  });

  const allJoined = Object.values(joined).every(Boolean);

  const handleJoin = (key: keyof JoinedState) => {
    Analytics.safeTrack("Kakao_External_Open", {
      category: "Kakao",
    });
    setJoined((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <div className="join-chat-page">
      <p className="join-chat-description line-breaks">
        {tList("join.chat.description").map((line, index) => (
          <span key={line}>
            {index > 0 && <br />}
            {line}
          </span>
        ))}
      </p>

      <div className="join-next-step-grid join-chat-room-grid">
        <a
          href={NOTICE_ROOM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`join-next-step-card${joined.notice ? " is-complete" : ""}`}
          onClick={() => handleJoin("notice")}
        >
          <MessageCircle aria-hidden="true" />
          <span>
            <strong>{t("join.chat.noticeRoomTitle")}</strong>
            <small>{t("join.chat.noticeRoomDescription")}</small>
          </span>
          {joined.notice ? (
            <Check aria-hidden="true" />
          ) : (
            <ExternalLink aria-hidden="true" />
          )}
        </a>
        <a
          href={COMMUNITY_ROOM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`join-next-step-card${joined.community ? " is-complete" : ""}`}
          onClick={() => handleJoin("community")}
        >
          <MessageCircle aria-hidden="true" />
          <span>
            <strong>{t("join.chat.communityRoomTitle")}</strong>
            <small>{t("join.chat.communityRoomDescription")}</small>
          </span>
          {joined.community ? (
            <Check aria-hidden="true" />
          ) : (
            <ExternalLink aria-hidden="true" />
          )}
        </a>
      </div>

      <p className="join-chat-status">
        {allJoined
          ? t("join.chat.statusAllJoined")
          : t("join.chat.statusPending")}
      </p>

      <NavigationButtons
        disabled={!allJoined}
        onClick={() => {
          Analytics.safeTrack("Chat_Next_Click", { category: "Chat" });
          next();
        }}
      />
    </div>
  );
};

export default Chat;
