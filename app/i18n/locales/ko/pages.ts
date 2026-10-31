export const pages = {



  authContinue: {
    checking: "로그인 정보를 확인하고 있습니다.",
    failed: "로그인 상태를 확인하지 못했습니다.",
    retry: "다시 시도",
  },

  browserRedirect: {
    title: "{{browser}} 브라우저에서 접속 중",
    iosHint: "Safari에서 열어주세요",
    genericHint: "원활한 이용을 위해 외부 브라우저를 사용해주세요",
    support: "문제가 지속되면 동아리 운영진에게 문의해 주세요",
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
