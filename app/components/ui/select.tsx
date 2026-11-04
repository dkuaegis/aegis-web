import { cn } from "@app/lib/utils";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { controlClassName } from "./input";

const Select = SelectPrimitive.Root;

/** Floating list surface shared by Select, Combobox and Popover. */
export const popupClassName = cn(
  "rounded-none border border-ink bg-paper-raised text-ink shadow-[0_1.25rem_2.5rem_rgb(24_24_27/14%)] outline-none",
  "origin-(--transform-origin) duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-[0.98] data-closed:animate-out data-closed:fade-out-0"
);

/** A row inside a floating list. Highlighted rows invert to ink. */
export const optionClassName = cn(
  "relative flex min-h-11 w-full cursor-default items-center gap-3 px-4 py-2.5 text-[0.9375rem] font-[560] outline-none select-none",
  "data-highlighted:bg-ink data-highlighted:text-paper data-disabled:pointer-events-none data-disabled:opacity-45"
);

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex-1 truncate text-left", className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  children,
  ...props
}: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        controlClassName,
        "flex h-12 cursor-pointer items-center justify-between gap-3 px-4 text-left data-placeholder:text-ink-subtle data-popup-open:border-ink",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-ink-muted transition-transform duration-150 group-data-popup-open:rotate-180"
          />
        }
      />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  ...props
}: SelectPrimitive.Popup.Props) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        sideOffset={6}
        alignItemWithTrigger={false}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            popupClassName,
            "max-h-[min(22rem,var(--available-height))] w-(--anchor-width) min-w-40 overflow-y-auto py-1",
            className
          )}
          {...props}
        >
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(optionClassName, "pr-10", className)}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex-1">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-4 flex items-center">
        <CheckIcon aria-hidden="true" className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
