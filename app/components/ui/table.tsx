import { cn } from "@app/lib/utils";
import type * as React from "react";

/** Ruled data table. Scrolls sideways on narrow screens instead of squashing. */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto bg-paper-raised"
    >
      <table
        data-slot="table"
        className={cn(
          "w-full border-separate border-spacing-0 text-left text-[0.9375rem]",
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
      className={cn("[&_th]:border-b [&_th]:border-ink", className)}
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
        "transition-colors hover:bg-paper [&>td]:border-b [&>td]:border-line last:[&>td]:border-b-0",
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
        "eyebrow h-11 px-4 align-middle whitespace-nowrap text-ink-muted first:pl-5 last:pr-5",
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
        "px-4 py-3.5 align-middle font-[560] whitespace-nowrap first:pl-5 last:pr-5",
        className
      )}
      {...props}
    />
  );
}

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
