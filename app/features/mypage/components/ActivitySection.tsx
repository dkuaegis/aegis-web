import { useI18n } from "@app/i18n";
import { useNavigate } from "react-router-dom";
import pointshopImg from "../assets/pointShop.webp";
import rankingImg from "../assets/ranking.webp";
import Button from "../components/Button";
import "../style/ActivitySection.css";

const ActivitySection: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="activity-section">
      <div className="activity-title">{t("mypage.activity.title")}</div>
      <div className="activity-button-group">
        <Button
          text={
            <span className="activity-btn-content">
              <img
                src={pointshopImg}
                alt={t("mypage.activity.pointShop")}
                className="activity-icon"
              />
              <span>{t("mypage.activity.pointShop")}</span>
            </span>
          }
          type="ACTIVITY"
          onClick={() => navigate("/mypage/category/pointshop")}
        />
        <Button
          text={
            <span className="activity-btn-content">
              <img
                src={rankingImg}
                alt={t("mypage.activity.ranking")}
                className="activity-icon"
              />
              <span>{t("mypage.activity.ranking")}</span>
            </span>
          }
          type="ACTIVITY"
          onClick={() => navigate("/mypage/category/ranking")}
        />
      </div>
    </div>
  );
};

export default ActivitySection;
