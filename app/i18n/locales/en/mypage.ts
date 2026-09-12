export const mypage = {
  nav: { back: "<" },

  home: {
    pointIconAlt: "Points",
    giftbox: "Rewards",
    qrCode: "QR code",
  },

  profile: {
    editImage: "Change profile picture",
    greetingLine1: "Welcome!",
    greetingLine2: "Glad to have you at Aegis ❤",
    editTitle: "{{name}},\npick a profile picture",
    pagerLabel: "Page indicator",
    goToPage: "Go to page {{page}}",
    leave: "Close",
    save: "Save",
  },

  activity: {
    title: "Your activity",
    pointShop: "Point shop",
    ranking: "Ranking",
  },

  points: {
    title: "Points",
    unit: " pts",
    summaryLine1: "You have",
    summaryLine2: "{{point}} points to spend!",
    iconAlt: "Points icon",
    coinAlt: "Coin",
    tabs: { all: "All", earned: "Earned", spent: "Spent" },
    typeLabels: { EARN: "Earned", SPEND: "Spent" },
    dateFormat: "{{day}}/{{month}}/{{year}}",
  },

  coupons: {
    title: "Rewards",
    iconAlt: "Coupon",
    tabs: { all: "All", unused: "Unused", used: "Used" },
    status: { UNUSED: "Unused", USED: "Used" },
    priceFormat: "{{amount}} KRW",
  },

  history: {
    title: "Rewards",
    tabs: { history: "Draw history", coupons: "Coupons" },
    tooltip: {
      energyDrink:
        "Pick this up in the club room — Room 530, Hyedang Hall (the Woori Bank building)!",
      discountCoupon: "You can use this coupon when you register next semester!",
      default: "These are sent out as gift vouchers once a week!",
    },
  },

  emptyState: {
    point: "You don't have any points yet!",
    coupon: "You don't have any coupons yet!",
    history: "You haven't drawn anything yet!",
  },

  ranking: {
    title: "Ranking",
    participants: "{{count}} people taking part",
    scoreUnit: " pts",
    rankSuffix: "#{{rank}}",
  },

  pointShop: {
    title: "Point shop",
    teaser: "Every draw wins something!",
    heading: "{{name}}, trade 100 points\nfor one draw!",
    listDescription: [
      "Of the prizes you can draw,",
      "Hot Six is collected in the club room (Room 530, Hyedang Hall, the Woori Bank building),",
      "and coffee coupons, chicken and the rest arrive as gift vouchers.",
    ],
    exchange: "Trade points",
    pointIconAlt: "Points icon",
    arrowIconAlt: "Arrow icon",
    randomIconAlt: "Random icon",
  },

  gacha: {
    spin: "Draw!",
    spinning: "Drawing...",
    resultLabel: "Your draw",
    resultTitle: "Congratulations!",
    resultPrize: "🎊 You won {{prize}} 🎊",
    goToGiftbox: "Go to rewards",
    confirm: "Done",
    insufficientBalance: "You don't have enough points.",
    prizes: {
      COFFEE_LOW: "Compose Coffee americano",
      CLUB_DUES_DISCOUNT_COUPON: "Membership fee discount coupon",
      COFFEE_HIGH: "10,000 KRW Starbucks card",
      ENERGY_DRINK: "Hot Six",
      CHICKEN: "A whole fried chicken",
    },
  },

  qr: {
    title: "Your entry QR code",
    description: "Check in to an event by scanning this code.",
    refresh: "Refresh",
    refreshIconAlt: "Refresh",
    closeIconAlt: "Close",
    back: "Back to the previous screen",
  },

  login: {
    titleLine1: "One moment!",
    titleLine2: "Please sign in with",
    titleLine3: "your Dankook University",
    titleLine4: "Google account first",
    description: "If this is your first visit, please join the club first",
    join: "Join the club",
    google: "Sign in with Google",
  },

  unauthorized: {
    titleLine1: "One moment!",
    titleLine2: "Are you new to",
    titleLine3: "the Aegis club?",
    description: "Head to the sign-up page, or read more about us first",
    join: "Join the club",
    about: "About Aegis",
  },

  notFound: {
    titleLine1: "Oops!",
    titleLine2: "This page doesn't exist",
    description: "The page you were looking for isn't here",
    backHome: "Back to my page",
  },

  errors: {
    profileSave: "We could not save your profile picture.",
    qrIssue: "We could not generate a QR code.",
    rankingFetch: "We could not load the ranking.",
  },
} as const;
