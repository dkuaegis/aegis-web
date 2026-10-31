import { cn } from "@app/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import type * as React from "react";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderCircleIcon
      data-slot="spinner"
      aria-hidden="true"
      className={cn(
        "size-4 animate-spin motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  );
}

export { Spinner };
