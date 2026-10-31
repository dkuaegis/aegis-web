import { useI18n } from "@app/i18n";
import { readLoginIntent } from "@app/lib/authIntent";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import loginImage from "../assets/loginImage.webp";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import "../style/LoginAuth.css";

const LoginAuth = () => {
  const { t } = useI18n();
  const { checkAuthStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("login") === "success" && readLoginIntent() !== "qr") {
      const verifyAuth = async () => {
        await checkAuthStatus(true); // 네비게이션 활성화
      };

      verifyAuth();
    }
  }, [checkAuthStatus]);

  // 다른 화면과 같은 로그인 흐름을 거쳐, 로그인 후 마이페이지로 돌아옵니다.
  const handleGoogleLogin = () => {
    navigate("/auth/continue?intent=mypage");
  };

  return (
    <div className="login-auth-container">
      <div className="login-auth-image">
        <img src={loginImage} alt="login lock" />
      </div>
      <h1 className="login-auth-title">
        {t("mypage.login.titleLine1")}
        <br />
        {t("mypage.login.titleLine2")}
        <br />
        {t("mypage.login.titleLine3")}
        <br />
        {t("mypage.login.titleLine4")}
      </h1>
      <p className="login-auth-desc">{t("mypage.login.description")}</p>
      <div className="button-group-section">
        <Button
          text={t("mypage.login.join")}
          type={"SIGNUP"}
          onClick={() => navigate("/join")}
        />
        <Button
          text={t("mypage.login.google")}
          type={"LOGIN"}
          onClick={handleGoogleLogin}
        />
      </div>
    </div>
  );
};

export default LoginAuth;
