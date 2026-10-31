export const pages = {
  login: {
    metaTitle: "로그인",
    eyebrow: "Google 로그인",
    redirecting: "Google 로그인 화면으로 이동하고 있습니다.",
    manual: "이동하지 않으면 여기를 누르세요",
  },

  authContinue: {
    checking: "로그인 정보를 확인하고 있습니다.",
    failed: "로그인 상태를 확인하지 못했습니다.",
    retry: "다시 시도",
  },

  notFound: {
    title: "페이지를 찾을 수 없습니다.",
    home: "홈으로 가기",
  },

  appError: {
    title: "페이지를 표시하는 중 문제가 발생했습니다.",
    reload: "새로고침",
  },

  browserRedirect: {
    title: "{{browser}} 안에서 열려 있습니다",
    copyLink: "주소 복사",
    iosHint: "로그인과 결제가 막힐 수 있어 Safari에서 열어야 합니다.",
    genericHint:
      "로그인과 결제가 막힐 수 있어 기본 브라우저에서 열어야 합니다.",
    support: "계속 열리지 않으면 동아리 운영진에게 알려 주세요.",
    names: {
      inApp: "인앱 브라우저",
      kakaotalk: "카카오톡",
      instagram: "인스타그램",
      everytime: "에브리타임",
      naver: "네이버",
      facebook: "페이스북",
      line: "라인",
      snapchat: "스냅챗",
      tiktok: "틱톡",
      whatsapp: "왓츠앱",
    },
    steps: {
      fallback: [
        "브라우저의 ⋯ 또는 ⋮ 버튼을 터치하세요",
        '메뉴에서 "다른 브라우저로 열기"를 선택하세요',
      ],
      kakaotalk: [
        '채팅방 상단의 "⋮" (더보기) 버튼을 터치하세요',
        '"다른 브라우저로 열기"를 선택하세요',
      ],
      instagram: [
        '게시물 상단의 "⋯" 버튼을 터치하세요',
        '"링크 복사"를 선택하세요',
        "Safari를 열고 주소창에 붙여넣기하세요",
      ],
      naver: [
        '상단의 "⋮" 또는 "⋯" 버튼을 터치하세요',
        '"다른 브라우저로 열기"를 선택하세요',
      ],
      facebook: [
        '게시물 상단의 "⋯" 버튼을 터치하세요',
        '"링크 복사"를 선택하세요',
        "Safari를 열고 주소창에 붙여넣기하세요",
      ],
      line: [
        '채팅방 상단의 "⋮" (더보기) 버튼을 터치하세요',
        '"다른 브라우저로 열기"를 선택하세요',
      ],
    },
    safariHint: {
      kakaotalk: "또는 링크를 길게 눌러 복사한 후 Safari에서 붙여넣기하세요",
    },
  },
} as const;
