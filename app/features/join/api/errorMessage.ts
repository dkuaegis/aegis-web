import type { ServerError } from "./types";

const ignoredErrors = [
  { url: "/auth/check", method: "GET", status: 401 },
  { url: "/auth/check", method: "GET", status: 404 },
  { url: "/payments", method: "POST", status: 409 },
];

const specificMessages: Record<
  string,
  Partial<Record<string, Record<number, string | null>>>
> = {
  // --- 회원 (Members) ---
  "/members": {
    GET: {
      404: "사용자 정보를 찾을 수 없습니다.",
    },
    POST: {
      400: "요청 데이터가 올바르지 않습니다. 입력 내용을 확인해주세요.",
      404: "사용자 정보를 찾을 수 없습니다.",
    },
  },

  // --- 설문 (Survey) ---
  "/survey": {
    GET: {
      404: "설문조사 답변을 찾을 수 없습니다.",
    },
    POST: {
      // 작성/수정
      400: "요청 데이터가 올바르지 않습니다. 답변을 확인해주세요.",
    },
  },

  // --- 결제 (Payments) ---
  "/payments": {
    POST: {
      // 생성
      400: "쿠폰이 해당 사용자에게 발급되지 않았습니다.",
      404: "학생 정보를 찾을 수 없습니다.",
    },
    PUT: {
      // 수정
      400: "쿠폰이 해당 사용자에게 발급되지 않았습니다.",
      404: "처리 대기(PENDING) 상태의 결제 정보를 찾을 수 없습니다.",
      409: "이미 완료되었거나 처리할 수 없는 상태의 결제입니다.",
    },
  },
  // --- 쿠폰 (Coupons) ---
  "/coupons/code": {
    POST: {
      400: "쿠폰 코드 형식이 올바르지 않습니다.",
      404: "존재하지 않는 쿠폰 코드입니다.",
      409: "이미 사용되었거나, 다른 계정에서 사용 중인 쿠폰 코드입니다.",
    },
  },

  // --- 디스코드 (Discord) ---
  "/discord/issue-verification-code": {
    POST: {
      404: "사용자 정보를 찾을 수 없습니다.",
      500: "인증 코드 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
    },
  },
  "/discord/myid": {
    GET: {
      404: "디스코드 연동 정보를 찾을 수 없습니다.",
    },
  },
};

const messagesByStatus: Record<number, string> = {
  400: "잘못된 요청입니다. 입력하신 내용을 다시 확인해주세요.",
  401: "인증이 만료되었습니다. 다시 로그인해주세요.",
  403: "접근 권한이 없습니다.",
  404: "요청하신 페이지나 데이터를 찾을 수 없습니다.",
  409: "데이터가 충돌되었습니다. 페이지를 새로고침 후 다시 시도해주세요.",
  429: "요청 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요.",
  500: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  502: "서버 게이트웨이에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  503: "서비스를 일시적으로 사용할 수 없습니다. 점검 중일 수 있으니 잠시 후 다시 시도해주세요.",
};

const isIgnoredError = (error: ServerError): boolean => {
  return ignoredErrors.some(
    (ignored) =>
      error.url.startsWith(ignored.url) &&
      error.method.toUpperCase() === ignored.method &&
      error.status === ignored.status
  );
};

// 기본 에러 메시지
const DEFAULT_ERROR_MESSAGE = "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

export default function getErrorMessage(error: ServerError): string {
  const { status, url, method } = error;

  // 무시할 에러인지 확인
  if (isIgnoredError(error)) {
    return "";
  }

  // 1. 특정 메시지가 있는지 먼저 확인
  for (const urlPattern in specificMessages) {
    if (url.startsWith(urlPattern)) {
      const messagesByMethod = specificMessages[urlPattern];
      const messagesForStatus = messagesByMethod[method.toUpperCase()];

      if (messagesForStatus?.[status]) {
        return messagesForStatus[status];
      }
    }
  }

  // 2. 특정 메시지가 없으면, 상태 코드에 맞는 기본 메시지를 반환
  return messagesByStatus[status] || DEFAULT_ERROR_MESSAGE;
}
