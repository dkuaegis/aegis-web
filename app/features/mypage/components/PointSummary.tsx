import { useI18n } from "@app/i18n";
import bagIcon from "../assets/pointBag.webp";
import type { PointSummaryProps } from "../model/PointSummary";
import "../style/PointSummary.css";

const PointSummary: React.FC<PointSummaryProps> = ({ point }) => {
  const { t } = useI18n();

  return (
    <div className="point-summary">
      <img
        src={bagIcon}
        alt={t("mypage.points.iconAlt")}
        className="bag-icon"
      />
      <div className="point-text">
        <p>
          {t("mypage.points.summaryLine1")}
          <br />
          {t("mypage.points.summaryLine2", {
            point: point.toLocaleString(),
          })}
        </p>
      </div>
    </div>
  );
};

export default PointSummary;
