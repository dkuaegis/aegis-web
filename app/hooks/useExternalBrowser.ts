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

export type InAppBrowserKey = (typeof IN_APP_BROWSER_PATTERNS)[number]["key"];

const ANDROID_EXTERNAL_BROWSER_ATTEMPT_KEY =
  "aegis-web:android-external-browser-attempt";

export function detectInAppBrowser(userAgent: string): InAppBrowserKey | null {
  const normalizedUserAgent = userAgent.toLowerCase();
  return (
    IN_APP_BROWSER_PATTERNS.find(({ pattern }) =>
      normalizedUserAgent.includes(pattern)
    )?.key ?? null
  );
}

export function createAndroidIntentUrl(
  currentUrl: string,
  storage: Pick<Storage, "getItem" | "setItem">
): string | null {
  try {
    const url = new URL(currentUrl);
    const attemptUrl = `${url.origin}${url.pathname}${url.search}`;

    // If the intent falls back into this in-app browser, do not launch it again.
    if (storage.getItem(ANDROID_EXTERNAL_BROWSER_ATTEMPT_KEY) === attemptUrl) {
      return null;
    }
    storage.setItem(ANDROID_EXTERNAL_BROWSER_ATTEMPT_KEY, attemptUrl);

    const intentBody = url.host + url.pathname + url.search + url.hash;
    return (
      `intent://${intentBody}` +
      `#Intent;scheme=${url.protocol.slice(0, -1)};` +
      "action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;" +
      `S.browser_fallback_url=${encodeURIComponent(currentUrl)};end;`
    );
  } catch {
    // If storage is unavailable, prefer manual instructions to a redirect loop.
    return null;
  }
}

export function useExternalBrowser() {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [browserKey, setBrowserKey] = useState<InAppBrowserKey | null>(null);

  useEffect(() => {
    const detected = detectInAppBrowser(navigator.userAgent);

    setIsInAppBrowser(Boolean(detected));
    setBrowserKey(detected);
  }, []);

  const openInDefaultBrowser = useCallback(() => {
    if (!isInAppBrowser) return;

    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.includes("android");
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const currentUrl = window.location.href;

    if (isAndroid) {
      try {
        const intentUrl = createAndroidIntentUrl(
          currentUrl,
          window.sessionStorage
        );
        if (intentUrl) location.href = intentUrl;
      } catch {
        // If storage is unavailable, prefer manual instructions to a redirect loop.
      }
      return;
    }

    if (isIOS && browserKey === "kakaotalk") {
      location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`;
    }
  }, [isInAppBrowser, browserKey]);

  return { isInAppBrowser, browserKey, openInDefaultBrowser };
}
