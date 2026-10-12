import { describe, expect, it } from "vitest";
import { validateI18n } from "./check-i18n-core.mjs";

const korean = {
  home: {
    greeting: "Hello {{name}}",
    steps: ["First", "Second"],
  },
};
const english = {
  home: {
    greeting: "Hi {{name}}",
    steps: ["One", "Two"],
  },
};

function checkI18n(en = english, sourceFiles = []) {
  return validateI18n({
    locales: { ko: korean, en },
    sourceFiles,
  });
}

describe("translation validation", () => {
  it("accepts matching dictionaries and literal references", () => {
    const result = checkI18n(english, [
      { path: "home.tsx", source: 't("home.greeting"); tList("home.steps");' },
    ]);

    expect(result.problems).toEqual([]);
    expect(result.keyCount).toBe(2);
  });

  it("rejects missing and extra keys", () => {
    const result = checkI18n({
      home: {
        greeting: "Hi {{name}}",
        extra: "Unexpected",
      },
    });

    expect(result.problems).toContain("[en] missing key: home.steps");
    expect(result.problems).toContain("[en] extra key: home.extra");
  });

  it("rejects string/list shape mismatches", () => {
    const result = checkI18n({
      home: {
        greeting: "Hi {{name}}",
        steps: "Not a list",
      },
    });

    expect(result.problems).toContain(
      "[en] shape differs for home.steps: ko=list:2, en=string"
    );
  });

  it("rejects placeholder mismatches", () => {
    const result = checkI18n({
      home: {
        greeting: "Hi {{person}}",
        steps: ["One", "Two"],
      },
    });

    expect(result.problems).toContain(
      '[en] placeholders differ for home.greeting: expected "name", got "person"'
    );
  });

  it("rejects unknown literal translation references but ignores comments", () => {
    const result = checkI18n(english, [
      {
        path: "home.tsx",
        source: '// t("comment.example")\nt("home.missing");',
      },
    ]);

    expect(result.problems).toEqual([
      "[code] home.tsx references a key that does not exist: home.missing",
    ]);
  });
});
