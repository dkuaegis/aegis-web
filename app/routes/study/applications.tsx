import { getStudyApplications } from "@app/api/generated/endpoints";
import { EmptyState } from "@app/components/page/States";
import { StatusBadge } from "@app/components/study/StatusBadge";
import { parseId } from "@app/components/study/study";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@app/components/ui/table";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { formatDate } from "@app/lib/format";
import { cn } from "@app/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { Link, Outlet, useSearchParams } from "react-router";
import type { Route } from "./+types/applications";

const FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const;
type Filter = (typeof FILTERS)[number];

export function meta() {
  return [{ title: `${translate("study.applications.metaTitle")} | AEGIS` }];
}

export async function clientLoader({
  params,
  request,
}: Route.ClientLoaderArgs) {
  const studyId = parseId(params.studyId);
  const applications = await getStudyApplications(studyId, {
    signal: request.signal,
  });
  // Newest first, so fresh applications are on top.
  applications.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { applications };
}

export default function Applications({ loaderData }: Route.ComponentProps) {
  const { t } = useI18n();
  const { applications } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get("status");
  const filter: Filter =
    FILTERS.find((value) => value === filterParam) ?? "ALL";

  const counts = Object.fromEntries(
    FILTERS.map((value) => [
      value,
      value === "ALL"
        ? applications.length
        : applications.filter((item) => item.status === value).length,
    ])
  ) as Record<Filter, number>;
  const visible =
    filter === "ALL"
      ? applications
      : applications.filter((item) => item.status === filter);

  if (applications.length === 0) {
    return (
      <EmptyState
        title={t("study.applications.empty")}
        description={t("study.applications.emptyDescription")}
      />
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() =>
              setSearchParams(value === "ALL" ? {} : { status: value }, {
                replace: true,
                preventScrollReset: true,
              })
            }
            className={cn(
              "inline-flex h-9 cursor-pointer items-center gap-2 border px-3.5 text-[0.8125rem] font-[750] transition-colors",
              filter === value
                ? "border-ink bg-ink text-paper"
                : "border-line-strong text-ink hover:border-ink"
            )}
          >
            {t(`study.applications.filters.${value}`)}
            <span className="tabular opacity-70">{counts[value]}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState title={t("study.applications.emptyFiltered")} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{t("study.applications.name")}</TableHead>
              <TableHead>{t("study.applications.studentId")}</TableHead>
              <TableHead>{t("study.applications.phone")}</TableHead>
              <TableHead>{t("study.applications.appliedAt")}</TableHead>
              <TableHead>{t("study.applications.status")}</TableHead>
              <TableHead>
                <span className="sr-only">{t("study.applications.view")}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((application) => (
              <TableRow
                key={application.studyApplicationId}
                className="relative"
              >
                <TableCell className="font-[750]">{application.name}</TableCell>
                <TableCell className="tabular text-ink-muted">
                  {application.studentId ?? "–"}
                </TableCell>
                <TableCell className="tabular text-ink-muted">
                  {application.phoneNumber ?? "–"}
                </TableCell>
                <TableCell className="tabular text-ink-muted">
                  {formatDate(application.createdAt, {
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <StatusBadge status={application.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    to={{
                      pathname: String(application.studyApplicationId),
                      search: searchParams.toString(),
                    }}
                    preventScrollReset
                    className="inline-flex items-center gap-1.5 text-[0.875rem] font-[750] text-blue after:absolute after:inset-0 hover:underline"
                  >
                    {t("study.applications.view")}
                    <ArrowRightIcon aria-hidden="true" className="size-4" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Outlet />
    </div>
  );
}
