import { cn } from "@app/lib/utils";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-none border font-[750] whitespace-nowrap select-none",
    "transition-[color,background-color,border-color,transform] duration-150 ease-out active:not-aria-[haspopup]:translate-y-px",
    "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-blue",
    "disabled:pointer-events-none disabled:opacity-45 data-disabled:pointer-events-none data-disabled:opacity-45",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.05em]",
  ],
  {
    variants: {
      variant: {
        /** The one action a screen is about. */
        default:
          "border-blue bg-blue text-white hover:border-blue-strong hover:bg-blue-strong",
        /** Strong but neutral: confirm, continue. */
        ink: "border-ink bg-ink text-paper hover:border-blue hover:bg-blue",
        outline:
          "border-ink bg-transparent text-ink hover:bg-ink hover:text-paper aria-expanded:bg-ink aria-expanded:text-paper",
        ghost:
          "border-transparent bg-transparent text-ink hover:bg-ink/6 aria-expanded:bg-ink/6",
        destructive:
          "border-danger bg-danger text-white hover:border-[#8f2612] hover:bg-[#8f2612]",
        "destructive-outline":
          "border-danger bg-transparent text-danger hover:bg-danger hover:text-white",
        link: "h-auto! border-transparent px-0! text-blue underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-5 text-[0.9375rem]",
        sm: "h-9 gap-1.5 px-3.5 text-[0.8125rem]",
        lg: "h-14 px-6 text-base",
        icon: "size-12",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
