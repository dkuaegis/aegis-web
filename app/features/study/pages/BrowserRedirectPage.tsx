import { Label } from "@study/components/ui/label";
import { useExternalBrowser } from "@study/hooks/useExternalBrowser";
import { useEffect, useState } from "react";

// 인앱 브라우저별 Safari에서 열기 안내
const IN_APP_INSTRUCTIONS: Record<
  string,
  { steps: string[]; safariHint?: string }
> = {
  카카오톡: {
    steps: [
      '채팅방 상단의 "⋮" (더보기) 버튼을 터치하세요',
      '"다른 브라우저로 열기"를 선택하세요',
    ],
    safariHint: "또는 링크를 길게 눌러 복사한 후 Safari에서 붙여넣기하세요",
  },
  인스타그램: {
    steps: [
      '게시물 상단의 "⋯" 버튼을 터치하세요',
      '"링크 복사"를 선택하세요',
      "Safari를 열고 주소창에 붙여넣기하세요",
    ],
  },
  네이버: {
    steps: [
      '상단의 "⋮" 또는 "⋯" 버튼을 터치하세요',
      '"다른 브라우저로 열기"를 선택하세요',
    ],
  },
  페이스북: {
    steps: [
      '게시물 상단의 "⋯" 버튼을 터치하세요',
      '"링크 복사"를 선택하세요',
      "Safari를 열고 주소창에 붙여넣기하세요",
    ],
  },
  라인: {
    steps: [
      '채팅방 상단의 "⋮" (더보기) 버튼을 터치하세요',
      '"다른 브라우저로 열기"를 선택하세요',
    ],
  },
};

const BrowserRedirectPage = () => {
  const { browserName, openInDefaultBrowser } = useExternalBrowser();
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
  }, []);

  useEffect(() => {
    openInDefaultBrowser();
  }, [openInDefaultBrowser]);

  const instructions = IN_APP_INSTRUCTIONS[browserName];

  return (
    <div className="wrap-break-word mx-10 flex h-screen flex-col items-center justify-center space-y-4">
      <Label className="text-3xl">{browserName} 브라우저에서 접속 중</Label>

      <Label className="text-muted-foreground text-xl">
        {isIOS
          ? "Safari에서 열어주세요"
          : "원활한 회원가입을 위해 외부 브라우저를 사용해주세요"}
      </Label>

      <div className="w-full max-w-sm space-y-4">
        {instructions?.steps.map((step, i) => (
          <div
            key={step}
            className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 p-4"
          >
            <div className="flex items-center gap-4">
              <div className="font-bold text-2xl text-gray-800">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="text-left font-semibold text-base text-gray-900">
                  {step}
                </div>
              </div>
            </div>
          </div>
        ))}

        {instructions?.safariHint && (
          <p className="text-center text-gray-500 text-xs">
            {instructions.safariHint}
          </p>
        )}

        {!instructions && (
          <>
            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 p-4">
              <div className="flex items-center gap-4">
                <div className="font-bold text-2xl text-gray-800">01</div>
                <div>
                  <div className="text-left font-semibold text-base text-gray-900">
                    브라우저의{" "}
                    <span className="rounded bg-gray-200 px-1.5 py-0.5 font-mono">
                      ⋯
                    </span>{" "}
                    또는{" "}
                    <span className="rounded bg-gray-200 px-1.5 py-0.5 font-mono">
                      ⋮
                    </span>{" "}
                    버튼을 터치하세요
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-gray-100 p-4">
              <div className="flex items-center gap-4">
                <div className="font-bold text-2xl text-gray-800">02</div>
                <div>
                  <div className="text-left font-semibold text-base text-gray-900">
                    다른 브라우저로 열기
                  </div>
                  <div className="text-left text-gray-600 text-sm">
                    메뉴에서{" "}
                    <span className="font-bold text-gray-800">
                      "다른 브라우저로 열기"
                    </span>
                    를 선택하세요
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="text-center text-gray-500 text-sm">
        <p>문제가 지속되면 동아리 운영진에게 문의해 주세요</p>
      </div>
    </div>
  );
};

export default BrowserRedirectPage;
