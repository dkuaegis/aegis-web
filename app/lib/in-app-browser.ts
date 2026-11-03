import { useSyncExternalStore } from "react";

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
  // Naver's in-app token; a bare "naver" would also match its Yeti crawler.
  { pattern: "naver(inapp", key: "naver" },
  { pattern: "fban", key: "facebook" },
  { pattern: "fbav", key: "facebook" },
  // LINE's app token; a bare "line" matches unrelated user agents.
  { pattern: " line/", key: "line" },
  { pattern: "snapchat", key: "snapchat" },
  { pattern: "tiktok", key: "tiktok" },
  { pattern: "whatsapp", key: "whatsapp" },
] as const;

export type InAppBrowser = (typeof IN_APP_BROWSER_PATTERNS)[number]["key"];

const ANDROID_EXTERNAL_BROWSER_ATTEMPT_KEY =
  "aegis-web:android-external-browser-attempt";

/** Client only; the user agent never changes while the page is open. */
export function detectInAppBrowser(): InAppBrowser | null {
  const ua = navigator.userAgent.toLowerCase();
  return (
    IN_APP_BROWSER_PATTERNS.find(({ pattern }) => ua.includes(pattern))?.key ??
    null
  );
}

export function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/**
 * The in-app browser in use. The prerendered page cannot know, so it is built
 * (and hydrated) as null.
 */
export function useInAppBrowser(): InAppBrowser | null {
  return useSyncExternalStore(
    () => () => {},
    detectInAppBrowser,
    () => null
  );
}

/** Hands this page to the system browser where the platform allows it. */
export function openInDefaultBrowser(browser: InAppBrowser) {
  const currentUrl = window.location.href;

  if (/android/i.test(navigator.userAgent)) {
    const url = new URL(currentUrl);
    const attemptUrl = `${url.origin}${url.pathname}${url.search}`;

    // If the intent falls back into this in-app browser, do not launch it again.
    // If storage is unavailable, prefer showing the manual instructions to
    // risking a redirect loop.
    try {
      if (
        window.sessionStorage.getItem(ANDROID_EXTERNAL_BROWSER_ATTEMPT_KEY) ===
        attemptUrl
      ) {
        return;
      }
      window.sessionStorage.setItem(
        ANDROID_EXTERNAL_BROWSER_ATTEMPT_KEY,
        attemptUrl
      );
    } catch {
      return;
    }

    const intentBody = url.host + url.pathname + url.search + url.hash;
    location.href =
      `intent://${intentBody}` +
      `#Intent;scheme=${url.protocol.slice(0, -1)};` +
      "action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;" +
      `S.browser_fallback_url=${encodeURIComponent(currentUrl)};end;`;
    return;
  }

  if (isIOS() && browser === "kakaotalk") {
    location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(currentUrl)}`;
  }
}
