import { useI18n } from "@app/i18n";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

const Information = () => {
  const { t, language } = useI18n();
  const accountNumber = import.meta.env.VITE_ADMIN_ACCOUNT_NUMBER ?? "";
  const accountHolder =
    language === "ko"
      ? import.meta.env.VITE_ADMIN_ACCOUNT_HOLDER_KO
      : import.meta.env.VITE_ADMIN_ACCOUNT_HOLDER_EN;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      toast.success(t("join.payment.account.copySuccess"));
    } catch (error) {
      toast.error(t("join.payment.account.copyFailure"));
      console.error("copy failed:", error);
    }
  };

  return (
    <section
      className="join-payment-info"
      aria-label={t("join.payment.account.sectionLabel")}
    >
      <div>
        <span>{t("join.payment.account.accountNumber")}</span>
        <strong>{accountNumber}</strong>
        <button
          className="join-payment-copy"
          type="button"
          aria-label={t("join.payment.account.copyAccount")}
          disabled={!accountNumber}
          onClick={handleCopy}
        >
          <Copy aria-hidden="true" />
        </button>
      </div>
      <div>
        <span>{t("join.payment.account.accountHolder")}</span>
        <strong>{accountHolder}</strong>
      </div>
    </section>
  );
};

export default Information;
