import { useI18n } from "@app/i18n";
import { CheckCircle2, ExternalLink, MessageCircle } from "lucide-react";
import CompleteNotice from "./JoinComplete.Notice";

const NOTICE_ROOM_URL = import.meta.env.VITE_KAKAO_NOTICEROOM_URL;
const COMMUNITY_ROOM_URL = import.meta.env.VITE_KAKAO_COMMUNITYROOM_URL;

const JoinComplete = () => {
  const { t } = useI18n();

  return (
    <Wrapper>
      <div className="join-complete-mark">
        <CheckCircle2 aria-hidden="true" />
      </div>
      <h1>{t("join.complete.title")}</h1>
      <CompleteNotice />
      <div className="join-next-step-grid">
        <a
          href={NOTICE_ROOM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="join-next-step-card"
        >
          <MessageCircle aria-hidden="true" />
          <span>
            <strong>{t("join.chat.noticeRoomTitle")}</strong>
            <small>{t("join.chat.noticeRoomDescription")}</small>
          </span>
          <ExternalLink aria-hidden="true" />
        </a>
        <a
          href={COMMUNITY_ROOM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="join-next-step-card"
        >
          <MessageCircle aria-hidden="true" />
          <span>
            <strong>{t("join.chat.communityRoomTitle")}</strong>
            <small>{t("join.chat.communityRoomDescription")}</small>
          </span>
          <ExternalLink aria-hidden="true" />
        </a>
      </div>
    </Wrapper>
  );
};

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="join-complete-page">
      <main className="join-complete-card">{children}</main>
    </div>
  );
};

export default JoinComplete;
