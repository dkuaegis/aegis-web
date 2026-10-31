import { useI18n } from "@app/i18n";
import { ApiError } from "@app/lib/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getMyPage } from "../api/Mypage";
import { issueQRCode } from "../api/QRCode";
import pointImg from "../assets/point.svg";
import ActivitySection from "../components/ActivitySection";
import Button from "../components/Button";
import Profile from "../components/Profile";
import QRModal from "../components/QRModal";
import { showError } from "../utils/alert";

const Home: React.FC = () => {
  const { t } = useI18n();
  const [mypage, setMypage] = useState<{
    name: string;
    profileIcon: string;
    pointBalance: number;
  } | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [attempt, setAttempt] = useState(0);
  const navigate = useNavigate();
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>("");
  const [isIssuingQR, setIsIssuingQR] = useState(false);

  // 사용자 정보 조회 API 호출
  // biome-ignore lint/correctness/useExhaustiveDependencies: 재시도하면 attempt가 바뀌어 다시 조회합니다.
  useEffect(() => {
    let active = true;
    setStatus("loading");
    (async () => {
      try {
        const data = await getMyPage();
        if (!active) return;
        setMypage(data);
        setStatus("ready");
      } catch (error) {
        if (!active) return;
        console.error("사용자 정보 조회 실패:", error);
        if (error instanceof ApiError && error.status === 401) {
          navigate("/mypage/login/auth", { replace: true });
        } else if (error instanceof ApiError && error.status === 403) {
          // 마이페이지는 가입을 마친 회원만 쓸 수 있으므로 가입 화면으로 보냅니다.
          navigate("/join", { replace: true });
        } else {
          setStatus("error");
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [navigate, attempt]);

  // QRCode 생성 API 호출
  const onClickQR = async () => {
    if (isIssuingQR) return;
    setIsIssuingQR(true);
    try {
      const base64 = await issueQRCode();
      setQrUrl(`data:image/png;base64,${base64}`);
      setShowQRModal(true);
    } catch (e) {
      console.error("QR 발급 실패:", e);
      showError(e instanceof Error ? e.message : t("mypage.errors.qrIssue"));
    } finally {
      setIsIssuingQR(false);
    }
  };

  if (status === "loading") {
    return <div></div>;
  }

  if (status === "error") {
    return (
      <main className="auth-continue-page">
        <p role="alert">{t("common.error.unknown")}</p>
        <button
          className="auth-continue-retry"
          type="button"
          onClick={() => setAttempt((current) => current + 1)}
        >
          {t("common.retry")}
        </button>
      </main>
    );
  }

  return (
    <div>
      <Profile mypage={mypage} />
      <div className="point-box">
        <Button
          text={
            <span className="point-info">
              <img src={pointImg} alt={t("mypage.home.pointIconAlt")} />
              <span className="point-text">
                {mypage?.pointBalance?.toLocaleString()}
              </span>
            </span>
          }
          type="POINT"
          onClick={() => navigate("/mypage/category/points")}
        />
      </div>
      <div className="main-button-group">
        <Button
          text={t("mypage.home.giftbox")}
          type={"MAIN"}
          onClick={() => navigate("/mypage/category/giftbox/history")}
        />
        <Button
          text={t("mypage.home.qrCode")}
          type={"MAIN"}
          onClick={onClickQR}
          disabled={isIssuingQR}
        />
      </div>
      <ActivitySection />

      {showQRModal && (
        <QRModal onClose={() => setShowQRModal(false)} qrImageUrl={qrUrl} />
      )}
    </div>
  );
};

export default Home;
