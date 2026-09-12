import { useI18n } from "@app/i18n";
import UnAuthImage from "../assets/UnAuthorizedImage.webp";
import Button from "../components/Button";
import "../style/UnAuthorized.css";

const UnAuthorized = () => {
  const { t } = useI18n();

  return (
    <div className="login-unauth-container">
      <div className="login-unauth-image">
        <img src={UnAuthImage} alt="login unauth" />
      </div>
      <h1 className="login-unauth-title">
        {t("mypage.unauthorized.titleLine1")}
        <br />
        {t("mypage.unauthorized.titleLine2")}
        <br />
        {t("mypage.unauthorized.titleLine3")}
      </h1>
      <p className="login-unauth-desc">{t("mypage.unauthorized.description")}</p>
      <div className="button-group-section">
        <Button
          text={t("mypage.unauthorized.join")}
          type={"SIGNUP"}
          onClick={() => (window.location.href = "/join")}
        />
        <Button
          text={t("mypage.unauthorized.about")}
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
