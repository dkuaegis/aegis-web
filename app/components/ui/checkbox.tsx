import { cn } from "@app/lib/utils";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "lucide-react";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative grid size-5 shrink-0 cursor-pointer place-items-center rounded-none border-[1.5px] border-ink bg-paper-raised text-paper transition-colors outline-none",
        "after:absolute after:-inset-2.5 hover:bg-ink/6 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-blue",
        "data-checked:bg-ink data-checked:hover:bg-ink aria-invalid:border-danger data-disabled:cursor-not-allowed data-disabled:opacity-45",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-items-center"
      >
        <CheckIcon aria-hidden="true" strokeWidth={3} className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
