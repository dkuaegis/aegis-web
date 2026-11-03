import { cn } from "@app/lib/utils";

/** The bordered box beside a study that says what the visitor can do next. */
export function Panel({
  heading,
  children,
  className,
}: {
  heading: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-label={heading}
      className={cn(
        "grid gap-5 border border-ink bg-paper-raised p-6",
        className
      )}
    >
      <h2 className="eyebrow m-0 text-ink-muted">{heading}</h2>
      {children}
    </section>
  );
}

export function PanelStatus({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="grid gap-2" role="status">
      <p className="m-0 text-[1.25rem] leading-snug font-[800] tracking-[-0.035em]">
        {title}
      </p>
      {description && (
        <p className="m-0 text-[0.9375rem] leading-relaxed text-ink-muted">
          {description}
        </p>
      )}
    </div>
  );
}
