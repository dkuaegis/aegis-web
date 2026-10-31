import { t } from "@app/i18n/store";
import { cn } from "@app/lib/utils";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { CircleAlertIcon, CircleCheckIcon, XIcon } from "lucide-react";

const toastManager = ToastPrimitive.createToastManager();

type ToastType = "success" | "error" | "info";

/**
 * Short, non-blocking feedback after an action. Use it for results the user
 * did not have to wait on screen for ("저장했습니다"); failures that leave the
 * screen unusable belong in an inline error instead.
 */
export const toast = {
  success: (title: string) => show("success", title),
  error: (title: string) => show("error", title),
  info: (title: string) => show("info", title),
};

function show(type: ToastType, title: string) {
  toastManager.add({
    title,
    type,
    timeout: type === "error" ? 6000 : 3500,
    priority: type === "error" ? "high" : "low",
  });
}

function ToastIcon({ type }: { type: string | undefined }) {
  if (type === "success") {
    return (
      <CircleCheckIcon
        aria-hidden="true"
        className="size-[1.125rem] shrink-0 text-tone-green"
      />
    );
  }
  if (type === "error") {
    return (
      <CircleAlertIcon
        aria-hidden="true"
        className="size-[1.125rem] shrink-0 text-signal"
      />
    );
  }
  return null;
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map((item) => (
    <ToastPrimitive.Root
      key={item.id}
      toast={item}
      className={cn(
        "pointer-events-auto absolute bottom-0 left-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom",
        "[--gap:0.625rem] [--peek:0.5rem] [--scale:calc(max(0,1-(var(--toast-index)*0.06)))] [--shrink:calc(1-var(--scale))]",
        "h-(--toast-frontmost-height,var(--toast-height)) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--toast-height))))_scale(var(--scale))]",
        "[transition:transform_400ms_var(--ease-out),opacity_300ms,height_150ms]",
        "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-offset-y)*-1+var(--toast-index)*var(--gap)*-1+var(--toast-swipe-movement-y)))]",
        "data-limited:opacity-0 data-starting-style:[transform:translateY(150%)] data-ending-style:opacity-0 data-ending-style:[transform:translateY(150%)]"
      )}
    >
      <ToastPrimitive.Content className="flex items-center gap-3 border border-white/16 bg-ink py-3.5 pr-2 pl-4 text-paper shadow-[0_1rem_2rem_rgb(24_24_27/28%)] outline outline-ink transition-opacity data-behind:opacity-0 data-expanded:opacity-100">
        <ToastIcon type={item.type} />
        <ToastPrimitive.Title className="m-0 min-w-0 flex-1 text-[0.9375rem] leading-snug font-[650]" />
        <ToastPrimitive.Close
          aria-label={t("common.close")}
          className="grid size-8 shrink-0 cursor-pointer place-items-center text-paper/60 transition-colors hover:text-paper"
        >
          <XIcon aria-hidden="true" className="size-4" />
        </ToastPrimitive.Close>
      </ToastPrimitive.Content>
    </ToastPrimitive.Root>
  ));
}

/** Mount once near the root. */
function Toaster({ children }: { children?: React.ReactNode }) {
  return (
    <ToastPrimitive.Provider toastManager={toastManager} limit={3}>
      {children}
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] mx-auto w-auto max-w-md outline-none sm:bottom-6">
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}

export { Toaster };
