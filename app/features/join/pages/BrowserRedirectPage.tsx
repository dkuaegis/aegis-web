import { Label } from "@join/components/ui/label";
import { useExternalBrowser } from "@join/hooks/useExternalBrowser";
import { useEffect } from "react";

const BrowserRedirectPage = () => {
  const { openInDefaultBrowser } = useExternalBrowser();

  useEffect(() => {
    openInDefaultBrowser();
  }, [openInDefaultBrowser]);

  return (
    <div className="wrap-break-word mx-10 flex h-screen flex-col items-center justify-center space-y-4">
      <Label className="text-3xl">카카오톡 브라우저에서 접속 중</Label>
      <Label className="text-muted-foreground text-xl">
        원활한 회원가입을 위해 외부 브라우저를 사용해주세요
      </Label>

      <div className="w-full max-w-sm space-y-4">
        {/* 1단계 */}
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 p-4">
          <div className="flex items-center gap-4">
            <div className="font-bold text-2xl text-gray-800">01</div>
            <div>
              <div className="text-left font-semibold text-base text-gray-900">
                더보기 버튼 터치
              </div>
              <div className="text-left text-gray-600 text-sm">
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

        {/* 2단계 */}
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
      </div>

      <div className="text-center text-gray-500 text-sm">
        <p>문제가 지속되면 동아리 운영진에게 문의해 주세요</p>
      </div>
    </div>
  );
};

export default BrowserRedirectPage;
