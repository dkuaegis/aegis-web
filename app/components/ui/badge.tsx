import { cn } from "@app/lib/utils";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Small square label for categories and statuses. Tones reuse the home
 * page's activity pastels so colour-coding never introduces new hues.
 */
const badgeVariants = cva(
  "inline-flex h-6 w-fit shrink-0 items-center gap-1 rounded-none px-2 text-[0.75rem] leading-none font-[750] whitespace-nowrap [&>svg]:size-3",
  {
    variants: {
      tone: {
        neutral: "bg-paper-sunken text-ink",
        ink: "bg-ink text-paper",
        outline: "border border-ink text-ink",
        blue: "bg-tone-blue text-ink",
        periwinkle: "bg-tone-periwinkle text-ink",
        coral: "bg-tone-coral text-ink",
        rose: "bg-tone-rose text-ink",
        green: "bg-tone-green text-ink",
        lime: "bg-tone-lime text-ink",
        sage: "bg-tone-sage text-ink",
        success: "bg-success-soft text-success",
        danger: "bg-danger-soft text-danger",
        warning: "bg-warning-soft text-warning",
        info: "bg-blue-soft text-blue-strong",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

export type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>["tone"]>;

function Badge({
  className,
  tone,
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      { className: cn(badgeVariants({ tone }), className) },
      props
    ),
    render,
    state: { slot: "badge" },
  });
}

export { Badge, badgeVariants };
