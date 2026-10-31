import { ApiError } from "@app/api/client";
import { Period } from "@app/components/site/Wordmark";
import { buttonVariants } from "@app/components/ui/button";
import { Skeleton } from "@app/components/ui/skeleton";
import { useI18n } from "@app/i18n";
import { loginPath } from "@app/lib/auth";
import { errorMessage } from "@app/lib/errors";
import { cn } from "@app/lib/utils";
import { ArrowRightIcon, RotateCwIcon } from "lucide-react";
import type * as React from "react";
import {
  isRouteErrorResponse,
  Link,
  useLocation,
  useRevalidator,
} from "react-router";

interface StateProps {
  title: React.ReactNode;
  /** Small caps line above the title, e.g. the HTTP status. */
  eyebrow?: React.ReactNode;
  /**
   * `page` fills a whole route (not found, error boundary) with a headline
   * sized title; `inline` sits inside a section.
   */
  size?: "inline" | "page";
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  /** `alert` for failures so assistive tech announces them. */
  role?: "status" | "alert";
}

/** Centered message block for empty lists, errors and dead ends. */
export function StateMessage({
  title,
  eyebrow,
  size = "inline",
  description,
  action,
  className,
  role,
}: StateProps) {
  if (size === "page") {
    return (
      <div
        role={role}
        className={cn(
          "gutter-x grid content-start justify-items-start gap-5 pt-[clamp(3rem,9vw,7.5rem)] pb-[clamp(3rem,8vw,6rem)]",
          className
        )}
      >
        {eyebrow && <p className="eyebrow m-0 text-ink-muted">{eyebrow}</p>}
        <h1 className="text-headline m-0 max-w-[18ch]">
          {title}
          <Period />
        </h1>
        {description && (
          <p className="m-0 max-w-xl text-[1rem] leading-relaxed font-[560] text-ink-muted">
            {description}
          </p>
        )}
        {action && <div className="mt-3 flex flex-wrap gap-2">{action}</div>}
      </div>
    );
  }

  return (
    <div
      role={role}
      className={cn(
        "grid justify-items-start gap-4 border-t border-ink py-12",
        className
      )}
    >
      {eyebrow && <p className="eyebrow m-0 text-ink-muted">{eyebrow}</p>}
      <p className="m-0 text-[1.375rem] leading-snug font-[800] tracking-[-0.035em]">
        {title}
      </p>
      {description && (
        <p className="m-0 max-w-xl text-[0.9375rem] leading-relaxed text-ink-muted">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

export function EmptyState(props: Omit<StateProps, "role">) {
  return <StateMessage role="status" {...props} />;
}

export function RetryButton({
  onClick,
  size = "sm",
}: {
  onClick: () => void;
  size?: "sm" | "default";
}) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={onClick}
      className={buttonVariants({ variant: "outline", size })}
    >
      <RotateCwIcon aria-hidden="true" />
      {t("common.retry")}
    </button>
  );
}

/** Rows of grey bars while a list loads. */
export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="grid border-t border-ink" aria-busy="true">
      {Array.from({ length: rows }, (_, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
          key={index}
          className="grid gap-3 border-b border-line py-6"
        >
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-2/3 max-w-md" />
        </div>
      ))}
    </div>
  );
}

function HomeLink() {
  const { t } = useI18n();
  return (
    <Link to="/" className={buttonVariants({ variant: "ink" })}>
      {t("common.states.goHome")}
      <ArrowRightIcon aria-hidden="true" />
    </Link>
  );
}

/** A whole page for addresses that lead nowhere. */
export function NotFoundState() {
  const { t } = useI18n();
  return (
    <StateMessage
      size="page"
      role="alert"
      eyebrow="404"
      title={t("common.states.notFoundTitle")}
      description={t("common.states.notFoundDescription")}
      action={<HomeLink />}
    />
  );
}

/**
 * The body of a route `ErrorBoundary`: 404 and 403 read as dead ends with a
 * way home, everything else offers to retry the route's loaders.
 */
export function RouteErrorState({ error }: { error: unknown }) {
  const { t } = useI18n();
  const revalidator = useRevalidator();
  const location = useLocation();

  const status = isRouteErrorResponse(error)
    ? error.status
    : error instanceof ApiError
      ? error.status
      : undefined;

  if (status === 404) return <NotFoundState />;

  if (status === 401) {
    return (
      <StateMessage
        size="page"
        role="alert"
        title={t("common.states.signedOutTitle")}
        description={t("common.states.signedOutDescription")}
        action={
          <Link
            to={loginPath(location.pathname + location.search)}
            className={buttonVariants({ variant: "ink" })}
          >
            {t("common.states.signIn")}
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        }
      />
    );
  }

  if (status === 403) {
    return (
      <StateMessage
        size="page"
        role="alert"
        eyebrow="403"
        title={t("common.states.forbiddenTitle")}
        description={errorMessage(error)}
        action={<HomeLink />}
      />
    );
  }

  if (!(error instanceof ApiError)) console.error(error);

  return (
    <StateMessage
      size="page"
      role="alert"
      title={t("common.states.errorTitle")}
      description={
        error instanceof ApiError
          ? errorMessage(error)
          : t("common.states.errorDescription")
      }
      action={
        <RetryButton
          size="default"
          onClick={() => void revalidator.revalidate()}
        />
      }
    />
  );
}
