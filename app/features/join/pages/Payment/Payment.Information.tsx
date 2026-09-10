import { Copy } from "lucide-react";
import toast from "react-hot-toast";

const Information = () => {
  const accountNumber = import.meta.env.VITE_ADMIN_ACCOUNT_NUMBER ?? "";
  const accountHolder = import.meta.env.VITE_ADMIN_ACCOUNT_HOLDER ?? "권대근";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      toast.success("계좌번호를 복사했습니다.");
    } catch (error) {
      toast.error("복사에 실패했습니다. 브라우저 권한을 확인해주세요.");
      console.error("copy failed:", error);
    }
  };

  return (
    <section className="join-payment-info" aria-label="입금 계좌 정보">
      <div>
        <span>입금 계좌</span>
        <strong>{accountNumber}</strong>
        <button
          className="join-payment-copy"
          type="button"
          aria-label="계좌번호 복사"
          disabled={!accountNumber}
          onClick={handleCopy}
        >
          <Copy aria-hidden="true" />
        </button>
      </div>
      <div>
        <span>예금주명</span>
        <strong>{accountHolder}</strong>
      </div>
    </section>
  );
};

export default Information;
