import { httpClient } from "@join/api/api";
import Rocket from "@join/assets/lottie/Rocket.json";
import KakaoLinkButton from "@join/components/ui/custom/kakao-link-button";
import { Analytics } from "@join/service/analytics";
import { usePersonalInfoStore } from "@join/stores/personalInfoStore";
import lottie from "lottie-web";
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
  const lottieContainerRef = useRef<HTMLDivElement>(null);

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
        const profile = await httpClient.get<RequiredMemberInfo>("/members");
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

  useEffect(() => {
    if (!lottieContainerRef.current) return;
    const animation = lottie.loadAnimation({
      container: lottieContainerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: Rocket,
    });
    return () => {
      animation.destroy();
    };
  }, []);

  return (
    <Wrapper>
      <div
        ref={lottieContainerRef}
        style={{ width: 240, height: 240, margin: "0 auto" }}
      />
      <p className="mt-4 font-bold text-3xl">등록이 완료됐어요</p>
      <CompleteNotice />
      <div className="flex flex-col gap-3">
        <KakaoLinkButton
          text="공지방 가입하기"
          url={NOTICE_ROOM_URL}
          onClick={() => {
            Analytics.safeTrack("Complete_Notice_Room_Click", {
              category: "Complete",
            });
          }}
        />
        <KakaoLinkButton
          text="소통방 가입하기"
          url={COMMUNITY_ROOM_URL}
          onClick={() => {
            Analytics.safeTrack("Complete_Community_Room_Click", {
              category: "Complete",
            });
          }}
        />
      </div>
    </Wrapper>
  );
};

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto mt-16 mb-8 w-full max-w-md space-y-4 px-4 py-8 pb-28 text-center">
      {children}
    </div>
  );
};

export default JoinComplete;
