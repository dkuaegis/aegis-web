import { useI18n } from "@app/i18n";
import { Alert, AlertDescription } from "@join/components/ui/alert";
import { Button } from "@join/components/ui/button";
import { Copy } from "lucide-react";
import { useMemo } from "react";
import toast from "react-hot-toast";

interface InfoRowProps {
  label: string;
  value: string;
  onCopy?: () => void;
}

interface AccountDetails {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, onCopy }) => {
  const { t } = useI18n();

  return (
    <div className="flex items-center">
      <span className="w-16 pr-2 font-medium">{label}</span>
      <span>{value}</span>
      {onCopy && (
        <Button
          variant="icon"
          size="lg"
          onClick={onCopy}
          aria-label={t("join.payment.account.copyLabel", { label })}
        >
          <Copy size={16} />
        </Button>
      )}
    </div>
  );
};

const Information: React.FC = () => {
  const { t } = useI18n();
  const accountString = import.meta.env.VITE_ADMIN_ACCOUNT_NUMBER;
  const accountHolder = t("join.payment.account.defaultHolder");

  const accountDetails = useMemo<AccountDetails>(() => {
    if (!accountString) {
      return { bankName: "", accountNumber: "", accountHolder };
    }
    const lastSpaceIndex = accountString.lastIndexOf(" ");
    const bankName = accountString.slice(0, lastSpaceIndex);
    const accountNumber = accountString.slice(lastSpaceIndex + 1);

    return { bankName, accountNumber, accountHolder };
  }, [accountString, accountHolder]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        import.meta.env.VITE_ADMIN_ACCOUNT_NUMBER
      );
      toast.success(t("join.payment.account.copySuccess"));
    } catch (error) {
      toast.error(t("join.payment.account.copyFailure"));
      console.error("copy failed:", error);
    }
  };

  return (
    <Alert>
      <AlertDescription className="space-y-2 text-sm sm:text-base">
        <InfoRow
          label={t("join.payment.account.bank")}
          value={accountDetails.bankName}
        />
        <InfoRow
          label={t("join.payment.account.accountNumber")}
          value={accountDetails.accountNumber}
          onCopy={handleCopy}
        />
        <InfoRow
          label={t("join.payment.account.accountHolder")}
          value={accountDetails.accountHolder}
        />
      </AlertDescription>
    </Alert>
  );
};

export default Information;
