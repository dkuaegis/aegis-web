import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createAndroidIntentUrl,
  detectInAppBrowser,
  useExternalBrowser,
} from "./useExternalBrowser";

function setUserAgent(userAgent: string) {
  Object.defineProperty(navigator, "userAgent", {
    configurable: true,
    value: userAgent,
  });
}

afterEach(cleanup);

beforeEach(() => {
  window.sessionStorage.clear();
  setUserAgent("Mozilla/5.0");
});

describe("in-app browser detection", () => {
  it.each([
    ["Mozilla/5.0 KakaoTalk", "kakaotalk"],
    ["Mozilla/5.0 Instagram", "instagram"],
    ["Mozilla/5.0 EverytimeApp", "everytime"],
    ["Mozilla/5.0 Naver", "naver"],
    ["Mozilla/5.0 FBAN", "facebook"],
  ] as const)("detects %s", (userAgent, expected) => {
    expect(detectInAppBrowser(userAgent)).toBe(expected);
  });

  it("returns null for unknown browsers", () => {
    expect(detectInAppBrowser("Mozilla/5.0 Chrome/125")).toBeNull();
  });

  it("exposes the detected browser from the hook", () => {
    setUserAgent("Mozilla/5.0 Instagram");

    const { result } = renderHook(() => useExternalBrowser());

    expect(result.current.isInAppBrowser).toBe(true);
    expect(result.current.browserKey).toBe("instagram");
  });
});

describe("Android external-browser intent", () => {
  it("launches once for a URL and prevents a fallback redirect loop", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: vi.fn((key: string) => values.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => values.set(key, value)),
    };

    const first = createAndroidIntentUrl(
      "https://dkuaegis.org/study/algorithms?week=2#lecture",
      storage
    );

    expect(first).toContain(
      "intent://dkuaegis.org/study/algorithms?week=2#lecture"
    );
    expect(first).toContain("S.browser_fallback_url=");
    expect(
      createAndroidIntentUrl(
        "https://dkuaegis.org/study/algorithms?week=2#different-fragment",
        storage
      )
    ).toBeNull();
    expect(storage.setItem).toHaveBeenCalledTimes(1);
  });

  it("does not redirect if session storage is unavailable", () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new Error("storage disabled");
      }),
      setItem: vi.fn(),
    };

    expect(
      createAndroidIntentUrl("https://dkuaegis.org/study", storage)
    ).toBeNull();
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it("keeps the hook safe when Android session storage throws", () => {
    setUserAgent("Mozilla/5.0 (Linux; Android 14) KAKAOTALK");
    const { result } = renderHook(() => useExternalBrowser());
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });

    expect(() => {
      act(() => result.current.openInDefaultBrowser());
    }).not.toThrow();
  });
});
