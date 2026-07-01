import type { RankingInfoProps } from "../model/Ranking";
import "../style/RankingInfo.css";

const RankingInfo: React.FC<RankingInfoProps> = ({ totalParticipants }) => {
  return (
    <div className="ranking-info-container">
      <p className="participants-text">총 {totalParticipants}명 참여중</p>
      <h1 className="ranking-title">TOP 10</h1>
    </div>
  );
};

export default RankingInfo;
