interface ConsentState {
  regulations: boolean;
  privacy: boolean;
}

interface Chapter {
  /** 사전 키(`join.regulation.chapters.<id>`)이자 React key입니다. */
  id: string;
  /** 이 장에 속한 조항 번호. 본문은 사전에서 가져옵니다. */
  articles: readonly number[];
}

/**
 * 회칙의 구조만 담습니다. 장 제목과 조항 본문은 번역 대상이므로
 * `app/i18n/locales/<lang>/join.ts`의 `regulation.chapters`에 있습니다.
 */
const chapters: readonly Chapter[] = [
  { id: "general", articles: [1, 2] },
  { id: "membership", articles: [3, 4, 5, 6] },
  { id: "operating", articles: [7, 8, 9, 10, 11] },
  { id: "disciplinary", articles: [12, 13] },
  { id: "accounting", articles: [14, 15] },
  { id: "privacy", articles: [16] },
] as const;

export type { Chapter, ConsentState };
export { chapters };
