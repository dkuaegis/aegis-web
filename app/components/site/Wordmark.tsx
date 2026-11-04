import { cn } from "@app/lib/utils";

/** "AEGIS" set in the brand face. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-wordmark text-[1.45rem] leading-none font-bold tracking-[-0.03em]",
        className
      )}
    >
      AEGIS
    </span>
  );
}

/**
 * The orange full stop that closes brand headlines ("열려 있습니다.").
 * Decorative; screen readers already hear the sentence end.
 */
export function Period() {
  return (
    <span
      aria-hidden="true"
      className="ml-[0.06em] inline-block font-wordmark tracking-normal text-signal"
    >
      .
    </span>
  );
}
