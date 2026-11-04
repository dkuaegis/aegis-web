export const mypage = {
  metaTitle: "My page",
  balance: "Points",
  pointUnit: "P",
  points: "{{amount}}P",
  qr: "QR code",

  hub: {
    greeting: "Welcome back",
    name: "{{name}}",
    canDraw: "Ready to draw",
    drawsHint: "{{cost}}P each · {{count}} with your points",
    progress: "{{amount}} / {{cost}}P",
    lastDraw: "Last prize: {{prize}}",
    total: "{{count}} entries in total",
    earnTitle: "How to earn points",
    earn: {
      attend: {
        title: "Study attendance",
        how: "Enter the code during the session",
      },
      lead: { title: "Leading a study", how: "Run a study as its leader" },
      event: { title: "Club events", how: "Show your QR code at the event" },
    },
    coupons: "{{count}}",
    couponsHint: "Coupons you can use now",
    rankHint: "Out of {{count}} this semester · {{amount}}P earned",
    unranked: "Earn points to get a rank.",
    loadFailed: "Could not load this. Open it to try again.",
  },

  profile: {
    edit: "Change profile icon",
    title: "Profile icon",
    description: "Shown in the ranking and on your page.",
    save: "Save",
    saved: "Profile icon updated.",
  },

  pointsPage: {
    metaTitle: "Point history",
    earned: "Earned",
    spent: "Spent",
    filterLabel: "Type",
    filters: {
      ALL: "All",
      EARN: "Earned",
      SPEND: "Spent",
    },
    empty: "No points yet",
    emptyDescription: "Take part in club activities to earn points.",
    emptyFiltered: "Nothing here",
  },

  coupons: {
    metaTitle: "Coupons",
    redeemTitle: "Redeem a code",
    redeemLabel: "Coupon code",
    redeemPlaceholder: "Enter the code you received",
    redeem: "Redeem",
    redeemed: "Added the {{name}} coupon.",
    redeemRequired: "Enter a coupon code.",
    usage: "Coupons take money off your club dues.",
    discount: "₩{{amount}} off",
    valid: "Available",
    used: "Used",
    issuedAt: "Received {{date}}",
    empty: "No coupons",
    emptyDescription: "Got a code? Redeem it above.",
  },

  shop: {
    metaTitle: "Point shop",
    title: "Every draw wins",
    description: "One draw costs {{cost}} points.",
    draw: "Draw for {{cost}}P",
    drawing: "Drawing",
    needMore: "{{amount}}P more to draw",
    machineLabel: "Prize machine",
    drawsLeft: "{{count}} draws available",
    oddsTitle: "Prizes and odds",
    resultTitle: "{{prize}}",
    again: "Draw again",
  },

  draws: {
    title: "My prizes",
    empty: "No prizes yet",
    emptyDescription: "Try a draw in the point shop for {{cost}}P.",
  },

  prizes: {
    names: {
      ENERGY_DRINK: "Hot Six energy drink",
      COFFEE_LOW: "Compose Coffee Americano",
      CLUB_DUES_DISCOUNT_COUPON: "Club dues discount",
      COFFEE_HIGH: "₩10,000 Starbucks voucher",
      CHICKEN: "A whole chicken",
    },
    delivery: {
      clubRoom: "Pick it up in the club room (Hyedang Hall 530).",
      nextDues: "Comes off your dues next semester.",
      voucher: "Sent as a gift voucher once a week.",
    },
  },

  ranking: {
    metaTitle: "Ranking",
    members: "{{count}} members",
    rank: "#{{rank}}",
    me: "You",
    myRank: "Your rank",
    empty: "No ranking yet",
  },

  qrPage: {
    metaTitle: "QR code",
    description: "Show this screen when an organizer asks for it.",
    imageAlt: "Member QR code for {{name}}",
    expiresIn: "New code in {{seconds}}s",
    refresh: "Get a new code",
    back: "My page",
  },
} as const;
