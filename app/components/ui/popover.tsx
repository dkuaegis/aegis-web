import { cn } from "@app/lib/utils";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { popupClassName } from "./select";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

function PopoverContent({
  className,
  side = "bottom",
  align = "center",
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<PopoverPrimitive.Positioner.Props, "side" | "align">) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={8}
        collisionPadding={16}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            popupClassName,
            "max-w-[min(20rem,var(--available-width))] p-4 text-[0.875rem] leading-relaxed",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverContent, PopoverTrigger };
