// 각 가입 단계를 나타내는 문자열 배열
export const JOIN_STEPS: readonly string[] = [
  "agreement",
  "personal-info",
  "survey",
  "payment",
] as const;

// 각 단계의 타입을 추론
type JoinStep = (typeof JOIN_STEPS)[number];

// 각 단계별 한글 이름을 매핑하는 객체
export const JOIN_STEP_KOREAN_MAP: { [key in JoinStep]: string } = {
  agreement: "회칙 동의",
  "personal-info": "기본 인적사항",
  survey: "가입 설문",
  payment: "회비 납부",
};
