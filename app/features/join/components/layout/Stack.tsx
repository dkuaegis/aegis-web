import { cn } from "@join/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const stackVariants = cva("flex w-full items-center", {
  variants: {
    justify: {
      start: "justify-start", // 왼쪽 정렬
      center: "justify-center", // 중앙 정렬
      end: "justify-end", // 오른쪽 정렬
      between: "justify-between", // 양쪽 끝으로 분산
    },

    gap: {
      sm: "gap-1",
      md: "gap-2",
      lg: "gap-4",
    },
  },
  defaultVariants: {
    justify: "start",
    gap: "md",
  },
});

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, justify, gap, ...props }, ref) => {
    return (
      <div
        className={cn(stackVariants({ justify, gap, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Stack.displayName = "Stack";

export { Stack, stackVariants };
