import { useState } from "react";
import { issueQRCode } from "../api/QRCode";
import type { QRModalProps } from "../model/QRModal";
import "../style/QRModal.css";
import closeImg from "../assets/close.svg";
import refreshImg from "../assets/refresh.svg";
import Button from "../components/Button";

const QRModal: React.FC<QRModalProps> = ({ onClose, qrImageUrl }) => {
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
        <h2 className="qr-title">입장을 위한 QR코드</h2>
        <p className="qr-desc">이용하려는 행사에 QR코드로 체크인하세요.</p>
        <div className="qr-image-wrapper">
          <img src={qrUrl} alt="QR Code" className="qr-image" />
        </div>
        <Button
          type="REFRESH"
          onClick={onClickQR}
          text={
            <>
              <img src={refreshImg} alt="새로고침" className="qr-btn-icon" />
              새로 고침
            </>
          }
        />
      </div>
      <Button
        type="CLOSE"
        onClick={onClose}
        text={
          <>
            <img src={closeImg} alt="닫기" className="qr-btn-icon" />
            이전 화면으로 돌아가기
          </>
        }
      />
    </div>
  );
};

export default QRModal;
