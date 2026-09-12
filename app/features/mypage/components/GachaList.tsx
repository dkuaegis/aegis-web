import { useI18n } from "@app/i18n";
import arrowIcon from "../assets/arrow.svg";
import pointIcon from "../assets/point.svg";
import questionIcon from "../assets/question.webp";
import "../style/GachaList.css";

const GachaList: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="gacha-list">
      <div className="gacha-item">
        <img
          src={pointIcon}
          alt={t("mypage.pointShop.pointIconAlt")}
          className="point-icon"
        />
      </div>
      <img
        src={arrowIcon}
        alt={t("mypage.pointShop.arrowIconAlt")}
        className="arrow-icon"
      />
      <div className="gacha-item">
        <img
          src={questionIcon}
          alt={t("mypage.pointShop.randomIconAlt")}
          className="question-icon"
        />
      </div>
    </div>
  );
};

export default GachaList;
