import { cn } from "@app/lib/utils";
import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field";

/** A short numeric code typed into one box per digit (attendance codes). */
function CodeField({
  length,
  className,
  slotLabel,
  ...props
}: OTPFieldPrimitive.Root.Props & {
  length: number;
  /** Accessible name for slots after the first: "Digit 2 of 4". */
  slotLabel: (index: number) => string;
}) {
  return (
    <OTPFieldPrimitive.Root
      data-slot="code-field"
      length={length}
      className={cn("flex gap-2", className)}
      {...props}
    >
      {Array.from({ length }, (_, index) => (
        <OTPFieldPrimitive.Input
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed slots
          key={index}
          aria-label={index === 0 ? undefined : slotLabel(index)}
          className={cn(
            "tabular m-0 h-16 w-14 flex-none rounded-none border border-line-strong bg-paper-raised text-center text-[1.75rem] font-[800] text-ink caret-blue outline-none transition-[border-color,box-shadow]",
            "hover:border-ink/55 focus:border-ink focus:shadow-[inset_0_0_0_1px_var(--ink)]",
            "aria-invalid:border-danger data-filled:border-ink"
          )}
        />
      ))}
    </OTPFieldPrimitive.Root>
  );
}

export { CodeField };
