import { useI18n } from "@app/i18n";
import { googleLoginUrl } from "@app/lib/api";
import { useEffect } from "react";
import loginImage from "../assets/loginImage.webp";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import "../style/LoginAuth.css";

const LoginAuth = () => {
  const { t } = useI18n();
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("login") === "success") {
      const verifyAuth = async () => {
        await checkAuthStatus(true); // 네비게이션 활성화
      };

      verifyAuth();
    }
  }, [checkAuthStatus]);

  const handleGoogleLogin = () => {
    // 브라우저 호환성을 위한 OAuth 리다이렉트 처리
    // 네이버 브라우저 등 특수 브라우저를 위한 추가 파라미터
    const currentUrl = encodeURIComponent(window.location.origin);
    const userAgent = encodeURIComponent(navigator.userAgent);
    const finalUrl = `${googleLoginUrl}?redirect_uri=${currentUrl}&user_agent=${userAgent}`;

    // 브라우저별 특수 처리
    const isNaverBrowser =
      navigator.userAgent.includes("NAVER") ||
      navigator.userAgent.includes("Whale");
    const isFirefox = navigator.userAgent.includes("Firefox");

    if (isNaverBrowser) {
      // 네이버 브라우저의 경우 새 탭에서 열기
      const popup = window.open(
        finalUrl,
        "_blank",
        "width=500,height=600,scrollbars=yes,resizable=yes"
      );

      // 팝업이 닫혔을 때 페이지 새로고침으로 로그인 상태 확인
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.location.reload();
        }
      }, 1000);
    } else if (isFirefox) {
      // Firefox의 경우 직접 리다이렉트하되 추가 헤더 설정
      window.location.replace(finalUrl);
    } else {
      // 일반 브라우저 처리
      try {
        window.location.assign(finalUrl);
      } catch {
        window.location.href = finalUrl;
      }
    }
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
          onClick={() => (window.location.href = "/join")}
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
