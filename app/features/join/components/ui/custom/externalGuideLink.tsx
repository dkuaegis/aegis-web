import { ExternalLink } from "lucide-react";
import type React from "react";

interface NotionLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function ExternalGuideLink({ href, children }: NotionLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 flex w-full items-center gap-2 rounded-lg border bg-muted/50 p-4 text-foreground transition-colors hover:bg-muted active:bg-muted/80"
    >
      <ExternalLink className="h-5 w-5 text-muted-foreground" />
      <span className="font-medium">{children}</span>
    </a>
  );
}
