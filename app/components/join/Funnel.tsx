import { buttonVariants } from "@app/components/ui/button";
import { ErrorText } from "@app/components/ui/field";
import { useI18n } from "@app/i18n";
import { cn } from "@app/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import type * as React from "react";
import { Link } from "react-router";
import { JOIN_STEPS, type JoinStep, joinPath, previousStep } from "./join";

/** Five square bars under the title; the current one is blue. */
export function Stepper({ current }: { current: JoinStep }) {
  const { t } = useI18n();
  const currentIndex = JOIN_STEPS.indexOf(current);

  return (
    <nav aria-label={t("join.steps.progressLabel")} className="gutter-x">
      <ol className="m-0 grid list-none grid-cols-5 gap-1.5 p-0">
        {JOIN_STEPS.map((step, index) => {
          const done = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <li
              key={step}
              aria-current={isCurrent ? "step" : undefined}
              className="grid min-w-0 gap-2.5"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "h-1",
                  isCurrent ? "bg-blue" : done ? "bg-ink" : "bg-line-strong"
                )}
              />
              <span
                className={cn(
                  "flex min-w-0 items-baseline gap-1.5 text-[0.75rem] leading-snug",
                  isCurrent
                    ? "font-[800] text-ink"
                    : done
                      ? "font-[650] text-ink-muted"
                      : "font-[650] text-ink-subtle"
                )}
              >
                <span className="tabular">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {/* Narrow screens keep the numbers; the title names the step. */}
                <span className="truncate max-sm:sr-only">
                  {t(`join.steps.${step}`)}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * The row that ends every step: back on the left, the step's own action on
 * the right, and the reason the last attempt failed above them.
 */
export function StepActions({
  step,
  back = true,
  error,
  children,
}: {
  step: JoinStep;
  /** Off once going back would no longer change anything. */
  back?: boolean;
  error?: string | null;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const previous = back ? previousStep(step) : undefined;

  return (
    <div className="mt-10 grid gap-4">
      {error && <ErrorText role="alert">{error}</ErrorText>}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {previous ? (
          <Link
            to={joinPath(previous)}
            className={buttonVariants({ variant: "ghost", size: "lg" })}
          >
            <ArrowLeftIcon aria-hidden="true" />
            {t("join.actions.back")}
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
        {children}
      </div>
    </div>
  );
}

/** Width of the step's main button on wide screens. */
export const stepButtonClassName = "sm:min-w-48";
