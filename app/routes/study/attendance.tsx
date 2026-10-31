import {
  getAttendanceMatrix,
  issueAttendanceCode,
} from "@app/api/generated/endpoints";
import { EmptyState } from "@app/components/page/States";
import { parseId } from "@app/components/study/study";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@app/components/ui/alert-dialog";
import { Button } from "@app/components/ui/button";
import { Spinner } from "@app/components/ui/spinner";
import { useI18n } from "@app/i18n";
import { t as translate } from "@app/i18n/store";
import { errorMessage } from "@app/lib/errors";
import { formatDate } from "@app/lib/format";
import { cn } from "@app/lib/utils";
import { KeyRoundIcon } from "lucide-react";
import { useFetcher } from "react-router";
import type { Route } from "./+types/attendance";

export function meta() {
  return [{ title: `${translate("study.attendanceAdmin.metaTitle")} | AEGIS` }];
}

export async function clientLoader({
  params,
  request,
}: Route.ClientLoaderArgs) {
  const studyId = parseId(params.studyId);
  return {
    matrix: await getAttendanceMatrix(studyId, { signal: request.signal }),
  };
}

export async function clientAction({ params }: Route.ClientActionArgs) {
  const studyId = parseId(params.studyId);
  try {
    const { code } = await issueAttendanceCode(studyId);
    return { code, message: null };
  } catch (error) {
    return { code: null, message: errorMessage(error) };
  }
}

function todayIso() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export default function Attendance({ loaderData }: Route.ComponentProps) {
  const { t } = useI18n();
  const { sessions, members } = loaderData.matrix;
  const hasToday = sessions.some((session) => session.date === todayIso());

  return (
    <div className="grid gap-10">
      <TodayCode hasToday={hasToday} />

      {sessions.length === 0 ? (
        <EmptyState
          title={t("study.attendanceAdmin.empty")}
          description={t("study.attendanceAdmin.emptyDescription")}
        />
      ) : members.length === 0 ? (
        <EmptyState title={t("study.attendanceAdmin.noMembers")} />
      ) : (
        <div className="relative w-full overflow-x-auto border-y border-ink">
          <table className="w-max min-w-[min(100%,36rem)] border-collapse text-left text-[0.9375rem]">
            <thead className="border-b border-ink">
              <tr>
                <th
                  scope="col"
                  className="eyebrow sticky left-0 z-1 h-14 min-w-36 bg-paper pr-4 align-middle text-ink-muted"
                >
                  {t("study.attendanceAdmin.member")}
                </th>
                {sessions.map((session, index) => (
                  <th
                    key={session.sessionId}
                    scope="col"
                    className="h-14 min-w-16 px-2 text-center align-middle"
                  >
                    <span className="eyebrow block text-ink-muted">
                      {t("study.attendanceAdmin.session", { index: index + 1 })}
                    </span>
                    <span className="tabular block text-[0.8125rem] font-[700]">
                      {formatDate(session.date, {
                        month: "numeric",
                        day: "numeric",
                      })}
                    </span>
                  </th>
                ))}
                <th
                  scope="col"
                  className="eyebrow h-14 min-w-20 pl-4 text-right align-middle text-ink-muted"
                >
                  {t("study.attendanceAdmin.rate")}
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                const attended = member.attendance.filter(Boolean).length;
                return (
                  <tr
                    key={member.memberId}
                    className="border-b border-line last:border-b-0"
                  >
                    <th
                      scope="row"
                      className="sticky left-0 z-1 bg-paper py-3 pr-4 text-left font-[750] whitespace-nowrap"
                    >
                      {member.name}
                    </th>
                    {member.attendance.map((present, index) => (
                      <td
                        key={sessions[index]?.sessionId ?? index}
                        className="px-2 py-3 text-center"
                      >
                        <span
                          role="img"
                          aria-label={t(
                            present
                              ? "study.attendanceAdmin.attended"
                              : "study.attendanceAdmin.absent"
                          )}
                          className={cn(
                            "inline-block size-4",
                            present
                              ? "bg-ink"
                              : "border border-line-strong bg-transparent"
                          )}
                        />
                      </td>
                    ))}
                    <td className="tabular py-3 pl-4 text-right font-[750] whitespace-nowrap">
                      {attended}
                      <span className="text-ink-subtle">
                        {" "}
                        / {sessions.length}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TodayCode({ hasToday }: { hasToday: boolean }) {
  const { t } = useI18n();
  const fetcher = useFetcher<typeof clientAction>({ key: "attendance-code" });
  const busy = fetcher.state !== "idle";
  const code = fetcher.data?.code;
  const failed = !busy ? fetcher.data?.message : null;
  const issue = () => fetcher.submit(null, { method: "post" });

  return (
    <section
      aria-labelledby="today-code"
      className="grid gap-6 border border-ink bg-paper-raised p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-8"
    >
      <div className="grid gap-2">
        <h2 id="today-code" className="eyebrow m-0 text-ink-muted">
          {t("study.attendanceAdmin.todayCode")}
        </h2>
        {code ? (
          <>
            <output
              aria-live="polite"
              className="tabular font-wordmark text-[clamp(3.5rem,9vw,5.5rem)] leading-none font-bold tracking-[0.18em]"
            >
              {code}
            </output>
            <p className="m-0 text-[0.9375rem] text-ink-muted">
              {t("study.attendanceAdmin.codeHint")}
            </p>
          </>
        ) : (
          <p className="m-0 max-w-xl text-[0.9375rem] leading-relaxed text-ink-muted">
            {t("study.attendanceAdmin.issueConfirmDescription")}
          </p>
        )}
        {failed && (
          <p
            role="alert"
            className="m-0 text-[0.875rem] font-[650] text-danger"
          >
            {failed}
          </p>
        )}
      </div>

      {!code &&
        (hasToday ? (
          <Button size="lg" variant="ink" disabled={busy} onClick={issue}>
            {busy ? <Spinner /> : <KeyRoundIcon aria-hidden="true" />}
            {t("study.attendanceAdmin.show")}
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button size="lg" disabled={busy}>
                  {busy ? <Spinner /> : <KeyRoundIcon aria-hidden="true" />}
                  {t("study.attendanceAdmin.issue")}
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("study.attendanceAdmin.issueConfirmTitle")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("study.attendanceAdmin.issueConfirmDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogClose
                  render={
                    <Button variant="outline">{t("common.cancel")}</Button>
                  }
                />
                <AlertDialogClose
                  render={
                    <Button onClick={issue}>
                      {t("study.attendanceAdmin.issueConfirm")}
                    </Button>
                  }
                />
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}
    </section>
  );
}
