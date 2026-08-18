import { useExternalBrowser } from "@app/hooks/useExternalBrowser";
import { useEffect, useState } from "react";

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
    setIsIOS(/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()));
  }, []);

  useEffect(() => {
    openInDefaultBrowser();
  }, [openInDefaultBrowser]);

  const instructions = IN_APP_INSTRUCTIONS[browserName];
  const steps = instructions?.steps ?? [
    "브라우저의 ⋯ 또는 ⋮ 버튼을 터치하세요",
    '메뉴에서 "다른 브라우저로 열기"를 선택하세요',
  ];

  return (
    <div className="wrap-break-word mx-10 flex h-screen flex-col items-center justify-center space-y-4">
      <h1 className="font-medium text-3xl">
        {browserName} 브라우저에서 접속 중
      </h1>
      <p className="text-muted-foreground text-xl">
        {isIOS
          ? "Safari에서 열어주세요"
          : "원활한 이용을 위해 외부 브라우저를 사용해주세요"}
      </p>

      <div className="w-full max-w-sm space-y-4">
        {steps.map((step, index) => (
          <div
            key={step}
            className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 p-4"
          >
            <div className="flex items-center gap-4">
              <div className="font-bold text-2xl text-gray-800">
                {String(index + 1).padStart(2, "0")}
              </div>
              <p className="text-left font-semibold text-base text-gray-900">
                {step}
              </p>
            </div>
          </div>
        ))}

        {instructions?.safariHint && (
          <p className="text-center text-gray-500 text-xs">
            {instructions.safariHint}
          </p>
        )}
      </div>

      <p className="text-center text-gray-500 text-sm">
        문제가 지속되면 동아리 운영진에게 문의해 주세요
      </p>
    </div>
  );
};

export default BrowserRedirectPage;
