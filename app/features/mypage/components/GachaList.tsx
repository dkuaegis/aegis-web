import arrowIcon from "../assets/arrow.svg";
import pointIcon from "../assets/point.svg";
import questionIcon from "../assets/question.webp";
import "../style/GachaList.css";

const GachaList: React.FC = () => {
  return (
    <div className="gacha-list">
      <div className="gacha-item">
        <img src={pointIcon} alt="포인트 아이콘" className="point-icon" />
      </div>
      <img src={arrowIcon} alt="화살표 아이콘" className="arrow-icon" />
      <div className="gacha-item">
        <img src={questionIcon} alt="랜덤 아이콘" className="question-icon" />
      </div>
    </div>
  );
};

export default GachaList;
