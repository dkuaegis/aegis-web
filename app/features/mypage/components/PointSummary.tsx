import bagIcon from "../assets/pointBag.webp";
import type { PointSummaryProps } from "../model/PointSummary";
import "../style/PointSummary.css";

const PointSummary: React.FC<PointSummaryProps> = ({ point }) => {
  return (
    <div className="point-summary">
      <img src={bagIcon} alt="포인트 아이콘" className="bag-icon" />
      <div className="point-text">
        <p>
          현재 사용가능한 포인트
          <br />
          {point.toLocaleString()}점 있어요!
        </p>
      </div>
    </div>
  );
};

export default PointSummary;
