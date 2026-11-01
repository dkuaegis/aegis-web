import { Period } from "@app/components/site/Wordmark";
import { cn } from "@app/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import type * as React from "react";
import { Link } from "react-router";

interface PageHeaderProps {
  title: React.ReactNode;
  /** Small caps line above the title, e.g. "STUDY" or "02 · 인적사항". */
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  /** Buttons aligned to the bottom right on wide screens. */
  actions?: React.ReactNode;
  back?: { to: string; label: string };
  /** Ends the title with the brand's orange full stop. */
  period?: boolean;
  className?: string;
}

/**
 * The opening band of every inner page: an oversized title on paper, closed
 * by an ink rule, echoing the home hero at a smaller scale.
 */
export function PageHeader({
  title,
  eyebrow,
  description,
  actions,
  back,
  period = true,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "gutter-x border-b border-ink pt-[clamp(2.25rem,6vw,5.5rem)] pb-[clamp(1.75rem,3.5vw,3rem)]",
        className
      )}
    >
      {back && (
        <Link
          to={back.to}
          className="group mb-6 inline-flex items-center gap-[5px] text-[0.875rem] font-[700] text-ink-muted transition-colors hover:text-ink"
        >
          {/* The glyph starts 3px into its box; pull it back so the stroke
              lines up with the title, and the label with eyebrow markers. */}
          <ArrowLeftIcon
            aria-hidden="true"
            className="-ml-[3px] size-4 transition-transform group-hover:-translate-x-0.5"
          />
          {back.label}
        </Link>
      )}
      <div className="grid gap-x-12 gap-y-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="grid min-w-0 gap-4">
          {eyebrow && <p className="eyebrow m-0 text-ink-muted">{eyebrow}</p>}
          <h1 className="text-headline m-0 max-w-[22ch]">
            {title}
            {period && <Period />}
          </h1>
          {description && (
            <p className="m-0 max-w-2xl text-[1rem] leading-relaxed font-[560] text-ink-muted">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap gap-2 md:justify-end">{actions}</div>
        )}
      </div>
    </header>
  );
}

/** Horizontal page padding plus vertical rhythm for the content below a header. */
export function PageBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("gutter-x py-[clamp(2rem,5vw,4.5rem)]", className)}
      {...props}
    />
  );
}
