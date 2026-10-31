import { useI18n } from "@app/i18n";
import { cn } from "@app/lib/utils";
import { Button } from "@join/components/ui/button";
import { Loader2 } from "lucide-react"; // 로딩 아이콘

interface NavigationButtonsProps {
  onClick?: () => void;
  text?: string;
  disabled?: boolean;
  isLoading?: boolean;
  isVisuallyDisabled?: boolean;
}

export default function NavigationButtons({
  onClick,
  text,
  disabled = false,
  isLoading = false,
  isVisuallyDisabled = false,
}: NavigationButtonsProps) {
  const { t } = useI18n();
  const label = text ?? t("join.actions.next");

  return (
    <div className="join-navigation">
      <div className="join-navigation-inner">
        <Button
          type="submit"
          onClick={onClick}
          disabled={isLoading || disabled}
          className={cn("w-full", isVisuallyDisabled && "opacity-50")}
          size="lg"
        >
          {/* isLoading 상태일 때 로딩 아이콘 표시 */}
          {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : label}
        </Button>
      </div>
    </div>
  );
}
