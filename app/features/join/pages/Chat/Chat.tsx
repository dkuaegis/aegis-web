import DiscordLinkButton from "@join/components/ui/custom/discord-link-button";
import NavigationButtons from "@join/components/ui/custom/navigationButton";
import useFunnel from "@join/hooks/useFunnel";
import { Analytics } from "@join/service/analytics";
import { useState } from "react";

const NOTICE_URL = import.meta.env.VITE_DISCORD_NOTICE_URL;
const COMMUNITY_URL = import.meta.env.VITE_DISCORD_COMMUNITY_URL;

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
    <div className="space-y-8">
      <p className="line-breaks text-muted-foreground">
        공지 확인과 소통은 팀 채팅방에서 이루어져요. 아래 두 채팅방에 모두
        참여해주세요.
      </p>

      <div className="flex flex-col gap-3">
        <DiscordLinkButton
          text="공지방 가입하기"
          url={NOTICE_URL}
          completed={joined.notice}
          onClick={() => handleJoin("notice")}
        />
        <DiscordLinkButton
          text="소통방 가입하기"
          url={COMMUNITY_URL}
          completed={joined.community}
          onClick={() => handleJoin("community")}
        />
      </div>

      <p className="text-center text-muted-foreground text-sm">
        {allJoined
          ? "두 채팅방 참여를 확인했어요"
          : "두 채팅방에 모두 참여해야 다음으로 넘어갈 수 있어요"}
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
