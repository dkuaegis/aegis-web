import type { PointShopItem, ProfileIcon } from "@app/api/generated/model";
import chicken from "@app/assets/prizes/chicken.svg";
import compose from "@app/assets/prizes/compose.svg";
import discountCoupon from "@app/assets/prizes/discountcoupon.svg";
import discountCouponThumb from "@app/assets/prizes/discountcoupon-thumb.svg";
import hotsix from "@app/assets/prizes/hotsix.svg";
import starbucks from "@app/assets/prizes/starbucks.svg";
import C from "@app/assets/profile-icons/C.svg";
import CPP from "@app/assets/profile-icons/CPP.svg";
import CSHARP from "@app/assets/profile-icons/CSHARP.svg";
import DART from "@app/assets/profile-icons/DART.svg";
import GOLANG from "@app/assets/profile-icons/GOLANG.svg";
import JAVA from "@app/assets/profile-icons/JAVA.svg";
import JS from "@app/assets/profile-icons/JS.svg";
import KOTLIN from "@app/assets/profile-icons/KOTLIN.svg";
import NONE from "@app/assets/profile-icons/NONE.svg";
import PHP from "@app/assets/profile-icons/PHP.svg";
import PYTHON from "@app/assets/profile-icons/PYTHON.svg";
import RUBY from "@app/assets/profile-icons/RUBY.svg";
import RUST from "@app/assets/profile-icons/RUST.svg";
import SWIFT from "@app/assets/profile-icons/SWIFT.svg";

export const PROFILE_ICONS: Record<ProfileIcon, string> = {
  NONE,
  C,
  CPP,
  CSHARP,
  DART,
  GOLANG,
  JAVA,
  JS,
  KOTLIN,
  PHP,
  PYTHON,
  RUBY,
  RUST,
  SWIFT,
};

/** Matches `PointShopService.DRAW_COST` on the server. */
export const DRAW_COST = 100;

interface Prize {
  icon: string;
  /** A square crop for small tiles, where the full picture is unreadable. */
  thumb?: string;
  /** Ball colour in the machine and swatch in the odds table. */
  color: string;
  /** `PointShopItem.weight` on the server, out of 1000. */
  weight: number;
  /** How the prize reaches the winner: `mypage.prizes.delivery.<key>`. */
  delivery: "clubRoom" | "nextDues" | "voucher";
}

/** Rarest last, like the odds table on the server. */
export const PRIZES: Record<PointShopItem, Prize> = {
  ENERGY_DRINK: {
    icon: hotsix,
    color: "#afc0ec",
    weight: 420,
    delivery: "clubRoom",
  },
  COFFEE_LOW: {
    icon: compose,
    color: "#e6d8b0",
    weight: 330,
    delivery: "voucher",
  },
  CLUB_DUES_DISCOUNT_COUPON: {
    icon: discountCoupon,
    thumb: discountCouponThumb,
    color: "#c6d69a",
    weight: 150,
    delivery: "nextDues",
  },
  COFFEE_HIGH: {
    icon: starbucks,
    color: "#e3ad9f",
    weight: 75,
    delivery: "voucher",
  },
  CHICKEN: {
    icon: chicken,
    color: "#ff4e1a",
    weight: 25,
    delivery: "voucher",
  },
};

export const PRIZE_CODES = Object.keys(PRIZES) as PointShopItem[];

export function prizeOdds(code: PointShopItem): string {
  return `${(PRIZES[code].weight / 10).toLocaleString(undefined, {
    maximumFractionDigits: 1,
  })}%`;
}
