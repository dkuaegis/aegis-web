import KakaoIcon from "@join/assets/kakao-logo.svg";
import { Button } from "@join/components/ui/button";
import { cn } from "@join/lib/utils";
import { Analytics } from "@join/service/analytics";
import { CheckIcon } from "lucide-react";

interface KakaoLinkButtonProps {
  text: string;
  url: string;
  onClick?: () => void;
  completed?: boolean;
}

const KakaoLinkButton = ({
  text,
  url,
  onClick,
  completed = false,
}: KakaoLinkButtonProps) => {
  return (
    <Button
      variant="kakao"
      size="lg"
      className={cn(
        "w-full",
        completed && "bg-[#FEE500]/40 hover:bg-[#FEE500]/40"
      )}
      asChild
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          Analytics.safeTrack("Kakao_External_Open", {
            category: "Kakao",
          });
          onClick?.();
        }}
      >
        <img src={KakaoIcon} alt="Kakao Icon" className="h-6 w-6" />
        <span className="font-semibold text-base">{text}</span>
        {completed && <CheckIcon className="h-5 w-5" aria-hidden="true" />}
      </a>
    </Button>
  );
};

export default KakaoLinkButton;
