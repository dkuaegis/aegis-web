export const mypage = {
  metaTitle: "마이페이지",
  balance: "보유 포인트",
  pointUnit: "P",
  points: "{{amount}}P",
  qr: "QR 코드",

  hub: {
    greeting: "반가워요",
    name: "{{name}}님",
    canDraw: "지금 뽑을 수 있어요",
    drawsHint: "한 번에 {{cost}}P · 지금 포인트로 {{count}}번",
    progress: "{{amount}} / {{cost}}P",
    lastDraw: "최근 당첨 {{prize}}",
    total: "전체 {{count}}건",
    earnTitle: "포인트 모으는 방법",
    earn: {
      attend: {
        title: "스터디 출석",
        how: "스터디 시간에 출석 코드를 입력합니다",
      },
      lead: { title: "스터디 진행", how: "스터디장으로 스터디를 운영합니다" },
      event: {
        title: "동아리 활동 참여",
        how: "행사장에서 QR 코드를 보여 줍니다",
      },
    },
    coupons: "{{count}}장",
    couponsHint: "지금 사용할 수 있는 쿠폰",
    rankHint: "이번 학기 {{count}}명 중 · 누적 {{amount}}P",
    unranked: "포인트를 모으면 순위가 생깁니다.",
    loadFailed: "불러오지 못했습니다. 눌러서 다시 확인해 보세요.",
  },

  profile: {
    edit: "프로필 아이콘 바꾸기",
    title: "프로필 아이콘",
    description: "랭킹과 마이페이지에 보이는 아이콘입니다.",
    save: "저장",
    saved: "프로필 아이콘을 바꿨습니다.",
  },

  pointsPage: {
    metaTitle: "포인트 기록",
    earned: "누적 적립",
    spent: "사용",
    filterLabel: "기록 종류",
    filters: {
      ALL: "전체",
      EARN: "적립",
      SPEND: "사용",
    },
    empty: "아직 포인트 기록이 없습니다",
    emptyDescription: "동아리 활동에 참여하면 포인트가 쌓입니다.",
    emptyFiltered: "해당하는 기록이 없습니다",
  },

  coupons: {
    metaTitle: "쿠폰",
    redeemTitle: "쿠폰 코드 등록",
    redeemLabel: "쿠폰 코드",
    redeemPlaceholder: "받은 코드를 입력하세요",
    redeem: "등록",
    redeemed: "{{name}} 쿠폰을 등록했습니다.",
    redeemRequired: "쿠폰 코드를 입력해 주세요.",
    usage: "쿠폰은 회비를 낼 때 할인으로 사용할 수 있습니다.",
    discount: "{{amount}}원 할인",
    valid: "사용 가능",
    used: "사용함",
    issuedAt: "{{date}} 받음",
    empty: "가진 쿠폰이 없습니다",
    emptyDescription: "쿠폰 코드를 받았다면 위에서 등록하세요.",
  },

  shop: {
    metaTitle: "포인트샵",
    title: "꽝 없는 뽑기",
    description: "{{cost}}포인트로 한 번 뽑을 수 있습니다.",
    draw: "{{cost}}P로 뽑기",
    drawing: "뽑는 중",
    needMore: "{{amount}}P 더 모으면 뽑을 수 있어요",
    machineLabel: "뽑기 기계",
    drawsLeft: "지금 {{count}}번 뽑을 수 있어요",
    oddsTitle: "상품과 확률",
    resultTitle: "{{prize}} 당첨",
    again: "한 번 더 뽑기",
  },

  draws: {
    title: "뽑기 기록",
    empty: "아직 뽑은 상품이 없습니다",
    emptyDescription: "포인트샵에서 {{cost}}P로 뽑기를 해 보세요.",
  },

  prizes: {
    names: {
      ENERGY_DRINK: "핫식스",
      COFFEE_LOW: "컴포즈커피 아메리카노",
      CLUB_DUES_DISCOUNT_COUPON: "회비 할인 쿠폰",
      COFFEE_HIGH: "스타벅스 1만원권",
      CHICKEN: "치킨 한 마리",
    },
    delivery: {
      clubRoom: "동아리방(혜당관 530호)에서 받아 가세요.",
      nextDues: "다음 학기 회비를 낼 때 할인됩니다.",
      voucher: "매주 한 번 기프티콘으로 보내 드립니다.",
    },
  },

  ranking: {
    metaTitle: "랭킹",
    members: "{{count}}명 참여",
    rank: "{{rank}}위",
    me: "나",
    myRank: "내 순위",
    empty: "아직 순위가 없습니다",
  },

  qrPage: {
    metaTitle: "QR 코드",
    description: "운영진이 요청하면 이 화면을 보여 주세요.",
    imageAlt: "{{name}}님의 회원 QR 코드",
    expiresIn: "{{seconds}}초 뒤 새 코드로 바뀝니다",
    refresh: "새 코드 받기",
    back: "마이페이지",
  },
} as const;
