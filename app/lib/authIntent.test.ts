import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  consumeLoginIntent,
  consumeLoginReturnTo,
  getLoginDestination,
  parseLoginIntent,
  parseStudyReturnTo,
  readLoginIntent,
  readLoginReturnTo,
  storeLoginIntent,
} from "./authIntent";

beforeEach(() => {
  window.sessionStorage.clear();
});

describe("parseLoginIntent", () => {
  it.each(["home", "join", "study", "qr"] as const)("accepts %s", (intent) => {
    expect(parseLoginIntent(intent)).toBe(intent);
  });

  it.each([
    null,
    "",
    "admin",
    "HOME",
    "study?returnTo=/study",
  ])("rejects %s", (value) => {
    expect(parseLoginIntent(value)).toBeNull();
  });
});

describe("parseStudyReturnTo", () => {
  it.each([
    ["/study", "/study"],
    ["/study/algorithms?week=2#lecture", "/study/algorithms?week=2#lecture"],
  ])("accepts safe study path %s", (value, expected) => {
    expect(parseStudyReturnTo(value)).toBe(expected);
  });

  it.each([
    null,
    "",
    "https://evil.example/study",
    "//evil.example/study",
    "/join",
    "/study/../join",
    "/\\evil.example/study",
  ])("rejects unsafe or non-study return path %s", (value) => {
    expect(parseStudyReturnTo(value)).toBeNull();
  });
});

describe("getLoginDestination", () => {
  it.each([
    [
      "study",
      "COMPLETED",
      "/study/algorithms?week=2",
      "/study/algorithms?week=2",
    ],
    ["study", "COMPLETED", "https://evil.example", "/study"],
    ["study", "PENDING", "/study/algorithms", "/join"],
    ["qr", "COMPLETED", null, "/mypage/qr"],
    ["qr", "PENDING", null, "/join"],
    ["join", "PENDING", null, "/join"],
    ["join", "COMPLETED", null, "/"],
    ["home", "PENDING", null, "/"],
  ] as const)("%s with %s status navigates to %s", (intent, status, returnTo, expected) => {
    expect(getLoginDestination(intent, status, returnTo)).toBe(expected);
  });
});

describe("login intent session storage", () => {
  it("stores, reads, and consumes the intent and safe return path", () => {
    storeLoginIntent("study", "/study/algorithms?week=2#lecture");

    expect(readLoginIntent()).toBe("study");
    expect(readLoginReturnTo()).toBe("/study/algorithms?week=2#lecture");
    expect(consumeLoginIntent()).toBe("study");
    expect(consumeLoginReturnTo()).toBe("/study/algorithms?week=2#lecture");
    expect(readLoginIntent()).toBeNull();
    expect(readLoginReturnTo()).toBeNull();
  });

  it("clears an old return path when a new path is rejected", () => {
    storeLoginIntent("study", "/study/algorithms");
    storeLoginIntent("study", "https://evil.example/");

    expect(readLoginIntent()).toBe("study");
    expect(readLoginReturnTo()).toBeNull();
  });

  it("continues safely when session storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });

    expect(() => storeLoginIntent("study", "/study")).not.toThrow();
    expect(readLoginIntent()).toBeNull();
  });
});
