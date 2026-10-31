import { cn } from "@app/lib/utils";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";
import { CircleAlertIcon } from "lucide-react";
import type * as React from "react";

/**
 * A labelled form control. Base UI wires the label, description and error
 * to the control (`Input`, or any element rendered through `FieldControl`)
 * with the right ids and aria attributes.
 *
 * Pass `invalid` together with a `FieldError` to show a validation message
 * that comes from outside (react-hook-form, the server).
 */
function Field({ className, ...props }: FieldPrimitive.Root.Props) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      className={cn("grid min-w-0 content-start gap-2", className)}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  required,
  children,
  ...props
}: FieldPrimitive.Label.Props & { required?: boolean }) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn(
        "flex items-baseline gap-1.5 text-[0.875rem] leading-snug font-[750] text-ink data-disabled:opacity-60",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="text-blue">
          *
        </span>
      )}
    </FieldPrimitive.Label>
  );
}

function FieldDescription({
  className,
  ...props
}: FieldPrimitive.Description.Props) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn(
        "text-[0.8125rem] leading-relaxed text-ink-muted",
        className
      )}
      {...props}
    />
  );
}

function FieldError({
  className,
  children,
  ...props
}: FieldPrimitive.Error.Props) {
  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      match
      className={cn(
        "flex items-start gap-1.5 text-[0.8125rem] leading-snug font-[650] text-danger",
        className
      )}
      {...props}
    >
      <CircleAlertIcon aria-hidden="true" className="mt-px size-3.5 shrink-0" />
      <span>{children}</span>
    </FieldPrimitive.Error>
  );
}

const FieldControl = FieldPrimitive.Control;

function FieldSet({ className, ...props }: FieldsetPrimitive.Root.Props) {
  return (
    <FieldsetPrimitive.Root
      data-slot="field-set"
      className={cn("m-0 grid min-w-0 gap-3 border-0 p-0", className)}
      {...props}
    />
  );
}

function FieldLegend({ className, ...props }: FieldsetPrimitive.Legend.Props) {
  return (
    <FieldsetPrimitive.Legend
      data-slot="field-legend"
      className={cn(
        "mb-1 p-0 text-[0.875rem] leading-snug font-[750] text-ink",
        className
      )}
      {...props}
    />
  );
}

/** Groups related fields with the hairline rhythm used across the site. */
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("grid gap-7", className)}
      {...props}
    />
  );
}

export {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
};
