import { cn } from "@app/lib/utils";
import type * as React from "react";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-none bg-ink/8 motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
