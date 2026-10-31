import { cn } from "@app/lib/utils";
import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";

/** Shared by Input, Textarea and the select/combobox triggers. */
export const controlClassName = cn(
  "w-full min-w-0 rounded-none border border-line-strong bg-paper-raised text-base text-ink",
  "transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-ink-subtle",
  "hover:border-ink/55 focus:border-ink focus:shadow-[inset_0_0_0_1px_var(--ink)]",
  "aria-invalid:border-danger aria-invalid:focus:shadow-[inset_0_0_0_1px_var(--danger)]",
  "disabled:cursor-not-allowed disabled:bg-paper-sunken disabled:text-ink-muted data-disabled:cursor-not-allowed data-disabled:bg-paper-sunken"
);

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(controlClassName, "h-12 px-4", className)}
      {...props}
    />
  );
}

export { Input };
