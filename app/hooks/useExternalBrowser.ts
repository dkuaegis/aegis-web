import { useCallback, useEffect, useState } from "react";

/**
 * `key` is a stable, language-independent id. The display name and the
 * "open this in a real browser" steps are looked up from the dictionary under
 * `pages.browserRedirect.names.<key>`, so adding a language never touches
 * this detection table.
 */
const IN_APP_BROWSER_PATTERNS = [
  { pattern: "kakaotalk", key: "kakaotalk" },
  { pattern: "instagram", key: "instagram" },
  { pattern: "everytimeapp", key: "everytime" },
  { pattern: "naver", key: "naver" },
  { pattern: "fban", key: "facebook" },
  { pattern: "fbav", key: "facebook" },
  { pattern: "line", key: "line" },
  { pattern: "snapchat", key: "snapchat" },
  { pattern: "tiktok", key: "tiktok" },
  { pattern: "whatsapp", key: "whatsapp" },
] as const;

export type InAppBrowserKey =
  (typeof IN_APP_BROWSER_PATTERNS)[number]["key"];

export function useExternalBrowser() {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [browserKey, setBrowserKey] = useState<InAppBrowserKey | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const detected = IN_APP_BROWSER_PATTERNS.find(({ pattern }) =>
      ua.includes(pattern)
    );

    setIsInAppBrowser(Boolean(detected));
    setBrowserKey(detected?.key ?? null);
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

    if (isIOS && browserKey === "kakaotalk") {
      location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`;
    }
  }, [isInAppBrowser, browserKey]);

  return { isInAppBrowser, browserKey, openInDefaultBrowser };
}
