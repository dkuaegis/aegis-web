import "../style/GachaResultCard.css";
import { useI18n } from "@app/i18n";
import { PRIZE_ICONS, prizeNameKey } from "../constants/prizes";
import type { GachaResultCardProps } from "../model/Gacha";
import Button from "./Button";

export default function GachaResultCard({
  item,
  onClose,
}: GachaResultCardProps) {
  const { t } = useI18n();
  const { label } = item;

  // `label` is the API prize code. If it is one we know, the icon and the
  // translated name come from the shared prize table; anything unexpected is
  // shown as-is rather than blanked out.
  const img = item.imageSrc ?? PRIZE_ICONS[label] ?? "";
  const prizeName = PRIZE_ICONS[label] ? t(prizeNameKey(label)) : label;

  return (
    <div className="result-overlay" role="dialog" aria-modal="true">
      <div className="result-card">
        <p className="result-desc">{t("mypage.gacha.resultLabel")}</p>
        <h3 className="result-title">
          {t("mypage.gacha.resultTitle")} <br />
          {t("mypage.gacha.resultPrize", { prize: prizeName })}
        </h3>
        <div className="result-image-wrapper">
          {img && <img className="result-image" src={img} alt={prizeName} />}
        </div>
        <Button
          text={t("mypage.gacha.goToGiftbox")}
          type="GACHAHIS"
          onClick={() => {
            onClose();
            window.location.href = "/mypage/category/giftbox/history";
          }}
        />
        <Button
          text={t("mypage.gacha.confirm")}
          type="GACHASAVE"
          onClick={onClose}
        />
      </div>
    </div>
  );
}
