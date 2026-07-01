import UnAuthImage from "../assets/UnAuthorizedImage.webp";
import Button from "../components/Button";
import "../style/UnAuthorized.css";

const UnAuthorized = () => {
  return (
    <div className="login-unauth-container">
      <div className="login-unauth-image">
        <img src={UnAuthImage} alt="login unauth" />
      </div>
      <h1 className="login-unauth-title">
        잠깐!
        <br />
        Aegis 동아리가
        <br />
        처음이신가요?
      </h1>
      <p className="login-unauth-desc">
        동아리 가입 페이지 또는 소개 페이지로 이동해주세요
      </p>
      <div className="button-group-section">
        <Button
          text={"동아리가입하기"}
          type={"SIGNUP"}
          onClick={() => (window.location.href = "/join")}
        />
        <Button
          text={"Aegis 소개"}
          type={"LOGIN"}
          onClick={() =>
            (window.location.href =
              "https://dkuaegis.notion.site/Aegis-62053a8ce0a94588a9f3a1922ffed745")
          }
        />
      </div>
    </div>
  );
};

export default UnAuthorized;
