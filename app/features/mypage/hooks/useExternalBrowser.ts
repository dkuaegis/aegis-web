import { useCallback, useEffect, useState } from "react";

// 인앱 브라우저 식별을 위한 User Agent 패턴과 표시 이름
const IN_APP_BROWSER_PATTERNS = [
  { pattern: "kakaotalk", name: "카카오톡" },
  { pattern: "instagram", name: "인스타그램" },
  { pattern: "everytimeapp", name: "에브리타임" },
  { pattern: "naver", name: "네이버" },
  { pattern: "fban", name: "페이스북" },
  { pattern: "fbav", name: "페이스북" },
  { pattern: "line", name: "라인" },
  { pattern: "snapchat", name: "스냅챗" },
  { pattern: "tiktok", name: "틱톡" },
  { pattern: "whatsapp", name: "왓츠앱" },
];

export function useExternalBrowser(): {
  isInAppBrowser: boolean;
  browserName: string;
  openInDefaultBrowser: () => void;
} {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [browserName, setBrowserName] = useState<string>("인앱 브라우저");

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const detected = IN_APP_BROWSER_PATTERNS.find((browser) =>
      ua.includes(browser.pattern)
    );

    if (detected) {
      setIsInAppBrowser(true);
      setBrowserName(detected.name);
    } else {
      setIsInAppBrowser(false);
      setBrowserName("인앱 브라우저");
    }
  }, []);

  const openInDefaultBrowser = useCallback(() => {
    if (!isInAppBrowser) return;

    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.includes("android");

    if (!isAndroid) {
      return;
    }

    const currentUrl = window.location.href;

    location.href =
      "intent://" +
      currentUrl.replace(/https?:\/\//i, "") +
      "#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=" +
      encodeURIComponent(currentUrl) +
      ";end;";
  }, [isInAppBrowser]);

  return { isInAppBrowser, browserName, openInDefaultBrowser };
}
