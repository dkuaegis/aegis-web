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
  const { next } = useFunnel();
  const [joined, setJoined] = useState<JoinedState>({
    notice: false,
    community: false,
  });

  const allJoined = Object.values(joined).every(Boolean);

  const handleJoin = (key: keyof JoinedState) => {
    setJoined((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <div className="join-chat-page">
      <p className="join-chat-description line-breaks">
        공지 확인과 소통은 팀 채팅방에서 이루어져요.
        <br />
        아래 두 채팅방에 모두 참여를 신청해주세요.
        <br />
        운영진이 확인한 뒤 수락해드려요.
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
            <strong>카카오톡 공지방</strong>
            <small>주요 공지와 활동 일정을 확인하세요</small>
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
            <strong>카카오톡 소통방</strong>
            <small>회원들과 자유롭게 소통하세요</small>
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
          ? "두 채팅방 참여 신청을 확인했어요"
          : "두 채팅방에 모두 신청해야 다음으로 넘어갈 수 있어요"}
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
