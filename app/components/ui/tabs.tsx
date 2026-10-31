import { cn } from "@app/lib/utils";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

/**
 * Underlined tabs, also used as list filters ("전체 12 · 검토 중 3").
 * The indicator slides between tabs.
 */
const Tabs = TabsPrimitive.Root;
const TabsPanel = TabsPrimitive.Panel;

function TabsList({ className, children, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "relative flex w-full gap-6 overflow-x-auto border-b border-line [scrollbar-width:none]",
        className
      )}
      {...props}
    >
      {children}
      <TabsPrimitive.Indicator className="absolute bottom-0 left-(--active-tab-left) h-[2px] w-(--active-tab-width) bg-ink transition-[left,width] duration-200 ease-out" />
    </TabsPrimitive.List>
  );
}

function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-tab"
      className={cn(
        "flex h-12 shrink-0 cursor-pointer items-center gap-1.5 bg-transparent text-[0.9375rem] font-[700] whitespace-nowrap text-ink-muted transition-colors hover:text-ink data-active:text-ink",
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsPanel, TabsTab };
