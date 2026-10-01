import { useI18n } from "@app/i18n";
import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { issueQRCode } from "../api/QRCode";
import Button from "../components/Button";
import QRModal from "../components/QRModal";
import { useAuth } from "../contexts/AuthContext";

const QRPage = () => {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const requestRef = useRef<Promise<string> | null>(null);

  const loadQRCode = useCallback(async () => {
    setError(false);
    const request = requestRef.current ?? issueQRCode();
    requestRef.current = request;

    try {
      const base64 = await request;
      if (requestRef.current === request) {
        setQrUrl(`data:image/png;base64,${base64}`);
      }
    } catch (caught) {
      if (requestRef.current === request) {
        console.error("QR 발급 실패:", caught);
        setError(true);
      }
    } finally {
      if (requestRef.current === request) requestRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) void loadQRCode();
  }, [isAuthenticated, loadQRCode]);

  if (isAuthenticated === false) {
    return <Navigate to="/auth/continue?intent=qr" replace />;
  }

  if (qrUrl) {
    return (
      <QRModal
        qrImageUrl={qrUrl}
        onClose={() => navigate("/mypage", { replace: true })}
      />
    );
  }

  return (
    <div className="login-auth-container" aria-busy={!error}>
      {error ? (
        <>
          <p role="alert">{t("mypage.errors.qrIssue")}</p>
          <Button
            type="LOGIN"
            text={t("mypage.qr.retry")}
            onClick={() => void loadQRCode()}
          />
        </>
      ) : (
        <p>{t("mypage.qr.loading")}</p>
      )}
    </div>
  );
};

export default QRPage;
