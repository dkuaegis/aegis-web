import { cn } from "@app/lib/utils";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { controlClassName } from "./input";
import { optionClassName, popupClassName } from "./select";

const Combobox = ComboboxPrimitive.Root;

/** Text input that filters the list, with a toggle button on the right. */
function ComboboxInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
  return (
    <div data-slot="combobox-input" className="relative">
      <ComboboxPrimitive.Input
        className={cn(controlClassName, "h-12 pr-12 pl-4", className)}
        {...props}
      />
      <ComboboxPrimitive.Trigger
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-y-0 right-0 grid w-12 cursor-pointer place-items-center text-ink-muted"
      >
        <ChevronDownIcon className="size-4" />
      </ComboboxPrimitive.Trigger>
    </div>
  );
}

function ComboboxContent({
  className,
  ...props
}: ComboboxPrimitive.Popup.Props) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        sideOffset={6}
        align="start"
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className={cn(
            popupClassName,
            "w-(--anchor-width) max-w-(--available-width) overflow-hidden",
            className
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "max-h-[min(20rem,var(--available-height))] scroll-py-1 overflow-y-auto overscroll-contain py-1 data-empty:p-0",
        className
      )}
      {...props}
    />
  );
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(optionClassName, "pr-10", className)}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator className="absolute right-4 flex items-center">
        <CheckIcon aria-hidden="true" className="size-4" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "px-4 py-3 text-[0.875rem] text-ink-muted empty:hidden",
        className
      )}
      {...props}
    />
  );
}

export {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
};
