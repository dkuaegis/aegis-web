import { useI18n } from "@app/i18n";
import { useNavigate } from "react-router-dom";
import notFoundImage from "../assets/notFoundImage.webp";
import Button from "../components/Button";
import "../style/Notfound.css";

const Notfound = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-image">
        <img src={notFoundImage} alt="not found" />
      </div>
      <h1 className="notfound-title">
        {t("mypage.notFound.titleLine1")}
        <br />
        {t("mypage.notFound.titleLine2")}
      </h1>
      <p className="notfound-desc">{t("mypage.notFound.description")}</p>
      <Button
        text={t("mypage.notFound.backHome")}
        type={"BACKHOME"}
        onClick={() => navigate("/mypage")}
      />
    </div>
  );
};

export default Notfound;
