import { cn } from "@app/lib/utils";
import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";
import { controlClassName } from "./input";

/** Rendered through Base UI's control so a surrounding `Field` labels it. */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <InputPrimitive
      render={<textarea />}
      data-slot="textarea"
      className={cn(
        controlClassName,
        "field-sizing-content min-h-32 resize-y px-4 py-3 leading-relaxed",
        className
      )}
      {...(props as React.ComponentProps<typeof InputPrimitive>)}
    />
  );
}

export { Textarea };
