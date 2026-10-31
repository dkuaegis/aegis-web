export const common = {
  languageToggleLabel: "언어 선택",
  address: "단국대학교 죽전캠퍼스 혜당관 530호",

  loading: "불러오는 중...",
  retry: "다시 시도",
  close: "닫기",
  cancel: "취소",
  back: "뒤로",
  save: "저장",
  confirm: "확인",
  copy: "복사",
  copied: "복사했습니다.",
  copyFailed: "복사하지 못했습니다. 직접 선택해서 복사해 주세요.",

  openMenu: "메뉴 열기",
  closeMenu: "메뉴 닫기",
  mainMenu: "주요 메뉴",
  mobileMainMenu: "모바일 주요 메뉴",

  site: {
    brandHome: "AEGIS 홈",
    skipLink: "본문으로 바로가기",
    footerLinks: "소셜 및 문의 링크",
    nav: {
      login: "로그인",
      join: "가입하기",
      continueJoin: "가입 이어하기",
      study: "스터디",
      mypage: "마이페이지",
    },
  },

  states: {
    loadFailed: "정보를 불러오지 못했습니다.",
    notFoundTitle: "찾는 페이지가 없습니다",
    notFoundDescription:
      "주소가 바뀌었거나 삭제된 페이지입니다. 홈에서 다시 찾아보세요.",
    forbiddenTitle: "볼 수 없는 페이지입니다",
    errorTitle: "문제가 생겼습니다",
    errorDescription:
      "잠시 후 다시 시도해 주세요. 계속되면 운영진에게 알려 주세요.",
    goHome: "홈으로",
    reload: "새로고침",
  },

  error: {
    badRequest: "입력 내용을 다시 확인해 주세요.",
    unauthorized: "로그인이 필요합니다.",
    forbidden: "이 작업을 수행할 권한이 없습니다.",
    notFound: "요청한 정보를 찾을 수 없습니다.",
    conflict: "이미 처리된 요청입니다.",
    network: "네트워크 연결을 확인한 뒤 다시 시도해 주세요.",
    timeout: "응답이 늦어지고 있습니다. 잠시 후 다시 시도해 주세요.",
    unknown: "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
  },

  /** Messages for the server's ErrorCode names, shared by every screen. */
  errorCode: {
    UNAUTHORIZED: "로그인이 필요합니다. 다시 로그인해 주세요.",
    FORBIDDEN: "이번 학기 회원만 이용할 수 있습니다.",
    MEMBER_SIGNUP_CLOSED: "지금은 가입 신청 기간이 아닙니다.",
    STUDY_CREATION_CLOSED: "지금은 스터디 개설 기간이 아닙니다.",
    STUDY_ENROLLMENT_CLOSED: "지금은 스터디 신청 기간이 아닙니다.",
    STUDY_NOT_FOUND: "스터디를 찾을 수 없습니다.",
    STUDY_FULL: "정원이 가득 찼습니다.",
    STUDY_MEMBER_NOT_INSTRUCTOR: "스터디장만 할 수 있는 작업입니다.",
    STUDY_MEMBER_NOT_PARTICIPANT: "이 스터디의 스터디원만 출석할 수 있습니다.",
    STUDY_APPLICATION_NOT_FOUND: "지원서를 찾을 수 없습니다.",
    STUDY_APPLICATION_ALREADY_EXISTS: "이미 참여했거나 지원한 스터디입니다.",
    STUDY_APPLICATION_ALREADY_APPROVED:
      "이미 승인된 지원서는 수정할 수 없습니다.",
    STUDY_APPLICATION_REASON_REQUIRED: "지원 이유를 입력해 주세요.",
    STUDY_SESSION_NOT_FOUND: "오늘은 출석 코드가 발급되지 않았습니다.",
    STUDY_ATTENDANCE_CODE_INVALID: "출석 코드가 맞지 않습니다.",
    STUDY_ATTENDANCE_ALREADY_MARKED: "오늘은 이미 출석했습니다.",
    POINT_INSUFFICIENT_BALANCE: "포인트가 부족합니다.",
    COUPON_CODE_NOT_FOUND: "없는 쿠폰 코드입니다.",
    COUPON_CODE_ALREADY_USED: "이미 사용된 쿠폰 코드입니다.",
    ISSUED_COUPON_ALREADY_USED: "이미 사용한 쿠폰이 포함되어 있습니다.",
    INVALID_ISSUED_COUPON_INCLUDED: "사용할 수 없는 쿠폰이 포함되어 있습니다.",
    PAYMENT_ALREADY_COMPLETED: "이미 회비 납부가 완료되었습니다.",
  },
} as const;
