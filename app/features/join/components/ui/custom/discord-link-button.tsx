import DiscordIcon from "@join/assets/discord-logo.svg";
import { Button } from "@join/components/ui/button";
import { Analytics } from "@join/service/analytics";

interface DiscordLinkButtonProps {
  text: string;
  url: string;
}

const DiscordLinkButton = ({ text, url }: DiscordLinkButtonProps) => {
  return (
    <Button variant="discord" size="lg" className="w-full" asChild>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          Analytics.safeTrack("Discord_External_Open", {
            category: "Discord",
          })
        }
      >
        <img src={DiscordIcon} alt="Discord Icon" className="h-6 w-6" />
        <span className="text-base">{text}</span>
      </a>
    </Button>
  );
};

export default DiscordLinkButton;
