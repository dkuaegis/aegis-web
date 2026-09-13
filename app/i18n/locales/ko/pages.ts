export const pages = {
  faq: {
    meta: { title: "FAQ - Aegis", description: "Aegis 자주 묻는 질문" },
    title: "자주 묻는 질문",
    subtitle: "가입하기 전 궁금한 내용을 먼저 확인해보세요.",
    items: {
      about: {
        question: "Aegis는 어떤 동아리인가요?",
        answer:
          "Aegis는 성장을 원하는 모두에게 열려있는 단국대학교 최고의 개발 · 보안 중앙동아리입니다.",
      },
      eligibility: {
        question: "모집 대상이 어떻게 되나요?",
        answer:
          "단국대학교 신입생, 재학생, 휴학생 모두 지원 가능합니다. 학년과 전공에 관계없이 보안과 개발에 관심이 있다면 누구나 환영합니다!",
      },
      skill: {
        question: "실력이 뛰어난 사람만 지원할 수 있나요?",
        answer:
          "아닙니다! 열정과 배우고자 하는 의지가 있다면 누구나 지원할 수 있습니다. 함께 성장하는 것이 저희 동아리의 목표입니다.",
      },
      activities: {
        question: "동아리 활동은 어떤게 있나요?",
        answer:
          "정기적인 스터디, 프로젝트 개발, CTF 대회 참가, 보안 세미나, 해커톤 등 다양한 활동을 진행하고 있습니다. 또한 선후배 간 멘토링을 통해 함께 성장하고 있습니다.",
      },
      fee: {
        question: "동아리 회비가 있나요?",
        answer:
          "네, 회비는 15,000원입니다. 회비는 동아리 운영 및 활동에 사용됩니다. 이전 운영진은 회비가 면제되니 문의해주세요.",
      },
      room: {
        question: "동아리방 위치는 어디인가요?",
        answer: "혜당관 530호 (우리은행 건물)입니다!",
      },
      more: {
        question: "더 궁금한 사항이 있어요",
        answer:
          "언제든지 dankook.aegis@gmail.com 또는 인스타그램 @dku_aegis로 문의해주세요. 친절하게 답변드리겠습니다!",
      },
    },
  },

  recruit: {
    meta: { title: "모집 안내 - Aegis", description: "Aegis 신입 모집 안내" },
    title: "모집 안내",
    subtitle: "Aegis에 함께할 멤버를 모집합니다.",
    cta: "가입하기",
    notice: {
      targetIconAlt: "프로필",
      targetLabel: "모집 대상:",
      targetValue: " 단국대학교 신입생, 재학생, 휴학생",
      targetSub:
        "학년과 전공에 관계없이 보안과 개발에 관심이 있다면 누구나 환영합니다!",
      emailIconAlt: "이메일",
      emailBody:
        "회원가입 과정에서 문제가 발생하면 언제든 문의란의 연락처로 문의주세요.",
      securityIconAlt: "보안",
      securityLead: "구글 로그인 과정에서 ",
      securityStrong: "403 에러",
      securityTail:
        "가 발생하시는 분은 링크를 복사하고 크롬이나 사파리에서 접속해주세요.",
      securitySub: "구글 보안 정책상 인앱 브라우저에서 로그인이 불가능 합니다.",
      feeIconAlt: "결제",
      feeLead: "회비는 ",
      feeStrong: "15,000원",
      feeTail: "입니다.",
      feeSub: "이전 운영진은 회비가 면제되니 문의란의 연락처로 문의주세요.",
    },
  },

  contact: {
    meta: { title: "Contact - Aegis", description: "Aegis 문의하기" },
    title: "문의",
    subtitle:
      "더 궁금한 질문이 있거나 후원을 원하신다면 언제든 연락해 주세요!",
    presidentLabel: "회장 권대근",
    copyPhone: "전화번호 복사",
  },

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
