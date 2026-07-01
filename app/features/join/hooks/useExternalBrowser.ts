import { useCallback, useEffect, useState } from "react";

/**
 * 카카오톡 인앱 브라우저 환경을 감지하고,
 * 기본 브라우저를 여는 기능을 제공하는 커스텀 훅
 * @returns { isKakaoInApp: boolean, openInDefaultBrowser: () => void }
 */
export function useExternalBrowser() {
  const [isKakaoInApp, setIsKakaoInApp] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트된 후에 navigator 객체에 접근
    const ua = navigator.userAgent.toLowerCase();
    setIsKakaoInApp(ua.includes("kakaotalk"));
  }, []);

  const openInDefaultBrowser = useCallback(() => {
    if (!isKakaoInApp) return;

    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.includes("android");

    // iOS 등 안드로이드가 아닌 환경에서는 자동 전환을 시도하지 않음
    if (!isAndroid) {
      return;
    }

    const currentUrl = window.location.href;

    // 안드로이드: Chrome intent를 사용하여 외부 브라우저로 전환
    // S.browser_fallback_url은 크롬이 설치되지 않았을 경우 fallback될 URL을 지정
    location.href =
      "intent://" +
      currentUrl.replace(/https?:\/\//i, "") +
      "#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=" +
      encodeURIComponent(currentUrl) +
      ";end;";
  }, [isKakaoInApp]);

  return { isKakaoInApp, openInDefaultBrowser };
}
