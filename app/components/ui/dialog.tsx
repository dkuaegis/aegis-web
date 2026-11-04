import { t } from "@app/i18n/store";
import { cn } from "@app/lib/utils";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import type * as React from "react";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

/** Backdrop shared with AlertDialog. */
export const backdropClassName =
  "fixed inset-0 z-50 bg-ink/50 duration-200 supports-backdrop-filter:backdrop-blur-[2px] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0";

/** Panel shared with AlertDialog: paper sheet with an ink frame. */
export const dialogPanelClassName = cn(
  "fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 overflow-y-auto rounded-none",
  "border border-ink bg-paper-raised p-6 text-ink shadow-[0_2rem_4rem_rgb(24_24_27/22%)] outline-none sm:p-8",
  "duration-200 ease-out data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-bottom-3 data-closed:animate-out data-closed:fade-out-0"
);

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & { showCloseButton?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className={backdropClassName} />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(dialogPanelClassName, "max-w-lg", className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            aria-label={t("common.close")}
            className="absolute top-3 right-3 grid size-10 cursor-pointer place-items-center text-ink-muted transition-colors hover:bg-ink/6 hover:text-ink"
          >
            <XIcon aria-hidden="true" className="size-5" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("grid gap-2 pr-8", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "m-0 text-[1.5rem] leading-tight font-[800] tracking-[-0.04em]",
        className
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "m-0 text-[0.9375rem] leading-relaxed text-ink-muted",
        className
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
