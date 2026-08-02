import DiscordIcon from "@join/assets/discord-logo.svg";
import { Button } from "@join/components/ui/button";
import { Analytics } from "@join/service/analytics";
import { CheckIcon } from "lucide-react";

interface DiscordLinkButtonProps {
  text: string;
  url: string;
  onClick?: () => void;
  completed?: boolean;
}

const DiscordLinkButton = ({
  text,
  url,
  onClick,
  completed = false,
}: DiscordLinkButtonProps) => {
  return (
    <Button variant="discord" size="lg" className="w-full" asChild>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          Analytics.safeTrack("Discord_External_Open", {
            category: "Discord",
          });
          onClick?.();
        }}
      >
        <img src={DiscordIcon} alt="Discord Icon" className="h-6 w-6" />
        <span className="text-base">{text}</span>
        {completed && <CheckIcon className="h-5 w-5" aria-hidden="true" />}
      </a>
    </Button>
  );
};

export default DiscordLinkButton;
