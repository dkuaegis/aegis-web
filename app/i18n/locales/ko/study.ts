export const study = {
  loading: {
    general: "로딩 중...",
    role: "권한 정보를 불러오는 중...",
    study: "스터디 정보를 불러오는 중...",
    members: "스터디원 정보를 불러오는 중...",
    applicants: "지원자 데이터를 불러오는 중...",
    attendance: "출석 데이터를 불러오는 중...",
    application: "지원서를 불러오는 중...",
    applicationShort: "불러오는 중...",
  },

  forbidden: {
    default: "권한이 없습니다.",
    edit: "이 스터디를 수정할 수 있는 권한이 없습니다.",
    members: "이 스터디의 스터디원을 관리할 수 있는 권한이 없습니다.",
    attendance: "이 스터디의 출석을 관리할 수 있는 권한이 없습니다.",
    applications: "이 스터디의 지원현황을 볼 수 있는 권한이 없습니다.",
  },

  invalidStudyId: "유효하지 않은 스터디 ID입니다.",

  labels: {
    categories: {
      LANGUAGE: "언어",
      WEB: "웹 개발",
      APPLICATION: "앱 개발",
      GAME: "게임",
      SECURITY: "보안",
      COMPUTER_SCIENCE: "CS",
      ARTIFICIAL_INTELLIGENCE: "AI",
      DATA_SCIENCE: "데이터",
      ETC: "기타",
    },
    levels: {
      BASIC: "입문",
      EASY: "초급",
      INTERMEDIATE: "중급",
      ADVANCED: "고급",
    },
    recruitmentMethods: {
      FCFS: "선착순",
      APPLICATION: "지원서",
    },
  },

  list: {
    participants: "{{current}}/{{max}}명",
    loadError: "스터디 목록을 불러오는데 실패했습니다.",
  },

  detail: {
    notFound: "스터디를 찾을 수 없습니다.",
    genericError: "오류가 발생했습니다.",
    about: "스터디 소개",
    curriculum: "커리큘럼",
    qualifications: "지원 자격",
    instructor: "스터디장",
    schedule: "일정",
    ownerActions: {
      attendance: "출석 관리",
    },
    badges: {
      participating: "참여 중",
    },
    attendance: {
      label: "출석코드",
      placeholder: "4자리 숫자",
      submit: "제출",
      submitting: "제출 중...",
      invalidLength: "4자리 숫자 출석코드를 입력해주세요.",
      success: "출석이 완료되었습니다!",
      failure: "출석 처리 중 오류가 발생했습니다.",
    },
  },

  application: {
    statusMessage: {
      approved: "스터디에 참여 중입니다!",
      rejected: "신청이 거절되었습니다.",
      rejectedSub: "다른 스터디를 찾아보세요.",
      pending: "스터디 신청이 검토 중입니다.",
    },
    form: {
      processing: "처리 중...",
      dialogTitle: "지원서 작성",
      dialogDescription: "지원 동기 및 각오를 작성해주세요.",
      placeholder:
        "스터디에 지원하는 이유와 목표, 각오 등을 자유롭게 작성해주세요.",
      submit: "제출",
      editDialogTitle: "지원서 수정",
      editDialogDescription:
        "기존 지원서 내용이 불러와졌습니다. 지원 동기 및 각오를 수정해주세요.",
      editSubmit: "수정 완료",
      editSubmitting: "수정 중...",
    },
    fcfs: {
      confirmTitle: "스터디 신청 확인",
      confirmDescription: "정말로 신청하시겠습니까?",
      confirmSubmit: "신청",
    },
    toast: {
      appliedFcfs: "지원이 완료되었습니다! 스터디에 참여하게 되었습니다.",
      appliedForm: "지원서가 제출되었습니다! 검토 후 결과를 알려드리겠습니다.",
      applyFailed: "지원 중 오류가 발생했습니다. 다시 시도해주세요.",
      updated: "지원서가 성공적으로 수정되었습니다.",
      updateFailed: "지원서 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
      reasonRequired: "지원 사유를 입력해주세요.",
      detailLoadFailed: "지원서 정보를 불러오는데 실패했습니다.",
    },
  },

  form: {
    titleLabel: "스터디명",
    titleRequired: "스터디명을 입력하세요.",
    titleMaxLength: "스터디명은 {{max}}자 이내로 입력해주세요.",
    categoryLabel: "카테고리",
    categoryPlaceholder: "카테고리를 선택하세요",
    categoryRequired: "카테고리를 선택하세요.",
    difficultyLabel: "난이도",
    difficultyPlaceholder: "난이도를 선택하세요",
    difficultyRequired: "난이도를 선택하세요.",
    introductionRequired: "스터디 소개를 입력하세요.",
    introductionMaxLength: "스터디 소개는 {{max}}자 이내로 입력해주세요.",

    participantsRange: "1~50명 사이로 입력하세요.",

    scheduleMaxLength: "스터디 일정은 {{max}}자 이내로 입력해주세요",

    curriculumSection: "커리큘럼",
    curriculumRequired: "커리큘럼 내용을 입력하세요.",
    curriculumAtLeastOne: "커리큘럼을 1개 이상 입력하세요.",
    requirementsSection: "지원 자격",
    requirementsRequired: "지원 자격 조건을 입력하세요.",
    requirementsAtLeastOne: "지원 자격을 1개 이상 입력하세요.",

    createSubmitting: "개설 중...",
    createConfirmTitle: "스터디 개설 확인",
    createConfirmDescription: "정말로 개설하시겠습니까?",
    createSuccess: "스터디가 성공적으로 개설되었습니다!",
    createError: "스터디 개설 중 오류가 발생했습니다.",

    editSubmit: "수정 완료",
    editSubmitting: "수정 중...",
    editConfirmTitle: "스터디 수정 확인",
    editConfirmDescription: "정말로 수정하시겠습니까?",
    editSuccess: "스터디가 성공적으로 수정되었습니다!",
    editError: "스터디 수정 중 오류가 발생했습니다.",
    editLoadError: "스터디 정보를 불러올 수 없습니다.",
    editModeCallbackMissing: "수정 모드에서는 onComplete 콜백이 필요합니다.",
  },

  members: {
    phoneCopied: "전화번호가 복사되었습니다!",
    loadError: "스터디원 정보를 불러오지 못했습니다.",
  },

  applications: {
    fcfsTitle: "선착순 모집 스터디입니다.",
    fcfsSubtitle: "지원 현황이 없습니다.",
    noApplicants: "해당 스터디의 지원자가 아직 없습니다.",
    filters: {
      all: "전체",
      pending: "검토 중",
      approved: "승인",
      rejected: "거절",
    },
    card: {
      statusPending: "검토 중",
      statusApproved: "승인",
      statusRejected: "거절",
      statusUnknown: "알 수 없음",
      viewApplication: "지원서 보기",
      dialogTitle: "{{name}}님의 지원서",
      loadFailed: "지원서를 불러오는 데 실패했습니다.",
      approve: "승인",
      reject: "거절",
      approveError: "지원서 승인 중 오류가 발생했습니다.",
      rejectError: "지원서 거절 중 오류가 발생했습니다.",
    },
  },

  attendance: {
    sessionColumn: "{{index}}회차",
    noData: "출석 데이터가 없습니다.",
    loadError: "출석 데이터를 불러오는데 실패했습니다.",
    generating: "생성 중...",
    generateShort: "생성",
    generateConfirmTitle: "출석 코드 생성 확인",
    generateConfirmDescription:
      "정말로 생성하시겠습니까? 생성된 출석 코드는 생성한 당일에만 유효합니다.",
    codeError: "출석 코드 발급에 실패했습니다.",
  },

  errors: {
    notInstructor: "스터디장이 아닙니다.",
    notMember: "스터디원이 아닙니다.",
    studyNotFound: "스터디를 찾을 수 없습니다.",
    applicationNotFound: "지원서를 찾을 수 없습니다.",
    badRequestData: "잘못된 요청 데이터입니다.",
    badRequest: "잘못된 요청입니다.",
    applicationsFetch: "지원자 목록을 불러오는 중 오류가 발생했습니다.",
    applicationFetch: "지원서를 불러오는 중 오류가 발생했습니다.",
    applicationApprove: "지원서 승인 중 오류가 발생했습니다.",
    applicationReject: "지원서 거절 중 오류가 발생했습니다.",
    invalidAttendanceCode: "잘못된 출석 코드입니다.",
    noSessionToday: "오늘 진행되는 세션이 없습니다.",
    alreadyAttended: "이미 출석이 완료되었습니다.",
    attendanceSubmit: "출석 처리 중 오류가 발생했습니다.",
    attendanceCodeIssue: "출석 코드 발급 중 오류가 발생했습니다.",
    attendanceFetch: "출석 정보를 불러오는 중 오류가 발생했습니다.",
    studyUpdate: "스터디 수정 중 오류가 발생했습니다.",
    notRecruitmentPeriod: "지원 기간이 아닙니다.",
    alreadyApplied: "이미 신청된 상태입니다.",
    enrollmentApply: "스터디 신청 중 오류가 발생했습니다.",
    enrollmentCancel: "신청 취소 중 오류가 발생했습니다.",
    applicationLookup: "지원서 조회 중 오류가 발생했습니다.",
    applicationUpdate: "지원서 수정 중 오류가 발생했습니다.",
    membersFetch: "스터디원 정보를 불러오지 못했습니다.",
    applySuccess: "지원이 완료되었습니다.",
    statusLookup: "스터디 상태 조회 중 오류",
  },
} as const;
