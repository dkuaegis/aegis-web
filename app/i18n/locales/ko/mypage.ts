export const mypage = {
  nav: { back: "<" },

  home: {
    pointIconAlt: "포인트",
    giftbox: "선물함",
    qrCode: "QR코드",
  },

  profile: {
    editImage: "프로필 이미지 변경",
    greetingLine1: "환영합니다!",
    greetingLine2: "Aegis와 함께해요❤",
    editTitle: "{{name}}님,\n프로필 이미지를 꾸며보세요",
    pagerLabel: "페이지 인디케이터",
    goToPage: "페이지 {{page}}로 이동",
    leave: "나가기",
    save: "저장",
  },

  activity: {
    title: "나의 활동",
    pointShop: "포인트샵",
    ranking: "랭킹",
  },

  points: {
    title: "포인트",
    unit: "점",
    summaryLine1: "현재 사용가능한 포인트",
    summaryLine2: "{{point}}점 있어요!",
    iconAlt: "포인트 아이콘",
    coinAlt: "동전",
    tabs: { all: "전체", earned: "적립", spent: "사용" },
    typeLabels: { EARN: "적립", SPEND: "사용" },
    dateFormat: "{{year}}년 {{month}}월 {{day}}일",
  },

  coupons: {
    title: "선물함",
    iconAlt: "쿠폰",
    tabs: { all: "전체", unused: "사용전", used: "사용완료" },
    status: { UNUSED: "사용전", USED: "사용완료" },
    priceFormat: "{{amount}}원",
  },

  history: {
    title: "선물함",
    tabs: { history: "뽑기내역", coupons: "쿠폰" },
    tooltip: {
      energyDrink: "동아리방(우리은행 건물 혜당관 530호)에서 수령가능해요!",
      discountCoupon: "지급받은 쿠폰은 다음 학기 등록에 사용할 수 있습니다!",
      default: "일주일에 한 번씩 기프티콘으로 일괄 지급해드립니다!",
    },
  },

  emptyState: {
    point: "현재 보유하고 있는 포인트가 없어요!",
    coupon: "현재 보유하고 있는 쿠폰이 없어요!",
    history: "현재 존재하는 뽑기내역이 없어요!",
  },

  ranking: {
    title: "랭킹",
    participants: "총 {{count}}명 참여중",
    scoreUnit: "점",
    rankSuffix: "{{rank}}등",
  },

  pointShop: {
    title: "포인트샵",
    teaser: "꽝없는 뽑기!",
    heading: "{{name}}님, 100포인트를\n뽑기 1회권으로 교환할 수 있어요!",
    listDescription: [
      "뽑기에서 나온 상품들 중",
      "핫식스는 동아리방(우리은행 건물 혜당관 530호)에서,",
      "커피 쿠폰, 치킨 등은 기프티콘으로 교환해드려요",
    ],
    exchange: "교환하기",
    pointIconAlt: "포인트 아이콘",
    arrowIconAlt: "화살표 아이콘",
    randomIconAlt: "랜덤 아이콘",
  },

  gacha: {
    spin: "뽑기 시작!",
    spinning: "추첨 중...",
    resultLabel: "포인트 뽑기 결과",
    resultTitle: "축하합니다!",
    resultPrize: "🎊 {{prize}} 당첨 🎊",
    goToGiftbox: "선물함으로 이동",
    confirm: "확인하기",
    insufficientBalance: "잔액이 부족합니다.",
    prizes: {
      COFFEE_LOW: "컴포즈커피 아메리카노",
      CLUB_DUES_DISCOUNT_COUPON: "회비 할인 쿠폰",
      COFFEE_HIGH: "스타벅스 1만원권",
      ENERGY_DRINK: "핫식스",
      CHICKEN: "치킨 한 마리",
    },
  },

  qr: {
    title: "입장을 위한 QR코드",
    description: "이용하려는 행사에 QR코드로 체크인하세요.",
    refresh: "새로 고침",
    refreshIconAlt: "새로고침",
    closeIconAlt: "닫기",
    back: "이전 화면으로 돌아가기",
  },

  login: {
    titleLine1: "잠깐!",
    titleLine2: "먼저 단국대학교",
    titleLine3: "구글 계정으로",
    titleLine4: "로그인 해주세요",
    description: "처음 방문하신다면, 동아리가입을 먼저 진행해주세요",
    join: "동아리가입하기",
    google: "Google로 로그인",
  },

  unauthorized: {
    titleLine1: "잠깐!",
    titleLine2: "Aegis 동아리가",
    titleLine3: "처음이신가요?",
    description: "동아리 가입 페이지 또는 소개 페이지로 이동해주세요",
    join: "동아리가입하기",
    about: "Aegis 소개",
  },

  notFound: {
    titleLine1: "이런!",
    titleLine2: "잘못된 접근이에요",
    description: "현재 페이지는 존재하지 않는 페이지에요",
    backHome: "메인페이지로 돌아가기",
  },

  errors: {
    profileSave: "프로필 아이콘 저장에 실패했습니다.",
    qrIssue: "QR 코드 발급에 실패했습니다.",
    rankingFetch: "랭킹 정보를 불러오지 못했습니다.",
  },
} as const;
