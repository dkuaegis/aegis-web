import { api } from "@app/lib/api";
import { Analytics } from "@join/service/analytics";
import { usePersonalInfoStore } from "@join/stores/personalInfoStore";
import { CheckCircle2, ExternalLink, MessageCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import CompleteNotice from "./JoinComplete.Notice";

const NOTICE_ROOM_URL = import.meta.env.VITE_KAKAO_NOTICEROOM_URL;
const COMMUNITY_ROOM_URL = import.meta.env.VITE_KAKAO_COMMUNITYROOM_URL;

interface RequiredMemberInfo {
  studentId: string;
  name: string;
}

const JoinComplete = () => {
  const studentId = usePersonalInfoStore((s) => s.personalInfoData?.studentId);
  const identifiedRef = useRef(false);

  useEffect(() => {
    Analytics.safeTrack("Complete_View", { category: "Complete" });

    if (identifiedRef.current) return;

    const identify = async () => {
      try {
        if (studentId) {
          Analytics.identifyStudent(studentId);
          identifiedRef.current = true;
          return;
        }
        const profile = await api.get<RequiredMemberInfo>("/members");
        if (profile.studentId) {
          Analytics.identifyStudent(String(profile.studentId), profile.name);
          identifiedRef.current = true;
        }
      } catch (e) {
        if (import.meta.env.VITE_ENV === "development") {
          console.warn("identifyStudent on Complete failed:", e);
        }
      }
    };

    void identify();
  }, [studentId]);

  return (
    <Wrapper>
      <div className="join-complete-mark">
        <CheckCircle2 aria-hidden="true" />
      </div>
      <h1>가입이 완료되었습니다.</h1>
      <CompleteNotice />
      <div className="join-next-step-grid">
        <a
          href={NOTICE_ROOM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            Analytics.safeTrack("Complete_Notice_Room_Click", {
              category: "Complete",
            });
          }}
          className="join-next-step-card"
        >
          <MessageCircle aria-hidden="true" />
          <span>
            <strong>카카오톡 공지방</strong>
            <small>주요 공지와 활동 일정을 확인하세요</small>
          </span>
          <ExternalLink aria-hidden="true" />
        </a>
        <a
          href={COMMUNITY_ROOM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            Analytics.safeTrack("Complete_Community_Room_Click", {
              category: "Complete",
            });
          }}
          className="join-next-step-card"
        >
          <MessageCircle aria-hidden="true" />
          <span>
            <strong>카카오톡 소통방</strong>
            <small>회원들과 자유롭게 소통하세요</small>
          </span>
          <ExternalLink aria-hidden="true" />
        </a>
      </div>
    </Wrapper>
  );
};

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="join-page-shell join-complete-page">
      <main className="join-complete-card">{children}</main>
    </div>
  );
};

export default JoinComplete;
