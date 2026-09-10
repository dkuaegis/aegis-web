import { useI18n } from "@app/i18n";
import type { RankingInfoProps } from "../model/Ranking";
import "../style/RankingInfo.css";

const RankingInfo: React.FC<RankingInfoProps> = ({ totalParticipants }) => {
  const { t } = useI18n();

  return (
    <div className="ranking-info-container">
      <p className="participants-text">
        {t("mypage.ranking.participants", { count: totalParticipants })}
      </p>
      <h1 className="ranking-title">TOP 10</h1>
    </div>
  );
};

export default RankingInfo;
