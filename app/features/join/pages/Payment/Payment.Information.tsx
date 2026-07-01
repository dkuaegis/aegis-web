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

const InfoRow: React.FC<InfoRowProps> = ({ label, value, onCopy }) => (
  <div className="flex items-center">
    <span className="w-16 pr-2 font-medium">{label}</span>
    <span>{value}</span>
    {onCopy && (
      <Button
        variant="icon"
        size="lg"
        onClick={onCopy}
        aria-label={`${label} 복사하기`}
      >
        <Copy size={16} />
      </Button>
    )}
  </div>
);

const Information: React.FC = () => {
  const accountString = import.meta.env.VITE_ADMIN_ACCOUNT_NUMBER;

  const accountDetails = useMemo<AccountDetails>(() => {
    if (!accountString) {
      return { bankName: "", accountNumber: "", accountHolder: "권대근" };
    }
    const lastSpaceIndex = accountString.lastIndexOf(" ");
    const bankName = accountString.slice(0, lastSpaceIndex);
    const accountNumber = accountString.slice(lastSpaceIndex + 1);

    return {
      bankName,
      accountNumber,
      accountHolder: "권대근",
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        import.meta.env.VITE_ADMIN_ACCOUNT_NUMBER
      );
      toast.success("복사되었습니다.");
    } catch (error) {
      toast.error("복사에 실패했습니다. 브라우저 권한을 확인해주세요.");
      console.error("copy failed:", error);
    }
  };

  return (
    <Alert>
      <AlertDescription className="space-y-2 text-sm sm:text-base">
        <InfoRow label="은행" value={accountDetails.bankName} />
        <InfoRow
          label="계좌번호"
          value={accountDetails.accountNumber}
          onCopy={handleCopy}
        />
        <InfoRow label="예금주명" value={accountDetails.accountHolder} />
      </AlertDescription>
    </Alert>
  );
};

export default Information;
