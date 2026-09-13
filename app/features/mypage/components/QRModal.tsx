import { useI18n } from "@app/i18n";
import { useState } from "react";
import { issueQRCode } from "../api/QRCode";
import type { QRModalProps } from "../model/QRModal";
import "../style/QRModal.css";
import closeImg from "../assets/close.svg";
import refreshImg from "../assets/refresh.svg";
import Button from "../components/Button";

const QRModal: React.FC<QRModalProps> = ({ onClose, qrImageUrl }) => {
  const { t } = useI18n();
  const [qrUrl, setQrUrl] = useState<string>(qrImageUrl || "");

  // QRCode 생성 API 호출
  const onClickQR = async () => {
    try {
      const base64 = await issueQRCode();
      setQrUrl(`data:image/png;base64,${base64}`);
    } catch (e) {
      console.error("QR 발급 실패:", e);
    }
  };

  return (
    <div className="qr-modal-overlay">
      <div className="qr-modal">
        <h2 className="qr-title">{t("mypage.qr.title")}</h2>
        <p className="qr-desc">{t("mypage.qr.description")}</p>
        <div className="qr-image-wrapper">
          <img src={qrUrl} alt="QR Code" className="qr-image" />
        </div>
        <Button
          type="REFRESH"
          onClick={onClickQR}
          text={
            <>
              <img
                src={refreshImg}
                alt={t("mypage.qr.refreshIconAlt")}
                className="qr-btn-icon"
              />
              {t("mypage.qr.refresh")}
            </>
          }
        />
      </div>
      <Button
        type="CLOSE"
        onClick={onClose}
        text={
          <>
            <img
              src={closeImg}
              alt={t("mypage.qr.closeIconAlt")}
              className="qr-btn-icon"
            />
            {t("mypage.qr.back")}
          </>
        }
      />
    </div>
  );
};

export default QRModal;
