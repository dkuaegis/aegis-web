import "../style/Card.css";
import { useState } from "react";
import { IoHelpCircleOutline } from "react-icons/io5";
import couponIcon from "../assets/coupon.svg";
import coinIcon from "../assets/point.svg";
import chickenIcon from "../assets/prizes/chicken.svg";
import composeIcon from "../assets/prizes/compose.svg";
import discountCouponIcon from "../assets/prizes/discountcoupon.svg";
import hotsixIcon from "../assets/prizes/hotsix.svg";
import starbucksIcon from "../assets/prizes/starbucks.svg";
import type { CardProps } from "../model/Card";

const PRIZE_CODE_MAP: Record<string, { name: string; icon: string }> = {
  COFFEE_LOW: { name: "컴포즈커피 아메리카노", icon: composeIcon },
  CLUB_DUES_DISCOUNT_COUPON: {
    name: "회비 할인 쿠폰",
    icon: discountCouponIcon,
  },
  COFFEE_HIGH: { name: "스타벅스 1만원권", icon: starbucksIcon },
  ENERGY_DRINK: { name: "핫식스", icon: hotsixIcon },
  CHICKEN: { name: "치킨 한 마리", icon: chickenIcon },
};

const getPrizeIcon = (itemCode: string): string => {
  return PRIZE_CODE_MAP[itemCode]?.icon || "";
};

const getPrizeName = (itemCode: string): string => {
  return PRIZE_CODE_MAP[itemCode]?.name || itemCode;
};

const Card: React.FC<CardProps> = (props) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // 포인트 카드
  if (props.type === "point") {
    const isPlus = props.amount > 0;
    return (
      <div className="card point-card">
        <img src={coinIcon} alt="동전" className="card-icon" />
        <div className="card-content">
          <div className="card-title">{props.title}</div>
          <div className="card-date">{props.date}</div>
        </div>
        <div className={`card-amount ${isPlus ? "plus" : "minus"}`}>
          {isPlus ? "+" : "-"}
          {Math.abs(props.amount).toLocaleString()}점
        </div>
      </div>
    );
  }
  // 쿠폰 카드
  if (props.type === "coupon") {
    const isUsed = props.status === "사용완료";
    return (
      <div className={`card coupon-card${isUsed ? " used" : ""}`}>
        <img src={couponIcon} alt="쿠폰" className="card-icon" />
        <div className="card-content">
          <div className="card-title">{props.price}</div>
          <div className="card-desc">{props.desc}</div>
        </div>
        <div className={`card-coupon-status${isUsed ? " used" : ""}`}>
          {props.status}
        </div>
      </div>
    );
  }
  // 뽑기내역 카드
  if (props.type === "history") {
    const prizeIcon = getPrizeIcon(props.title);
    const prizeName = getPrizeName(props.title);
    return (
      <div className="card history-card">
        <img src={prizeIcon} alt={prizeName} className="card-icon" />
        <div className="card-content">
          <div className="history-card card-title">{prizeName}</div>
          <div className="history-card card-date">{props.date}</div>
        </div>
        <div className="help-icon-container">
          <IoHelpCircleOutline
            size={24}
            className="help-icon"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <div className="tooltip">
              {props.title === "ENERGY_DRINK"
                ? "동아리방(우리은행 건물 혜당관 530호)에서 수령가능해요!"
                : props.title === "CLUB_DUES_DISCOUNT_COUPON"
                  ? "지급받은 쿠폰은 다음 학기 등록에 사용할 수 있습니다!"
                  : "일주일에 한 번씩 기프티콘으로 일괄 지급해드립니다!"}
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default Card;
