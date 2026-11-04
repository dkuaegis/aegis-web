import { cn } from "@app/lib/utils";

/** A toggle in a row of list filters, with an optional item count. */
export function FilterChip({
  active,
  tone,
  count,
  onClick,
  children,
}: {
  active: boolean;
  /** Colour of the square marker before the label. */
  tone?: string;
  count?: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 px-3.5 text-[0.8125rem] font-[750] whitespace-nowrap transition-colors",
        active
          ? "bg-ink text-paper"
          : "bg-paper-sunken text-ink hover:bg-[color-mix(in_srgb,var(--ink)_12%,var(--paper))]"
      )}
    >
      {tone && (
        <span
          aria-hidden="true"
          className="size-2.5"
          style={{ background: tone }}
        />
      )}
      {children}
      {count !== undefined && (
        <span
          className={cn(
            "tabular font-[650]",
            active ? "text-paper/65" : "text-ink-subtle"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
