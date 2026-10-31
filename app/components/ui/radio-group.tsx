import { cn } from "@app/lib/utils";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import type * as React from "react";

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid gap-2", className)}
      {...props}
    />
  );
}

interface RadioCardProps extends Omit<RadioPrimitive.Root.Props, "children"> {
  label: React.ReactNode;
  description?: React.ReactNode;
}

/**
 * A choice drawn as a bordered row with a square marker; the whole row is
 * the hit target. The checked row turns ink-framed like an active tab.
 */
function RadioCard({
  label,
  description,
  className,
  ...props
}: RadioCardProps) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-card"
      className={cn(
        "group/radio grid cursor-pointer grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-x-3 gap-y-1 border border-line-strong bg-paper-raised px-4 py-3.5 text-left transition-[border-color,box-shadow,background-color] outline-none",
        "hover:border-ink/55 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue",
        "data-checked:border-ink data-checked:shadow-[inset_0_0_0_1px_var(--ink)]",
        "data-disabled:cursor-not-allowed data-disabled:bg-paper-sunken data-disabled:opacity-60",
        className
      )}
      {...props}
    >
      <span className="mt-0.5 grid size-5 place-items-center rounded-full border-[1.5px] border-ink bg-paper-raised">
        <RadioPrimitive.Indicator className="size-2.5 rounded-full bg-ink data-unchecked:hidden" />
      </span>
      <span className="text-[0.9375rem] leading-snug font-[750]">{label}</span>
      {description && (
        <span className="col-start-2 text-[0.8125rem] leading-relaxed text-ink-muted">
          {description}
        </span>
      )}
    </RadioPrimitive.Root>
  );
}

export { RadioCard, RadioGroup };
