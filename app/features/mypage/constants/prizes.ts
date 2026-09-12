import chickenIcon from "../assets/prizes/chicken.svg";
import composeIcon from "../assets/prizes/compose.svg";
import discountCouponIcon from "../assets/prizes/discountcoupon.svg";
import hotsixIcon from "../assets/prizes/hotsix.svg";
import starbucksIcon from "../assets/prizes/starbucks.svg";

/**
 * 상품 코드는 API 계약입니다. 아이콘만 여기에 두고, 상품 이름은
 * 언어별 사전(`mypage.gacha.prizes.<code>`)에서 가져옵니다.
 */
export const PRIZE_ICONS: Record<string, string> = {
  COFFEE_LOW: composeIcon,
  CLUB_DUES_DISCOUNT_COUPON: discountCouponIcon,
  COFFEE_HIGH: starbucksIcon,
  ENERGY_DRINK: hotsixIcon,
  CHICKEN: chickenIcon,
};

export const PRIZE_CODES = Object.keys(PRIZE_ICONS);

export const prizeNameKey = (code: string) => `mypage.gacha.prizes.${code}`;
