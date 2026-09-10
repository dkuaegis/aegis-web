// 각 가입 단계를 나타내는 문자열 배열
export const JOIN_STEPS: readonly string[] = [
  "agreement",
  "personal-info",
  "survey",
  "chat",
  "payment",
] as const;

// 각 단계의 타입을 추론
export type JoinStep = (typeof JOIN_STEPS)[number];

/**
 * 단계 이름은 언어별 사전(`join.steps.<step>`)에서 가져옵니다.
 * 이 헬퍼는 키를 만드는 곳을 한 군데로 모아 둡니다.
 */
export const joinStepLabelKey = (step: string) => `join.steps.${step}`;
