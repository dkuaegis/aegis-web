import { cn } from "@app/lib/utils";
import type * as React from "react";
import { controlClassName } from "./input";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        controlClassName,
        "field-sizing-content min-h-32 resize-y px-4 py-3 leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
