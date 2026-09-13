import "../style/Card.css";
import { useI18n } from "@app/i18n";
import { useState } from "react";
import { IoHelpCircleOutline } from "react-icons/io5";
import couponIcon from "../assets/coupon.svg";
import coinIcon from "../assets/point.svg";
import { PRIZE_ICONS, prizeNameKey } from "../constants/prizes";
import type { CardProps } from "../model/Card";

const Card: React.FC<CardProps> = (props) => {
  const { t } = useI18n();
  const [showTooltip, setShowTooltip] = useState(false);

  // 포인트 카드
  if (props.type === "point") {
    const isPlus = props.amount > 0;
    return (
      <div className="card point-card">
        <img src={coinIcon} alt={t("mypage.points.coinAlt")} className="card-icon" />
        <div className="card-content">
          <div className="card-title">{props.title}</div>
          <div className="card-date">{props.date}</div>
        </div>
        <div className={`card-amount ${isPlus ? "plus" : "minus"}`}>
          {isPlus ? "+" : "-"}
          {Math.abs(props.amount).toLocaleString()}
          {t("mypage.points.unit")}
        </div>
      </div>
    );
  }
  // 쿠폰 카드
  if (props.type === "coupon") {
    const isUsed = props.status === "USED";
    return (
      <div className={`card coupon-card${isUsed ? " used" : ""}`}>
        <img
          src={couponIcon}
          alt={t("mypage.coupons.iconAlt")}
          className="card-icon"
        />
        <div className="card-content">
          <div className="card-title">{props.price}</div>
          <div className="card-desc">{props.desc}</div>
        </div>
        <div className={`card-coupon-status${isUsed ? " used" : ""}`}>
          {t(`mypage.coupons.status.${props.status}`)}
        </div>
      </div>
    );
  }
  // 뽑기내역 카드
  if (props.type === "history") {
    const prizeIcon = PRIZE_ICONS[props.title] ?? "";
    const prizeName = PRIZE_ICONS[props.title]
      ? t(prizeNameKey(props.title))
      : props.title;
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
                ? t("mypage.history.tooltip.energyDrink")
                : props.title === "CLUB_DUES_DISCOUNT_COUPON"
                  ? t("mypage.history.tooltip.discountCoupon")
                  : t("mypage.history.tooltip.default")}
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default Card;
