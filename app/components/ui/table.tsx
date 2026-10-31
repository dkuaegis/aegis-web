import { cn } from "@app/lib/utils";
import type * as React from "react";

/** Ruled data table. Scrolls sideways on narrow screens instead of squashing. */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto border-y border-ink"
    >
      <table
        data-slot="table"
        className={cn(
          "w-full border-collapse text-left text-[0.9375rem]",
          className
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("border-b border-ink", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={className} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-line transition-colors last:border-b-0 hover:bg-paper-raised",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "eyebrow h-11 px-4 align-middle whitespace-nowrap text-ink-muted first:pl-0 last:pr-0",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 py-3.5 align-middle font-[560] whitespace-nowrap first:pl-0 last:pr-0",
        className
      )}
      {...props}
    />
  );
}

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
