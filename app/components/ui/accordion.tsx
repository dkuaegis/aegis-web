import { cn } from "@app/lib/utils";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { PlusIcon } from "lucide-react";

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("border-t border-ink", className)}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-line", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="m-0">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 bg-transparent py-4 text-left text-[1rem] font-[750] text-ink transition-colors hover:text-blue",
          className
        )}
        {...props}
      >
        {children}
        <PlusIcon
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform duration-200 group-data-panel-open/accordion:rotate-45"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0"
      {...props}
    >
      <div className={cn("pb-6", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
