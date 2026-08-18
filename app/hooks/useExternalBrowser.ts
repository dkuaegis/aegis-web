import { useCallback, useEffect, useState } from "react";

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
] as const;

export function useExternalBrowser() {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [browserName, setBrowserName] = useState("인앱 브라우저");

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const detected = IN_APP_BROWSER_PATTERNS.find(({ pattern }) =>
      ua.includes(pattern)
    );

    setIsInAppBrowser(Boolean(detected));
    setBrowserName(detected?.name ?? "인앱 브라우저");
  }, []);

  const openInDefaultBrowser = useCallback(() => {
    if (!isInAppBrowser) return;

    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.includes("android");
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const currentUrl = window.location.href;

    if (isAndroid) {
      const url = new URL(currentUrl);
      const intentBody = url.host + url.pathname + url.search + url.hash;
      location.href =
        `intent://${intentBody}` +
        "#Intent;scheme=https;package=com.android.chrome;" +
        `S.browser_fallback_url=${encodeURIComponent(currentUrl)};end;`;
      return;
    }

    if (isIOS && browserName === "카카오톡") {
      location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`;
    }
  }, [isInAppBrowser, browserName]);

  return { isInAppBrowser, browserName, openInDefaultBrowser };
}
