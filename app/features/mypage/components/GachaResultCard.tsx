import "../style/GachaResultCard.css";
import ImgPrize5 from "../assets/prizes/chicken.svg";
import ImgPrize2 from "../assets/prizes/compose.svg";
import ImgPrize3 from "../assets/prizes/discountcoupon.svg";
import ImgPrize1 from "../assets/prizes/hotsix.svg";
import ImgPrize4 from "../assets/prizes/starbucks.svg";
import type { GachaResultCardProps } from "../model/Gacha";
import Button from "./Button";

const PRIZE_CODE_MAP: Record<string, { name: string; icon: string }> = {
  COFFEE_LOW: { name: "컴포즈커피 아메리카노", icon: ImgPrize2 },
  CLUB_DUES_DISCOUNT_COUPON: { name: "회비 할인 쿠폰", icon: ImgPrize3 },
  COFFEE_HIGH: { name: "스타벅스 1만원권", icon: ImgPrize4 },
  ENERGY_DRINK: { name: "핫식스", icon: ImgPrize1 },
  CHICKEN: { name: "치킨 한 마리", icon: ImgPrize5 },
};

function resolvePrizeImage(label: string, explicit?: string) {
  if (explicit) return explicit;

  // API 코드로 매핑 시도
  const codeMapping = PRIZE_CODE_MAP[label];
  if (codeMapping) return codeMapping.icon;

  // 상품명으로 매핑 시도
  const nameMapping = Object.values(PRIZE_CODE_MAP).find(
    (item) => item.name === label
  );
  return nameMapping?.icon || "";
}

function resolvePrizeName(label: string): string {
  // 먼저 API 코드로 매핑 시도
  const codeMapping = PRIZE_CODE_MAP[label];
  if (codeMapping) return codeMapping.name;

  // 이미 상품명이면 그대로 반환
  return label;
}

export default function GachaResultCard({
  item,
  onClose,
}: GachaResultCardProps) {
  const { label } = item;
  const img = resolvePrizeImage(label);
  const prizeName = resolvePrizeName(label);

  return (
    <div className="result-overlay" role="dialog" aria-modal="true">
      <div className="result-card">
        <p className="result-desc">포인트 뽑기 결과</p>
        <h3 className="result-title">
          축하합니다! <br />🎊 {prizeName} 당첨 🎊
        </h3>
        <div className="result-image-wrapper">
          {img && <img className="result-image" src={img} alt={prizeName} />}
        </div>
        <Button
          text="선물함으로 이동"
          type="GACHAHIS"
          onClick={() => {
            onClose();
            window.location.href = "/mypage/category/giftbox/history";
          }}
        />
        <Button text="확인하기" type="GACHASAVE" onClick={onClose} />
      </div>
    </div>
  );
}
