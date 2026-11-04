import { cn } from "@app/lib/utils";
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import { MinusIcon, PlusIcon } from "lucide-react";
import { controlClassName } from "./input";

const stepperClassName =
  "grid size-12 shrink-0 cursor-pointer place-items-center border border-line-strong bg-paper-raised text-ink transition-colors hover:bg-ink hover:text-paper data-disabled:cursor-not-allowed data-disabled:opacity-40 data-disabled:hover:bg-paper-raised data-disabled:hover:text-ink";

/** A number with − and + buttons either side of the input. */
function NumberField({
  className,
  unit,
  decrementLabel,
  incrementLabel,
  ...props
}: NumberFieldPrimitive.Root.Props & {
  unit?: string;
  decrementLabel: string;
  incrementLabel: string;
}) {
  return (
    <NumberFieldPrimitive.Root
      data-slot="number-field"
      className={cn("w-fit", className)}
      {...props}
    >
      <NumberFieldPrimitive.Group className="flex items-center">
        <NumberFieldPrimitive.Decrement
          aria-label={decrementLabel}
          className={cn(stepperClassName, "border-r-0")}
        >
          <MinusIcon aria-hidden="true" className="size-4" />
        </NumberFieldPrimitive.Decrement>
        <NumberFieldPrimitive.Input
          className={cn(
            controlClassName,
            "tabular relative h-12 w-20 text-center font-[750] focus:z-1"
          )}
        />
        <NumberFieldPrimitive.Increment
          aria-label={incrementLabel}
          className={cn(stepperClassName, "border-l-0")}
        >
          <PlusIcon aria-hidden="true" className="size-4" />
        </NumberFieldPrimitive.Increment>
        {unit && (
          <span className="ml-3 text-[0.9375rem] font-[650] text-ink-muted">
            {unit}
          </span>
        )}
      </NumberFieldPrimitive.Group>
    </NumberFieldPrimitive.Root>
  );
}

export { NumberField };
