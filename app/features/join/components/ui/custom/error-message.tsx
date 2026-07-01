import { cn } from "@join/lib/utils";
import type * as React from "react";

interface ErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  isShown?: boolean;
  message?: string;
}

export function ErrorMessage({
  isShown = false,
  message,
  className,
  ...props
}: ErrorMessageProps) {
  return (
    <p
      className={cn(
        "font-medium text-sm",
        isShown ? "text-red-500" : "invisible",
        className
      )}
      aria-live="polite"
      {...props}
    >
      {message}
    </p>
  );
}
