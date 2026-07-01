import { useNavigate } from "react-router-dom";
import notFoundImage from "../assets/notFoundImage.webp";
import Button from "../components/Button";
import "../style/Notfound.css";

const Notfound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-image">
        <img src={notFoundImage} alt="not found" />
      </div>
      <h1 className="notfound-title">
        이런!
        <br />
        잘못된 접근이에요
      </h1>
      <p className="notfound-desc">현재 페이지는 존재하지 않는 페이지에요</p>
      <Button
        text={"메인페이지로 돌아가기"}
        type={"BACKHOME"}
        onClick={() => navigate("/mypage")}
      />
    </div>
  );
};

export default Notfound;
